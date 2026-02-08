require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

// --- DATABASE SETUP ---
let dbType = 'lowdb';
let User; // Mongoose Model
let db;   // LowDB Instance

// Check for MongoDB
if (process.env.MONGO_URI) {
    dbType = 'mongo';
    // Mask password for safety in logs
    const uriMasked = process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@');
    console.log(`[SERVER] MONGO_URI found: ${uriMasked}`);
    console.log('[SERVER] Connecting to MongoDB...');

    mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000 // Fail fast if network is blocked
    })
        .then(() => console.log('[SERVER] Connected to MongoDB'))
        .catch(err => {
            console.error('[SERVER] MongoDB Connection Error:', err.message);
            console.error('[SERVER] CHECK: 1. Network Access in Atlas (0.0.0.0/0)');
            console.error('[SERVER] CHECK: 2. Database User Password');
        });

    const userSchema = new mongoose.Schema({
        wallet: { type: String, required: true, unique: true },
        name: { type: String, default: '' },
        avatar: { type: String, default: null },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 1 }
    });
    User = mongoose.model('User', userSchema);
} else {
    console.log('[SERVER] No MONGO_URI. Using local LowDB (db.json). NOT PERSISTENT ON RENDER!');
    const low = require('lowdb');
    const FileSync = require('lowdb/adapters/FileSync');
    const adapter = new FileSync('db.json');
    db = low(adapter);
    db.defaults({ users: [] }).write();
}

// --- DB HELPERS (ASYNC) ---

const getUser = async (wallet) => {
    if (dbType === 'mongo') {
        let user = await User.findOne({ wallet });
        if (!user) {
            console.log(`[SERVER-MONGO] Creating new user for ${wallet}`);
            user = new User({ wallet, wins: 0, losses: 0, xp: 0, level: 1, name: '', avatar: null });
            await user.save();
        }
        return user.toObject(); // Return plain object
    } else {
        const user = db.get('users').find({ wallet }).value();
        if (!user) {
            console.log(`[SERVER-LOWDB] Creating new user for ${wallet}`);
            const newUser = { wallet, wins: 0, losses: 0, xp: 0, level: 1, name: '', avatar: null };
            db.get('users').push(newUser).write();
            return newUser;
        }
        return user;
    }
};

const updateStats = async (wallet, result) => {
    // result = 'win' or 'loss'
    if (dbType === 'mongo') {
        const user = await User.findOne({ wallet });
        if (user) {
            if (result === 'win') {
                user.wins += 1;
                user.xp += 20;
            } else {
                user.losses += 1;
                user.xp += 5;
            }
            // Level up logic
            const newLevel = Math.floor(user.xp / 100) + 1;
            if (newLevel > user.level) {
                user.level = newLevel;
            }
            await user.save();
            console.log(`[SERVER-MONGO] Updated stats for ${wallet}`);
        }
    } else {
        const user = db.get('users').find({ wallet });
        if (user.value()) {
            const current = user.value();
            let updates = {};
            if (result === 'win') {
                updates.wins = current.wins + 1;
                updates.xp = current.xp + 20;
            } else {
                updates.losses = current.losses + 1;
                updates.xp = current.xp + 5;
            }
            const newLevel = Math.floor(updates.xp / 100) + 1;
            if (newLevel > current.level) {
                updates.level = newLevel;
            }
            user.assign(updates).write();
            console.log(`[SERVER-LOWDB] Updated stats for ${wallet}`);
        }
    }
};

const updateUserProfile = async (wallet, name, avatar) => {
    if (dbType === 'mongo') {
        const updates = {};
        if (name && name.trim() !== '') updates.name = name;
        if (avatar && avatar.trim() !== '') updates.avatar = avatar;

        if (Object.keys(updates).length > 0) {
            await User.updateOne({ wallet }, updates);
            console.log(`[SERVER-MONGO] Profile updated for ${wallet}`);
        }
    } else {
        const updates = {};
        if (name && name.trim() !== '') updates.name = name;
        if (avatar && avatar.trim() !== '') updates.avatar = avatar;

        if (Object.keys(updates).length > 0) {
            db.get('users').find({ wallet }).assign(updates).write();
            console.log(`[SERVER-LOWDB] Profile updated for ${wallet}`);
        }
    }
};

const getLeaderboard = async () => {
    if (dbType === 'mongo') {
        const users = await User.find({})
            .sort({ xp: -1 }) // Descending XP
            .limit(100)
            .lean();
        return users;
    } else {
        const rawUsers = db.get('users').value();
        return rawUsers
            .filter(u => u.wallet && !u.wallet.startsWith('Guest'))
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 100);
    }
};


// --- API ROUTES ---

app.get('/leaderboard', async (req, res) => {
    try {
        const users = await getLeaderboard();
        console.log(`[SERVER] Leaderboard request. Users found: ${users.length}`);
        res.json(users);
    } catch (e) {
        console.error("Leaderboard Error:", e);
        res.status(500).json([]);
    }
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// --- STATE MANAGEMENT ---
let waitingPlayer = null;
const games = {};
const disconnectTimers = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // 0. CHECK ACTIVE GAME (Reconnection)
    socket.on('check_active_game', async (wallet) => {
        console.log(`[SERVER] Checking active game for wallet: ${wallet}`);
        let found = false;

        for (const [rid, game] of Object.entries(games)) {
            const pIds = Object.keys(game.playerData);
            for (const pid of pIds) {
                if (game.playerData[pid].wallet === wallet) {
                    found = true;

                    // CANCEL DISCONNECT TIMER
                    if (disconnectTimers[wallet]) {
                        clearTimeout(disconnectTimers[wallet].timeout);
                        delete disconnectTimers[wallet];
                        console.log(`[SERVER] Cancelled disconnect timer for ${wallet}`);
                    }

                    // SWAP SOCKETS
                    const oldSocketId = pid;
                    const newSocketId = socket.id;

                    console.log(`[SERVER] Swapping socket ${oldSocketId} -> ${newSocketId} for wallet ${wallet}`);

                    // Update Game Data
                    const myData = game.playerData[oldSocketId];
                    delete game.playerData[oldSocketId];
                    game.playerData[newSocketId] = myData;

                    game.players = game.players.filter(id => id !== oldSocketId);
                    game.players.push(newSocketId);

                    socket.join(rid);

                    // Notify Opponent
                    const otherPlayerSocketId = game.players.find(id => id !== newSocketId);
                    if (otherPlayerSocketId) {
                        io.to(otherPlayerSocketId).emit('game_update', { type: 'opponent_reconnected', payload: {} });
                        io.to(otherPlayerSocketId).emit('request_state_sync', {});
                    }

                    // Emit Rejoin Success
                    socket.emit('rejoin_success', {
                        roomId: rid,
                        color: myData.color,
                        players: game.playerData
                    });

                    break;
                }
            }
            if (found) break;
        }
    });

    // 1. MATCHMAKING
    socket.on('find_match', async (clientUserData) => {
        console.log(`[SERVER] find_match received from ${clientUserData.wallet}`);

        let user;
        if (clientUserData.wallet && !clientUserData.wallet.startsWith('Guest')) {
            user = await getUser(clientUserData.wallet); // Async Get/Create

            // Sync Name if different
            if (clientUserData.name && clientUserData.name !== user.name) {
                await updateUserProfile(clientUserData.wallet, clientUserData.name, null);
                user.name = clientUserData.name;
            }
        } else {
            // Guest
            user = { ...clientUserData, wins: 0, losses: 0, level: 1 };
        }

        const userData = {
            ...clientUserData,
            level: user.level,
            stats: { wins: user.wins || 0, losses: user.losses || 0, xp: user.xp || 0 }
        };

        // RECONNECTION CHECK (Redundant but safe)
        // ... (Similar loop to check_active_game, but let's assume check_active_game handled it if called first)
        // But if user skips check_active_game, we should check here too?
        // For simplicity, we trust check_active_game logic or standard flow. 
        // But let's check briefly for duplicate lobby join.

        if (waitingPlayer) {
            // Avoid self-match
            if (waitingPlayer.socketId === socket.id || (waitingPlayer.userData.wallet && waitingPlayer.userData.wallet === userData.wallet)) {
                return;
            }

            // MATCH FOUND
            console.log(`[SERVER] Match found: ${waitingPlayer.userData.name} vs ${userData.name}`);
            const opponent = waitingPlayer;
            waitingPlayer = null;

            const roomId = `game_${opponent.socketId}_${socket.id}`;
            socket.join(roomId);
            const opponentSocket = io.sockets.sockets.get(opponent.socketId);
            if (opponentSocket) opponentSocket.join(roomId);

            games[roomId] = {
                id: roomId,
                players: [opponent.socketId, socket.id],
                playerData: {
                    [opponent.socketId]: { ...opponent.userData, color: 'white' },
                    [socket.id]: { ...userData, color: 'red' }
                },
                board: null,
                turn: null
            };

            io.to(opponent.socketId).emit('match_found', {
                roomId,
                players: games[roomId].playerData,
                yourColor: 'white'
            });
            io.to(socket.id).emit('match_found', {
                roomId,
                players: games[roomId].playerData,
                yourColor: 'red'
            });

            setTimeout(() => {
                io.to(opponent.socketId).emit('assign_color', 'white');
                io.to(socket.id).emit('assign_color', 'red');
            }, 500);

        } else {
            // QUEUE
            console.log(`[SERVER] Queued player: ${userData.name}`);
            waitingPlayer = { socketId: socket.id, userData };
            socket.emit('waiting_for_match');
        }
    });

    // 2. GAME EVENTS
    socket.on('game_event', async ({ roomId, type, payload }) => {
        socket.to(roomId).emit('game_update', { type, payload });

        if (type === 'resign') {
            const game = games[roomId];
            if (game) {
                const loserSocketId = socket.id;
                const winnerSocketId = game.players.find(pid => pid !== loserSocketId);

                if (game.playerData[loserSocketId] && game.playerData[winnerSocketId]) {
                    const lWallet = game.playerData[loserSocketId].wallet;
                    const wWallet = game.playerData[winnerSocketId].wallet;

                    if (lWallet && !lWallet.startsWith('Guest')) await updateStats(lWallet, 'loss');
                    if (wWallet && !wWallet.startsWith('Guest')) await updateStats(wWallet, 'win');
                }
                delete games[roomId];
            }
        }
    });

    // 3. SYNC
    socket.on('sync_state', ({ roomId, state }) => {
        if (roomId && state) {
            socket.to(roomId).emit('sync_state_received', state);
        }
    });

    // 4. CHAT
    socket.on('chat_message', ({ roomId, message, sender }) => {
        socket.to(roomId).emit('chat_message', { sender, text: message });
    });

    // 5. WITHDRAW
    socket.on('request_withdraw', ({ wallet, amount }) => {
        setTimeout(() => {
            const mockSignature = "5KiW...WithdrawSig..." + Date.now();
            socket.emit('withdraw_success', { amount, signature: mockSignature });
        }, 1000);
    });

    // 6. FINISH GAME
    socket.on('finish_game', async ({ roomId, result }) => {
        const game = games[roomId];
        if (game) {
            const winnerSocketId = socket.id;
            const loserSocketId = game.players.find(pid => pid !== winnerSocketId);

            if (winnerSocketId && loserSocketId) {
                const wData = game.playerData[winnerSocketId];
                const lData = game.playerData[loserSocketId];

                if (wData && lData) {
                    if (wData.wallet && !wData.wallet.startsWith('Guest')) await updateStats(wData.wallet, 'win');
                    if (lData.wallet && !lData.wallet.startsWith('Guest')) await updateStats(lData.wallet, 'loss');
                }
            }
            delete games[roomId];
        }
    });

    // 7. REGISTER / SYNC PROFILE
    socket.on('register_user', async (data) => {
        const wallet = (typeof data === 'string') ? data : data.wallet;
        const name = (typeof data === 'object') ? data.name : null;
        const avatar = (typeof data === 'object') ? data.avatar : null;

        if (wallet && !wallet.startsWith('Guest')) {
            const user = await getUser(wallet); // Ensure exists

            // Update Profile if provided
            if (name || avatar) {
                await updateUserProfile(wallet, name, avatar);
                if (name && name.trim() !== '') user.name = name;
                if (avatar && avatar.trim() !== '') user.avatar = avatar;
            }

            // Emit back authoritative stats from DB
            socket.emit('user_profile_update', {
                name: user.name,
                avatar: user.avatar,
                stats: {
                    wins: user.wins || 0,
                    losses: user.losses || 0,
                    xp: user.xp || 0,
                    level: user.level || 1
                }
            });
            console.log(`[SERVER] Sent user_profile_update to ${socket.id} (${wallet})`);
        }
    });

    // 8. SINGLE PLAYER STATS
    socket.on('update_single_player_stats', async ({ wallet, result }) => {
        if (wallet && !wallet.startsWith('Guest')) {
            await updateStats(wallet, result);
        }
    });

    // 9. DISCONNECT
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (waitingPlayer && waitingPlayer.socketId === socket.id) {
            waitingPlayer = null;
        }

        // Handle Active Games
        for (const [roomId, game] of Object.entries(games)) {
            if (game.players.includes(socket.id)) {
                const myData = game.playerData[socket.id];
                const wallet = myData ? myData.wallet : null;

                if (wallet) {
                    io.to(roomId).emit('game_update', { type: 'opponent_disconnectING', payload: { timeLeft: 60 } });

                    disconnectTimers[wallet] = {
                        roomId,
                        timeout: setTimeout(() => {
                            if (games[roomId]) {
                                io.to(roomId).emit('game_update', { type: 'opponent_disconnected', payload: {} });
                                delete games[roomId];
                            }
                            delete disconnectTimers[wallet];
                        }, 60000)
                    };
                } else {
                    socket.to(roomId).emit('game_update', { type: 'opponent_disconnected', payload: {} });
                    delete games[roomId];
                }
                break;
            }
        }
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING on port ${PORT}`);
});
