const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// --- DATABASE SETUP ---
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ users: [] }).write();

// Helper to get or create user
const getUser = (wallet) => {
    // Force Read from disk to be sure? No, lowdb is sync.
    const user = db.get('users').find({ wallet }).value();
    if (!user) {
        console.log(`[SERVER] Creating new user for ${wallet}`);
        const newUser = { wallet, wins: 0, losses: 0, xp: 0, level: 1, name: '', avatar: null };
        db.get('users').push(newUser).write();
        return newUser;
    }
    return user;
};

// Helper to update stats
const updateStats = (wallet, result) => {
    // result = 'win' or 'loss'
    const user = db.get('users').find({ wallet });
    if (user.value()) {
        if (result === 'win') {
            user.assign({ wins: user.value().wins + 1, xp: user.value().xp + 20 }).write();
        } else {
            user.assign({ losses: user.value().losses + 1, xp: user.value().xp + 5 }).write();
        }
        // Level up logic (simple: level = floor(xp / 100) + 1)
        const newLevel = Math.floor(user.value().xp / 100) + 1;
        if (newLevel > user.value().level) {
            user.assign({ level: newLevel }).write();
        }
    }
};

// API: Get Leaderboard
app.get('/leaderboard', (req, res) => {
    const rawUsers = db.get('users').value();
    console.log(`[SERVER] Leaderboard request. Total users in DB: ${rawUsers.length}`);

    const users = rawUsers
        .filter(u => u.wallet && !u.wallet.startsWith('Guest'))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 100);

    res.json(users);
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow connection from any frontend (local or deployed)
        methods: ["GET", "POST"]
    }
});

// Store active games and queuing players
let waitingPlayer = null; // { socketId, name, wallet } (Simple 1v1 queue)
const games = {}; // roomId -> { players: [socketId1, socketId2], board: ..., turn: ... }
const disconnectTimers = {}; // wallet -> { timeout, roomId, oldSocketId }

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('check_active_game', (wallet) => {
        console.log(`[SERVER] Checking active game for wallet: ${wallet}`);
        let found = false;
        // Check active games for this wallet
        for (const [rid, game] of Object.entries(games)) {
            const pIds = Object.keys(game.playerData);
            for (const pid of pIds) {
                if (game.playerData[pid].wallet === wallet) {
                    found = true;

                    // CANCEL DISCONNECT TIMER
                    if (disconnectTimers[wallet]) {
                        clearTimeout(disconnectTimers[wallet].timeout);
                        delete disconnectTimers[wallet];
                        console.log(`[SERVER] Cancelled disconnect timer for ${wallet} in check_active_game.`);
                    } else {
                        console.warn(`[SERVER] Timer not found for ${wallet} during check_active_game! Keys: ${Object.keys(disconnectTimers)}`);
                    }

                    // SWAP SOCKETS TO PREVENT DISCONNECT LOGIC FROM TRIGGERING ON OLD SOCKET
                    const oldSocketId = pid;
                    const newSocketId = socket.id;

                    console.log(`[SERVER] Swapping socket ${oldSocketId} -> ${newSocketId} for wallet ${wallet}`);

                    // 1. Update Player Data
                    const myData = game.playerData[oldSocketId];
                    delete game.playerData[oldSocketId];
                    game.playerData[newSocketId] = myData;

                    // 2. Update Players Array
                    game.players = game.players.filter(id => id !== oldSocketId);
                    game.players.push(newSocketId);

                    // 3. Join Room
                    socket.join(rid);

                    // 4. Notify Opponent Reconnection
                    const otherPlayerSocketId = game.players.find(id => id !== newSocketId);
                    if (otherPlayerSocketId) {
                        io.to(otherPlayerSocketId).emit('game_update', { type: 'opponent_reconnected', payload: {} });
                        // Ask for sync
                        io.to(otherPlayerSocketId).emit('request_state_sync', {});
                        console.log(`[SERVER] Sent opponent_reconnected to ${otherPlayerSocketId}`);
                    }

                    // 5. Emit Rejoin Success to Client
                    socket.emit('rejoin_success', {
                        roomId: rid,
                        color: myData.color,
                        players: game.playerData
                    });

                    // We don't need 'active_game_found' anymore as we handled it here.
                    // socket.emit('active_game_found', { roomId: rid }); 

                    console.log(`[SERVER] Rejoin complete for ${wallet} in check_active_game.`);

                    break;
                }
            }
            if (found) break;
        }
    });

    // 1. Matchmaking
    socket.on('find_match', (clientUserData) => {
        // clientUserData = { name, wallet, ... }
        console.log(`[SERVER] find_match received for socket ${clientUserData.name}`, clientUserData.wallet);

        let user;
        if (clientUserData.wallet && !clientUserData.wallet.startsWith('Guest')) {
            user = getUser(clientUserData.wallet);
            // Update name if changed
            if (clientUserData.name && clientUserData.name !== user.name) {
                db.get('users').find({ wallet: clientUserData.wallet }).assign({ name: clientUserData.name }).write();
                user.name = clientUserData.name;
            }
        } else {
            // Guest User (No DB persistence)
            user = { ...clientUserData, wins: 0, losses: 0, level: 1 };
        }

        const userData = {
            ...clientUserData,
            // Override stats with DB values
            level: user.level,
            stats: { wins: user.wins || 0, losses: user.losses || 0, xp: user.xp || 0 }
        };

        // RECONNECTION LOGIC
        let existingGameId = null;
        let existingGame = null;
        if (userData.wallet) {
            for (const [rid, game] of Object.entries(games)) {
                const pIds = Object.keys(game.playerData);
                for (const pid of pIds) {
                    if (game.playerData[pid].wallet === userData.wallet) {
                        existingGameId = rid;
                        existingGame = game;
                        break;
                    }
                }
                if (existingGameId) break;
            }
        }

        if (existingGameId) {
            // REJOINING
            console.log(`Player ${userData.name} rejoining game ${existingGameId}`);

            if (disconnectTimers[userData.wallet]) {
                clearTimeout(disconnectTimers[userData.wallet].timeout);
                delete disconnectTimers[userData.wallet];
                console.log("Disconnect timer cancelled.");
            }

            const oldSocketId = Object.keys(existingGame.playerData).find(pid => existingGame.playerData[pid].wallet === userData.wallet);
            const opponentSocketId = existingGame.players.find(id => id !== oldSocketId);

            const myData = existingGame.playerData[oldSocketId];
            delete existingGame.playerData[oldSocketId];
            existingGame.playerData[socket.id] = myData;

            // Remove old socket id from players array, add new one
            existingGame.players = existingGame.players.filter(id => id !== oldSocketId);
            existingGame.players.push(socket.id);

            socket.join(existingGameId);

            socket.to(existingGameId).emit('game_update', { type: 'opponent_reconnected', payload: {} });

            // Ask opponent to sync state to us
            socket.to(existingGameId).emit('request_state_sync', {});

            // Use 'rejoin_success' or just 'assign_color' again?
            // Client expects 'assign_color' to set 'playerColor'.
            const myColor = myData.color;
            socket.emit('rejoin_success', {
                roomId: existingGameId,
                color: myData.color,
                players: existingGame.playerData
            });

            return;
        }

        // NORMAL MATCHMAKING
        if (waitingPlayer) {
            // Check if matching with self (e.g. double click or race condition)
            if (waitingPlayer.socketId === socket.id) {
                console.log("[SERVER] Player tried to match with themselves. Ignoring.");
                return;
            }
            if (waitingPlayer.userData.wallet && waitingPlayer.userData.wallet === userData.wallet) {
                console.log("[SERVER] Wallet tried to match with itself. Ignoring.");
                waitingPlayer.socketId = socket.id; // Update socket just in case
                return;
            }

            // Match Found!
            console.log(`[SERVER] Match found: ${waitingPlayer.userData.name} vs ${userData.name}`);

            const opponent = waitingPlayer;
            waitingPlayer = null;

            const roomId = `game_${opponent.socketId}_${socket.id}`;
            socket.join(roomId);
            const opponentSocket = io.sockets.sockets.get(opponent.socketId);
            if (opponentSocket) opponentSocket.join(roomId);

            // Initialize Game State
            games[roomId] = {
                id: roomId,
                players: [opponent.socketId, socket.id], // [Player1 (White), Player2 (Red)]
                playerData: {
                    [opponent.socketId]: { ...opponent.userData, color: 'white' }, // Player 1
                    [socket.id]: { ...userData, color: 'red' }   // Player 2
                },
                board: null, // Will be init by clients or server
                turn: null
            };

            // Notify Players Individually to ensure delivery
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

            // Send specific color assignments with slight delay to allow React to render match screen first
            setTimeout(() => {
                io.to(opponent.socketId).emit('assign_color', 'white');
                io.to(socket.id).emit('assign_color', 'red');
            }, 500);

            console.log(`Match created: ${roomId}`);

        } else {
            // Queue Player
            console.log(`[SERVER] Queued player: ${userData.name}`);
            waitingPlayer = {
                socketId: socket.id,
                userData
            };
            socket.emit('waiting_for_match');
        }
    });

    // 2. Game Events Relay
    socket.on('game_event', ({ roomId, type, payload }) => {
        // Simple Relay: If User A sends 'roll', send 'opponent_roll' to User B
        socket.to(roomId).emit('game_update', { type, payload });

        // CLEANUP GAME ON END
        if (type === 'resign') {
            console.log(`[SERVER] Game ${roomId} ended via resignation. Updating stats.`);

            const game = games[roomId];
            if (game) {
                const loserSocketId = socket.id;
                const winnerSocketId = game.players.find(pid => pid !== loserSocketId);

                if (game.playerData && game.playerData[loserSocketId] && game.playerData[winnerSocketId]) {
                    const lWallet = game.playerData[loserSocketId].wallet;
                    const wWallet = game.playerData[winnerSocketId].wallet;

                    if (lWallet && !lWallet.startsWith('Guest')) updateStats(lWallet, 'loss');
                    if (wWallet && !wWallet.startsWith('Guest')) updateStats(wWallet, 'win');

                    console.log(`[SERVER] Stats updated (Resign): ${wWallet} (W) vs ${lWallet} (L)`);
                }
            }
            delete games[roomId];
        }
    });

    // 3. State Sync Request
    socket.on('sync_state', ({ roomId, state }) => {
        // Relay state to the OTHER player (the one who just rejoined)
        socket.to(roomId).emit('game_update', { type: 'state_update', payload: state });
    });

    // 2b. State Sync Relay
    socket.on('sync_state', ({ roomId, state }) => {
        socket.to(roomId).emit('game_update', { type: 'state_update', payload: state });
    });

    // 3. Chat Relay
    socket.on('chat_message', ({ roomId, message, sender }) => {
        socket.to(roomId).emit('chat_message', { sender, text: message });
    });

    // 3b. Wallet Logic (Mock Escrow)
    socket.on('request_withdraw', ({ wallet, amount }) => {
        console.log(`Withdrawal request from ${wallet} for ${amount} SOL`);
        // Simulate Processing Delay
        setTimeout(() => {
            // In a real app, this would sign a transaction from the server-side wallet
            const mockSignature = "5KiW...WithdrawSig..." + Date.now();
            socket.emit('withdraw_success', { amount, signature: mockSignature });
        }, 1000);
    });

    // 5. Game Over / Result Handler
    socket.on('finish_game', ({ roomId, result }) => {
        // result = 'win' (sender claims win)
        console.log(`[SERVER] Game FINISH claimed: ${result} by ${socket.id} in ${roomId}`);

        const game = games[roomId];
        if (game) {
            // Identify Winner and Loser
            const winnerSocketId = socket.id;
            const loserSocketId = game.players.find(pid => pid !== winnerSocketId);

            if (winnerSocketId && loserSocketId && game.playerData) {
                const wData = game.playerData[winnerSocketId];
                const lData = game.playerData[loserSocketId];

                if (wData && lData) {
                    const winnerWallet = wData.wallet;
                    const loserWallet = lData.wallet;

                    // Update DB Stats
                    if (winnerWallet && !winnerWallet.startsWith('Guest')) updateStats(winnerWallet, 'win');
                    if (loserWallet && !loserWallet.startsWith('Guest')) updateStats(loserWallet, 'loss');

                    console.log(`[SERVER] Stats updated: ${winnerWallet} (W) vs ${loserWallet} (L)`);
                }
            }

            // Delete Game immediately to prevent rejoin loop
            delete games[roomId];
        }
    });

    // 6. User Registration (for Leaderboard visibility + Profile Sync)
    socket.on('register_user', (data) => {
        const wallet = (typeof data === 'string') ? data : data.wallet;
        const name = (typeof data === 'object') ? data.name : null;
        const avatar = (typeof data === 'object') ? data.avatar : null;

        if (wallet && !wallet.startsWith('Guest')) {
            getUser(wallet); // Ensures user exists

            // Update Profile if provided
            if (name || avatar) {
                const updates = {};
                if (name && name.trim() !== '') updates.name = name;
                if (avatar && avatar.trim() !== '') updates.avatar = avatar;

                db.get('users').find({ wallet }).assign(updates).write();
                console.log(`[SERVER] Updated profile for ${wallet}: ${name}`);
            } else {
                console.log(`[SERVER] Registered user: ${wallet}`);
            }
        }
    });

    // 7. Single Player Stats
    socket.on('update_single_player_stats', ({ wallet, result }) => {
        console.log(`[SERVER] Single Player Update: ${wallet} (${result})`);
        if (wallet && !wallet.startsWith('Guest')) {
            updateStats(wallet, result);
        }
    });

    // 4. Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        // Remove from Queue
        if (waitingPlayer && waitingPlayer.socketId === socket.id) {
            waitingPlayer = null;
            console.log("Removed from queue");
        }

        // Handle Active Games
        for (const [roomId, game] of Object.entries(games)) {
            if (game.players.includes(socket.id)) {
                console.log(`Found active game ${roomId} for disconnected user.`);

                const myData = game.playerData[socket.id];
                const wallet = myData ? myData.wallet : null;

                console.log(`Processing disconnect for wallet: ${wallet}`);

                if (wallet) {
                    console.log(`Player ${wallet} disconnected. Emitting 'opponent_disconnectING' to room ${roomId}.`);

                    // Notify opponent - ensure roomId is valid string
                    io.to(roomId).emit('game_update', { type: 'opponent_disconnectING', payload: { timeLeft: 60 } });

                    disconnectTimers[wallet] = {
                        roomId,
                        oldSocketId: socket.id,
                        timeout: setTimeout(() => {
                            // TIMEOUT REACHED - FINAL DISCONNECT
                            console.log(`Grace period expired for ${wallet}. Ending game.`);

                            // Check if game still exists (might have reconnected)
                            if (games[roomId]) {
                                // Notify actual game over
                                io.to(roomId).emit('game_update', {
                                    type: 'opponent_disconnected',
                                    payload: {}
                                });
                                delete games[roomId];
                            }
                            delete disconnectTimers[wallet];
                        }, 60000) // 60 Seconds
                    };
                } else {
                    // Guest / No Wallet -> Instant Loss (Cannot reliably identify RE-connect)
                    console.log(`Guest disconnected. Ending game ${roomId} immediately.`);
                    socket.to(roomId).emit('game_update', {
                        type: 'opponent_disconnected',
                        payload: {}
                    });
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
