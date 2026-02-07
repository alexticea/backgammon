const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

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

    // 1. Matchmaking
    socket.on('find_match', (userData) => {
        // userData = { name, wallet }
        console.log(`Player ${userData.name} (${userData.wallet || 'No Wallet'}) looking for match...`);

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
            // Existing client logic handles 'match_found' well? Or we replicate it.
            // Client expects 'assign_color' to set 'playerColor'.
            const myColor = myData.color;
            socket.emit('rejoin_success', { roomId: existingGameId, color: myData.color }); // Client might need to handle this

            return;
        }

        // NORMAL MATCHMAKING
        if (waitingPlayer) {
            // Match Found!
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

            // Notify Players
            io.to(roomId).emit('match_found', {
                roomId,
                players: games[roomId].playerData,
                yourColor: 'red' // Default payload, overridden below for specific socket
            });

            // Send specific color assignments
            io.to(opponent.socketId).emit('assign_color', 'white');
            io.to(socket.id).emit('assign_color', 'red');

            console.log(`Match created: ${roomId}`);

        } else {
            // Queue Player
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
                    io.to(roomId).emit('game_update', { type: 'opponent_disconnectING', payload: { timeLeft: 30 } });

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
                        }, 30000) // 30 Seconds
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
