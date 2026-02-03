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

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // 1. Matchmaking
    socket.on('find_match', (userData) => {
        // userData = { name, wallet }
        console.log(`Player ${userData.name} looking for match...`);

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

    // 3. Chat Relay
    socket.on('chat_message', ({ roomId, message, sender }) => {
        socket.to(roomId).emit('chat_message', { sender, text: message });
    });

    // 4. Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (waitingPlayer && waitingPlayer.socketId === socket.id) {
            waitingPlayer = null;
        }
        // Ideally handle game forfeit here
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING on port ${PORT}`);
});
