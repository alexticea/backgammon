import React, { useState, useEffect, useRef, useMemo } from 'react';
import io from 'socket.io-client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { App as CapApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
import { buildConnectUrl, handleConnectCallback } from './SolanaLogin';
import './index.css';

// Polyfill if needed for Buffer (handled in main.jsx usually)

// --- CONSTANTS ---
const PLAYER_HUMAN = 1;  // White (Moves 23 -> 0)
const PLAYER_AI = -1;    // Red (Moves 0 -> 23)
const BAR_HUMAN = 25;    // Conceptual index
const BAR_AI = 26;       // Conceptual index

// --- HELPERS ---
// React destructuring removed as we import them.

function App() {
    // --- CONFIG ---
    // Determine Server URL: Local vs Production
    // Determine Server URL:
    // - If Capacitor (Mobile App), use Production (Localhost 3001 on phone != PC).
    // - If Local Browser, use Localhost 3001.
    const isCapacitor = !!window.Capacitor;
    const isLocal = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.startsWith('192.168.') ||
        window.location.hostname.startsWith('10.') ||
        window.location.hostname.startsWith('172.') ||
        window.location.protocol === 'file:';

    const PRODUCTION_FRONTEND_URL = 'https://backgammon-beige.vercel.app';
    const PRODUCTION_BACKEND_URL = 'https://backgammon-usxq.onrender.com';

    // FOR LOCAL TESTING: Change this to your PC's local IP (e.g., 192.168.1.5) 
    // to test between two phones on the same WiFi.
    const LOCAL_IP = '192.168.100.191'; // <-- UPDATE THIS TO YOUR PC IP

    const SERVER_URL = isCapacitor ? PRODUCTION_BACKEND_URL : (isLocal ? `http://${window.location.hostname}:3001` : PRODUCTION_BACKEND_URL);

    // --- STATE ---
    const [wallet, setWallet] = useState(() => {
        return localStorage.getItem('bg_wallet_address') || null;
    });
    const setWalletValue = (val) => {
        setWallet(val);
        if (val) {
            localStorage.setItem('bg_wallet_address', val);
        } else {
            localStorage.removeItem('bg_wallet_address');
        }
    };
    const [balance, setBalance] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('bg_is_logged_in') === 'true';
    });
    const setLoggedInValue = (val) => {
        setIsLoggedIn(val);
        localStorage.setItem('bg_is_logged_in', val ? 'true' : 'false');
    };
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // --- WALLET HOOKS ---
    const { connection } = useConnection();
    const { publicKey, sendTransaction, signMessage, disconnect, connected, select, wallets, connect, wallet: activeWallet } = useWallet();
    const { setVisible } = useWalletModal();

    // 0. Capacitor App Deep Link Listener
    useEffect(() => {
        if (isCapacitor) {
            const processUrl = (url) => {
                console.log(`App processing URL: ${url}`);
                if (url && url.includes('backgammon://')) {
                    try {
                        const result = handleConnectCallback(url);
                        if (result && result.publicKey) {
                            const pKeyStr = result.publicKey.toBase58();
                            console.log(`Deep link connect success! Key: ${pKeyStr.slice(0, 4)}...`);

                            // Set LoggedIn FIRST before alert blocks
                            setLoggedInValue(true);
                            setWalletValue(pKeyStr);
                            handleWalletConnection(pKeyStr);
                        } else {
                            alert("Solflare callback yielded no keys. Try again.");
                            console.log(`Deep link result was null.`);
                        }
                    } catch (err) {
                        alert(`Deep Link Error:\n\n${err.message}`);
                        console.log(`Deep link connect error: ${err.message}`);
                    }
                }
            };

            // Check if app was opened via deep link when closed/killed
            CapApp.getLaunchUrl().then(launchData => {
                if (launchData && launchData.url) {
                    processUrl(launchData.url);
                }
            });

            // Listen for deep links when app is already open
            const listener = CapApp.addListener('appUrlOpen', data => {
                if (data && data.url) {
                    processUrl(data.url);
                }
            });
            return () => {
                if (listener.remove) listener.remove();
            };
        }
    }, [isCapacitor]);

    // 0.1 Hide StatusBar for Fullscreen
    useEffect(() => {
        if (isCapacitor) {
            StatusBar.hide().catch(e => console.warn("StatusBar hide failed", e));
        }
    }, [isCapacitor]);

    // 1. Sync Wallet State & Auto-Login
    useEffect(() => {
        if (connected && publicKey) {
            const pKeyStr = publicKey.toBase58();
            if (wallet !== pKeyStr) {
                setWalletValue(pKeyStr);
                handleWalletConnection(pKeyStr);
                log(`Connected: ${pKeyStr.slice(0, 4)}...${pKeyStr.slice(-4)}`);
            }
        } else if (!isCapacitor && !connected && wallet && !wallet.startsWith('Guest') && !wallet.startsWith('Mock')) {
            // ONLY clear if it's not a Guest or Mock wallet (and not Capacitor deep handling)
            setWalletValue(null);
            setLoggedInValue(false);
        }
    }, [connected, publicKey, wallet]);

    // 2. Desktop/Mobile Bridge: Trigger connect() when a wallet is selected from the list
    useEffect(() => {
        if (activeWallet && !connected && !isLoggingIn) {
            log(`Attempting connection to ${activeWallet.adapter.name}...`);
            connect().catch(err => {
                log(`Connection failed: ${err.message?.slice(0, 30)}`);
            });
        }
    }, [activeWallet, connected, isLoggingIn]);

    // Board: 0-23 are standard points.
    // visual layout will handle mapping.
    // Start Setup:
    // Human (White) starts at 23 (2 checkers), 12 (5), 7 (3), 5 (5)
    // AI (Red) starts at 0 (2 checkers), 11 (5), 16 (3), 18 (5)

    const initialBoard = Array(24).fill(null).map(() => ({ count: 0, player: 0 }));
    const place = (idx, count, player) => { initialBoard[idx] = { count, player }; };

    place(23, 2, PLAYER_HUMAN);
    place(12, 5, PLAYER_HUMAN);
    place(7, 3, PLAYER_HUMAN);
    place(5, 5, PLAYER_HUMAN);

    place(0, 2, PLAYER_AI);
    place(11, 5, PLAYER_AI);
    place(16, 3, PLAYER_AI);
    place(18, 5, PLAYER_AI);

    const [board, setBoard] = useState(initialBoard);
    const [bar, setBar] = useState({ [PLAYER_HUMAN]: 0, [PLAYER_AI]: 0 });
    const [off, setOff] = useState({ [PLAYER_HUMAN]: 0, [PLAYER_AI]: 0 });

    const [dice, setDice] = useState([]);
    const [visualDice, setVisualDice] = useState([]);
    const [turn, setTurn] = useState(null);
    const [difficulty, setDifficulty] = useState('beginner');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For menu
    const [logs, setLogs] = useState(["Welcome to Solana Backgammon!"]);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [validMoves, setValidMoves] = useState([]);
    const [rolling, setRolling] = useState(false);
    const [canRoll, setCanRoll] = useState(false);
    const [history, setHistory] = useState([]); // Array of states for undo within turn
    const [gameStatus, setGameStatus] = useState('menu'); // menu, playing, gameover
    const [gameMode, setGameMode] = useState('single'); // 'single' or 'multi'
    const [playerColor, setPlayerColor] = useState(PLAYER_HUMAN); // In multi: assigned by server
    const [roomId, setRoomId] = useState(null);
    const [opponentName, setOpponentName] = useState('Opponent (Waiting)');
    const [opponentWallet, setOpponentWallet] = useState(null);
    const [opponentLevel, setOpponentLevel] = useState(1);
    const [opponentStats, setOpponentStats] = useState({ wins: 0, losses: 0 });
    const [socket, setSocket] = useState(null);
    const [finishingTurn, setFinishingTurn] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [escrowBalance, setEscrowBalance] = useState(0.00);
    const [opponentDisconnected, setOpponentDisconnected] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [unreadChat, setUnreadChat] = useState(0);
    const [selectedStake, setSelectedStake] = useState(0); // 0 = Free Play
    const [activeLobbies, setActiveLobbies] = useState([]);
    const [isLobbyOpen, setIsLobbyOpen] = useState(false);
    const [isHosting, setIsHosting] = useState(false);

    // --- REFS FOR SOCKET HANDLERS ---
    const gameStatusRef = useRef(gameStatus);

    useEffect(() => { gameStatusRef.current = gameStatus; }, [gameStatus]);

    const selectedStakeRef = useRef(selectedStake);
    useEffect(() => { selectedStakeRef.current = selectedStake; }, [selectedStake]);

    const escrowBalanceRef = useRef(escrowBalance);
    useEffect(() => { escrowBalanceRef.current = escrowBalance; }, [escrowBalance]);

    const walletRef = useRef(wallet);
    useEffect(() => { walletRef.current = wallet; }, [wallet]);

    const gameModeRef = useRef(gameMode);
    useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);

    const opponentNameRef = useRef(opponentName);
    useEffect(() => { opponentNameRef.current = opponentName; }, [opponentName]);

    // --- SOCKET INIT ---
    useEffect(() => {
        const newSocket = io(SERVER_URL);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log("Connected to Game Server:", newSocket.id);
            setLogs(prev => ["Connected to Server!", ...prev]); // Visual Confirm

            // Auto-Check for Active Game if Wallet is already "connected" (e.g. after internet drop)
            if (walletRef.current) {
                console.log("Reconnected to socket. Checking for active game and registering:", walletRef.current);
                newSocket.emit('check_active_game', walletRef.current);

                // Also Sync Profile stats from MongoDB
                const existing = localStorage.getItem('bg_profile_' + walletRef.current);
                let profile;
                try { profile = existing ? JSON.parse(existing) : null; } catch (e) { }

                newSocket.emit('register_user', {
                    wallet: walletRef.current,
                    name: profile?.name || '',
                    avatar: profile?.avatar || null
                });
            }
        });

        newSocket.on('connect_error', (err) => {
            console.error("Connection Error:", err);
            setLogs(prev => ["Connection Failed! Check Server URL.", ...prev]);
        });

        newSocket.on('waiting_for_match', () => {
            setLogs(prev => ["Waiting for an opponent...", ...prev]);
        });

        newSocket.on('active_game_found', ({ roomId }) => {
            console.log("Found Active Game:", roomId);
            // Auto-Trigger Rejoin
            if (wallet && !isSearching) {
                handleSearchMatch(null); // Stake doesn't matter for rejoin
            }
        });

        newSocket.on('match_found', (data) => {
            console.log("Match Found Event Data:", data);
            console.log("My Socket ID:", newSocket.id);
            setRoomId(data.roomId);
            setIsSearching(false);
            // Identify Opponent Name
            const pIds = Object.keys(data.players);
            const oppId = pIds.find(id => id !== newSocket.id);
            console.log("Opponent ID found:", oppId);

            const oppName = data.players[oppId]?.name || "Opponent";
            console.log("Opponent Name resolved:", oppName);

            setOpponentName(oppName);
            setOpponentWallet(data.players[oppId]?.wallet || null);
            if (data.players[oppId]) {
                setOpponentLevel(data.players[oppId].level || 1);
                setOpponentStats(data.players[oppId].stats || { wins: 0, losses: 0 });
            }

            if (data.isRejoin) {
                return;
            }

            // alert(`Match Found! Playing against ${oppName}`); // Remove alert for smoother flow
        });

        newSocket.on('assign_color', (colorStr) => {
            const myColor = colorStr === 'white' ? PLAYER_HUMAN : PLAYER_AI;
            setPlayerColor(myColor);
            console.log("Assigned Color:", colorStr, myColor);

            // Start Game Logic
            const stake = selectedStakeRef.current;
            if (stake && stake > 0) {
                const balance = escrowBalanceRef.current || 0;
                if (balance >= stake) {
                    // Deduct Stake
                    setEscrowBalance(prev => parseFloat((prev - stake).toFixed(2)));
                    log(`Staked ${stake} SOL from Escrow Balance.`);

                    // Start Game
                    setGameMode('multi');
                    setGameStatus('opening_roll');
                    setOpeningRoll(null);

                    // RESET GAME STATE
                    const resetBoard = Array(24).fill(null).map(() => ({ count: 0, player: 0 }));
                    const placeReset = (idx, count, player) => { resetBoard[idx] = { count, player }; };
                    placeReset(23, 2, PLAYER_HUMAN);
                    placeReset(12, 5, PLAYER_HUMAN);
                    placeReset(7, 3, PLAYER_HUMAN);
                    placeReset(5, 5, PLAYER_HUMAN);
                    placeReset(0, 2, PLAYER_AI);
                    placeReset(11, 5, PLAYER_AI);
                    placeReset(16, 3, PLAYER_AI);
                    placeReset(18, 5, PLAYER_AI);

                    setBoard(resetBoard);
                    setBar({ [PLAYER_HUMAN]: 0, [PLAYER_AI]: 0 });
                    setOff({ [PLAYER_HUMAN]: 0, [PLAYER_AI]: 0 });
                    setDice([]);
                    setVisualDice([]);
                    setHistory([]);

                    setRolling(false);
                    setTurn('human');
                    log(`Match Found against ${opponentNameRef.current}! Good luck!`);
                } else {
                    alert(`Insufficient Escrow Balance! You need ${stake} SOL. Please deposit.`);
                    setGameStatus('multiplayer_menu');
                    // Ideally emit 'leave_match' here
                    return;
                }
            } else {
                // Free Play
                setGameMode('multi');
                setGameStatus('opening_roll');
                setOpeningRoll(null);

                // RESET GAME STATE
                const resetBoard = Array(24).fill(null).map(() => ({ count: 0, player: 0 }));
                const placeReset = (idx, count, player) => { resetBoard[idx] = { count, player }; };
                placeReset(23, 2, PLAYER_HUMAN);
                placeReset(12, 5, PLAYER_HUMAN);
                placeReset(7, 3, PLAYER_HUMAN);
                placeReset(5, 5, PLAYER_HUMAN);
                placeReset(0, 2, PLAYER_AI);
                placeReset(11, 5, PLAYER_AI);
                placeReset(16, 3, PLAYER_AI);
                placeReset(18, 5, PLAYER_AI);

                setBoard(resetBoard);
                setBar({ [PLAYER_HUMAN]: 0, [PLAYER_AI]: 0 });
                setOff({ [PLAYER_HUMAN]: 0, [PLAYER_AI]: 0 });
                setDice([]);
                setVisualDice([]);
                setHistory([]);

                setRolling(false);
                setTurn('human');
                log(`Match Found against ${opponentNameRef.current}! Have fun!`);
            }

        });

        // REMOVED: newSocket.on('game_start') - Logic moved to match_found direct check

        newSocket.on('game_update', ({ type, payload }) => {
            console.log(`[CLIENT] Received game_update: ${type}`, payload);
            if (handleRemoteEventRef.current) {
                handleRemoteEventRef.current(type, payload);
            } else {
                console.error("[CLIENT] handleRemoteEventRef is null!");
            }
        });



        newSocket.on('withdraw_success', ({ amount, signature }) => {
            log(`Withdrawal of ${amount} SOL sent! Sig: ${signature.slice(0, 8)}...`);
            alert(`Funds sent to your wallet!`);
            setEscrowBalance(prev => parseFloat((prev - amount).toFixed(2)));
        });

        newSocket.on('chat_message', (msg) => {
            setChatMessages(prev => [...prev.slice(-49), msg]); // Keep last 50
            // Play notification sound if not me
            if (msg.sender !== 'You') {
                // Optional: play sound
                setUnreadChat(prev => prev + 1);
            }
        });

        newSocket.on('request_state_sync', () => {
            const state = gameStateRef.current;
            if (state.roomId) {
                log("Syncing state to opponent...");
                newSocket.emit('sync_state', {
                    roomId: state.roomId,
                    state: {
                        board: state.board,
                        bar: state.bar,
                        off: state.off,
                        dice: state.dice,
                        turn: state.turn
                    }
                });
            }
        });

        newSocket.on('sync_state_received', (state) => {
            log("Game State Synced!");
            setBoard(state.board);
            setBar(state.bar);
            setOff(state.off);

            // Turn Logic Inversion (Relative to Sender)
            // If sender says 'human', it means THEY are playing. So I am 'opponent'.
            const myTurnStr = state.turn === 'human' ? 'opponent' : 'human';
            setTurn(myTurnStr);

            if (myTurnStr === 'human') {
                if (state.dice && state.dice.length > 0) {
                    setDice(state.dice);
                    setVisualDice(state.dice.slice(0, 2)); // Visuals
                    setCanRoll(false);
                    log("Your Turn! Resume moving.");
                } else {
                    setDice([]);
                    setVisualDice([]);
                    setCanRoll(true);
                    log("Your Turn! Please Roll.");
                }
            } else {
                if (state.dice && state.dice.length > 0) {
                    setVisualDice(state.dice.slice(0, 2));
                    setDice([]);
                } else {
                    setVisualDice([]);
                    setDice([]);
                }
                log("Waiting for opponent...");
            }
            setOpponentDisconnected(false);
        });

        newSocket.on('user_profile_update', (data) => {
            console.log("[SOCKET] Profile updated from server:", data);
            setUserProfile(prev => {
                const updated = {
                    ...prev,
                    name: (data.name !== undefined) ? data.name : prev.name,
                    avatar: (data.avatar !== undefined) ? data.avatar : prev.avatar,
                    stats: {
                        ...data.stats, // Accept all stats from server (wins, losses, xp, level)
                    }
                };

                // PERSIST to localStorage so it survives refresh
                if (walletRef.current && !walletRef.current.startsWith('Guest')) {
                    localStorage.setItem('bg_profile_' + walletRef.current, JSON.stringify(updated));
                }

                return updated;
            });
        });

        newSocket.on('lobby_list_update', (lobbies) => {
            console.log("Lobbies Updated:", lobbies);
            setActiveLobbies(lobbies);
        });

        newSocket.on('rejoin_success', ({ roomId, color, players }) => {
            log("Rejoined match! Waiting for sync...");
            const myColor = color === 'white' ? PLAYER_HUMAN : PLAYER_AI;
            setPlayerColor(myColor);
            setRoomId(roomId);
            setGameMode('multi');
            setGameStatus('playing');
            setOpeningRoll(null);
            setOpponentDisconnected(false);

            // Re-resolve opp name
            if (players) {
                const pIds = Object.keys(players);
                const oppId = pIds.find(id => players[id].wallet !== walletRef.current); // Use ref for current wallet
                if (oppId) {
                    const oppName = players[oppId]?.name || "Opponent";
                    setOpponentName(oppName);
                    setOpponentWallet(players[oppId]?.wallet || null);
                    console.log("Opponent Updated (Rejoin):", oppName);
                }
            }
        });

        newSocket.on('active_game_not_found', () => {
            const currentStatus = gameStatusRef.current;
            const mode = gameModeRef.current;

            // Ignore if NOT multiplayer (single, menu, etc.)
            if (mode !== 'multi') {
                console.log("Ignoring active_game_not_found in non-multiplayer mode:", mode);
                return;
            }

            console.log("No active game found.");
            if (currentStatus === 'playing' || currentStatus === 'waiting_for_match') {
                console.log("Forcing return to menu from stale game.");
                setGameStatus('menu');
                setRoomId(null);
                setOpponentDisconnected(false);
                // Refresh stats
                setTimeout(() => fetchLeaderboard(), 1000);
                if (walletRef.current) {
                    newSocket.emit('register_user', walletRef.current);
                }
                alert("Game session expired. You may have timed out.");
            }
        });
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log("App returned to foreground.");
                if (!newSocket.connected) {
                    console.log("Socket disconnected. Reconnecting...");
                    newSocket.connect();
                } else {
                    // If connected, force check active game to ensure state is fresh
                    // But throttle this? No, manual check is safer.
                    if (walletRef.current) {
                        newSocket.emit('check_active_game', walletRef.current);
                    }
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            newSocket.close();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // Ref to access state inside socket listeners (which close over initial state)
    const gameStateRef = useRef({});
    useEffect(() => {
        gameStateRef.current = { board, bar, off, dice, turn, roomId };
    }, [board, bar, off, dice, turn, roomId]);

    // Ref for Event Handler to avoid stale closures
    const handleRemoteEventRef = useRef(null);
    useEffect(() => {
        handleRemoteEventRef.current = handleRemoteEvent;
    });

    const handleRemoteEvent = (type, payload) => {
        const currentStatus = gameStatusRef.current;

        if (type === 'opponent_disconnectING') {
            console.log("EVENT RECEIVED: Opponent Disconnecting");
            log(`Opponent disconnected! Waiting ${payload.timeLeft}s...`);
            setOpponentDisconnected(true);
        } else if (type === 'opponent_reconnected') {
            log("Opponent returned! Resuming...");
            setOpponentDisconnected(false);
        } else if (type === 'roll') {
            // Robustness check: Ensure we handle Opening Roll vs Game Roll correctly
            // Opening Roll = 1 die. Game Roll = 2 dice (or 4).
            if (currentStatus === 'opening_roll' && payload.length === 1) {
                // Handle Opponent Opening Roll
                const val = payload[0];
                log(`Opponent Rolled: ${val} (Opening)`);
                setOpeningRoll(prev => {
                    const newState = { ...(prev || {}), ai: val };

                    // Visual Update
                    if (newState.human) {
                        setVisualDice([newState.human, val]);
                    } else {
                        setVisualDice([val]);
                    }

                    checkMultiOpeningWinner(newState);
                    return newState;
                });
            } else {
                log(`Opponent Rolled: ${payload.join(', ')}`);
                // Visual only - show max 2 dice even for doubles
                setVisualDice(payload.slice(0, 2));
                setDice(payload);
            }
        } else if (type === 'opponent_reconnected') {
            console.log("Opponent returned! Resuming...");
            setOpponentDisconnected(false);
        } else if (type === 'opponent_disconnectING') {
            console.log("Opponent Disconnecting... Waiting...");
            setOpponentDisconnected(true);
        } else if (type === 'state_update') {
            console.log("Applying State Sync:", payload);
            if (payload.board) setBoard(payload.board);
            if (payload.bar) setBar(payload.bar);
            if (payload.off) setOff(payload.off);
            if (payload.dice) {
                // PROTECTION: Don't overwrite my own dice if it's my turn and I have active dice.
                // This prevents laggy/stale updates from opponent (e.g. from an undo or desync) from deleting my roll.
                if (turn === 'human' && dice.length > 0) {
                    console.warn("Ignored remote dice update because I have active dice:", dice, "Remote:", payload.dice);
                } else {
                    setDice(payload.dice);
                    // Also sync visuals if receiving valid dice
                    if (payload.dice.length > 0) {
                        setVisualDice(payload.dice.slice(0, 2));
                    }
                }
            }

            // Determine Turn: 
            // If Opponent (sender) says turn is 'human' (themselves), then for me it is 'ai'.
            // If Opponent says turn is 'ai' (me), then for me it is 'human'.
            if (payload.turn) {
                const newTurn = payload.turn === 'human' ? 'ai' : 'human';
                setTurn(newTurn);

                // FIX: Unfreeze UI if it's my turn
                if (newTurn === 'human') {
                    // If no dice, I must roll
                    if (!payload.dice || payload.dice.length === 0) {
                        setCanRoll(true);
                        setRolling(false);
                        log("It's your turn. Please Roll.");
                    } else {
                        // Dice exist, I must move
                        setCanRoll(false);
                        setRolling(false);
                        log("It's your turn. Please Move.");
                    }
                } else {
                    setCanRoll(false);
                }
            }

            log("Game State Synchronized.");

        } else if (type === 'move') {
            // Legacy/Simple move handler
            if (payload.board) {
                setBoard(payload.board);
                setBar(payload.bar);
            }
        } else if (type === 'end_turn') {
            log("Opponent finished turn.");
            setTurn('human');
            setDice([]); // Clear any opponent dice
            setVisualDice([]);
            setCanRoll(true);
        } else if (type === 'resign') {
            setGameStatus('gameover');
            setGameResult('win');
            log("Opponent Resigned! You Win!");
            playDiceSound();
            updateStats('win');
        } else if (type === 'opponent_disconnected') {
            setGameStatus('gameover');
            setGameResult('win');
            log("Opponent Disconnected! You Win!");
            setOpponentDisconnected(false);
        }
    };

    const emitGameEvent = (type, payload) => {
        if (socket && roomId) {
            socket.emit('game_event', { roomId, type, payload });
        }
    };

    // --- PROFILE LOGIC ---
    const [userProfile, setUserProfile] = useState({ name: '', avatar: null, stats: { wins: 0, losses: 0, xp: 0, level: 1 } });
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // --- TIMER LOGIC ---
    const [turnTimer, setTurnTimer] = useState(180); // 3 minutes per turn

    useEffect(() => {
        let interval = null;
        // Only count down if it is literally OUR turn (human)
        if (gameStatus === 'playing' && turn === 'human') {
            interval = setInterval(() => {
                setTurnTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        handleForfeit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setTurnTimer(180); // Reset timer on undo
            // Clear blocked state if we undo
            setIsBlocked(false);
        }
        return () => clearInterval(interval);
    }, [turn, gameStatus]);

    const handleForfeit = () => {
        if (gameMode === 'multi') {
            emitGameEvent('resign', {});
            setGameStatus('gameover');
            setGameResult('loss');
            log("You resigned.");
            updateStats('loss');
        } else {
            // Single Player Resign
            setGameStatus('menu');
            setGameMode('single'); // Ensure reset
            log("You resigned from single player.");
            // No stats update for single player resign
        }
    };

    useEffect(() => {
        if (wallet && !wallet.startsWith('Guest')) {
            const saved = localStorage.getItem('bg_profile_' + wallet);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Merge with default stats if missing
                    if (!parsed.stats) parsed.stats = { wins: 0, losses: 0, xp: 0, level: 1 };
                    setUserProfile(parsed);
                } catch (e) { console.error(e); }
            } else {
                setUserProfile({ name: '', avatar: null, stats: { wins: 0, losses: 0, xp: 0, level: 1 } });
            }

            // LOAD ESCROW BALANCE
            const savedBalance = localStorage.getItem('escrow_balance_' + wallet);
            if (savedBalance) {
                setEscrowBalance(parseFloat(savedBalance));
            } else {
                setEscrowBalance(0.00);
            }

        } else if (wallet && wallet.startsWith('Guest')) {
            setUserProfile({ name: 'Guest', avatar: null, stats: { wins: 0, losses: 0, xp: 0, level: 1 } });
            setEscrowBalance(0.00);
        }
    }, [wallet]);

    // Persist Escrow Balance
    useEffect(() => {
        if (wallet && !wallet.startsWith('Guest')) {
            localStorage.setItem('escrow_balance_' + wallet, escrowBalance.toString());
        }
    }, [escrowBalance, wallet]);

    const updateStats = (result) => {
        if (!wallet || wallet.startsWith('Guest')) return; // Guests don't save stats

        setUserProfile(prev => {
            const newStats = { ...prev.stats };
            if (result === 'win') {
                newStats.wins += 1;
                newStats.xp += 20;
            } else {
                newStats.losses += 1;
                newStats.xp += 5; // Consolation XP
            }
            newStats.level = Math.floor(newStats.xp / 100) + 1;

            const newProfile = { ...prev, stats: newStats };
            localStorage.setItem('bg_profile_' + wallet, JSON.stringify(newProfile));
            return newProfile;
        });
    };

    const handleSaveProfile = (name, avatarBase64) => {
        // Preserve stats from current profile
        const updated = { ...userProfile, name, avatar: avatarBase64 };
        setUserProfile(updated);

        if (wallet && !wallet.startsWith('Guest')) {
            try {
                localStorage.setItem('bg_profile_' + wallet, JSON.stringify(updated));

                // Sync with Server
                if (socket) {
                    socket.emit('register_user', {
                        wallet,
                        name,
                        avatar: avatarBase64
                    });
                    // Refresh leaderboard
                    setTimeout(() => fetchLeaderboard(), 500);
                }
            } catch (e) {
                alert("Image too large/Error saving profile.");
                console.error(e);
            }
        }
        setIsProfileModalOpen(false);
    };

    // --- CHAT LOGIC ---
    const handleSendChat = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const msg = {
            sender: 'You',
            text: chatInput.trim(),
            timestamp: Date.now()
        };

        // Optimistic update
        setChatMessages(prev => [...prev.slice(-49), msg]);
        setChatInput("");

        if (socket && roomId) {
            const myName = userProfile.name || (wallet ? `${wallet.slice(0, 4)}...` : 'Player');
            socket.emit('chat_message', { roomId, message: msg.text, sender: myName });
        }
    };

    // Auto-scroll chat
    const chatEndRef = useRef(null);
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatMessages]);
    const [gameResult, setGameResult] = useState(null); // 'win' or 'loss'
    const [depositTx, setDepositTx] = useState(null);

    const handleDeposit = async () => {
        if (!selectedStake || !publicKey) return;

        try {
            // Native Transfer Logic
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey("6cgsK8ph5tNUCiKG5WXLMZFX1CoL4jzuVouTPBwPC8fk"), // House Escrow
                    lamports: selectedStake * 1000000000,
                })
            );

            const signature = await sendTransaction(transaction, connection);
            log("Deposit Sent! Sig: " + signature.slice(0, 8) + "...");
            setDepositTx(signature);

            // Notify Server
            if (socket && roomId) {
                socket.emit('deposit_stake', { roomId, signature });
            }

        } catch (err) {
            console.error("Deposit Failed", err);
            alert("Deposit Failed: " + err.message);
        }
    };

    const fetchBalance = async () => {
        if (!publicKey) return;
        try {
            const lamports = await connection.getBalance(publicKey);
            setBalance((lamports / 1000000000).toFixed(2));
        } catch (e) { console.error(e); }
    };

    const handleEscrowDeposit = async () => {
        const amountStr = prompt("Enter annual amount to deposit (SOL):", "0.1");
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) return;

        try {
            if (!publicKey) return alert("Connect Wallet first");

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey("6cgsK8ph5tNUCiKG5WXLMZFX1CoL4jzuVouTPBwPC8fk"), // House Escrow
                    lamports: amount * 1000000000,
                })
            );

            const signature = await sendTransaction(transaction, connection);

            log("Escrow Deposit: " + amount + " SOL");
            setEscrowBalance(prev => parseFloat((prev + amount).toFixed(2)));
            // setTimeout(fetchBalance, 2000); // Disabled refresh wallet balance

        } catch (e) {
            alert("Deposit Error: " + e.message);
        }
    };

    const handleEscrowWithdraw = () => {
        const amountStr = prompt("Enter amount to withdraw (SOL):", "0.1");
        if (!amountStr) return;
        const amount = parseFloat(amountStr);

        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        if (escrowBalance < amount) {
            alert(`Insufficient Escrow Balance (Current: ${escrowBalance} SOL)`);
            return;
        }

        // REAL ARCHITECTURE: Request Server to Sign
        log(`Requesting Withdrawal of ${amount} SOL...`);
        console.log("Emitting request_withdraw", { wallet, amount });

        if (socket && socket.connected) {
            // The backend must hold the Private Key for the Escrow Wallet
            socket.emit('request_withdraw', { wallet, amount });
        } else {
            alert("Not connected to server. Please try refreshing or checking connection.");
            // Attempt Reconnect
            if (socket) socket.connect();
        }
    };





    // --- MULTIPLAYER LOGIC ---
    const [isSearching, setIsSearching] = useState(false);
    // const [selectedStake, setSelectedStake] = useState(null); // Already defined above
    const [isConditionsOpen, setIsConditionsOpen] = useState(false);

    const [showGuestPopup, setShowGuestPopup] = useState(false);
    const [showResignModal, setShowResignModal] = useState(false);

    const handleSearchMatch = (stake) => {
        // Only block guests for STAKE matches
        if (stake !== null && stake !== 0) {
            if (!wallet || wallet.startsWith('Guest')) {
                setShowGuestPopup(true);
                return;
            }
        }

        setSelectedStake(stake);

        if (stake === null || stake === 0) {
            // Free Play -> Open Lobby View
            setIsLobbyOpen(true);
            if (socket) {
                console.log("Requesting lobbies from server...");
                socket.emit('get_lobbies');
            }
        } else {
            // Ranked -> Quick Match
            setIsSearching(true);
            if (socket) {
                const profile = userProfile;
                const walletStr = wallet;
                const displayName = (profile.name && profile.name.trim() !== '')
                    ? profile.name
                    : `${walletStr.slice(0, 4)}...${walletStr.slice(-4)}`;

                socket.emit('find_match', {
                    name: displayName,
                    wallet: walletStr,
                    level: profile.stats?.level || 1,
                    stats: {
                        wins: profile.stats?.wins || 0,
                        losses: profile.stats?.losses || 0
                    }
                });
            }
        }
    };

    const handleHostGame = () => {
        if (!socket || !wallet) return;
        const profile = userProfile;
        const displayName = (profile.name && profile.name.trim() !== '')
            ? profile.name
            : `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;

        setIsHosting(true);
        socket.emit('create_lobby', {
            name: displayName,
            wallet: wallet,
            level: profile.stats?.level || 1,
            stats: profile.stats
        });
        log("Hosting Free Play Game...");
    };

    const handleJoinLobby = (lobby) => {
        if (!socket || !wallet) return;
        const profile = userProfile;
        const displayName = (profile.name && profile.name.trim() !== '')
            ? profile.name
            : `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;

        socket.emit('join_lobby', {
            roomId: lobby.roomId,
            userData: {
                name: displayName,
                wallet: wallet,
                level: profile.stats?.level || 1,
                stats: profile.stats
            }
        });
        setIsLobbyOpen(false);
        log(`Joining ${lobby.hostData.name}'s table...`);
    };

    const handleLeaveLobby = () => {
        if (socket) socket.emit('leave_lobby');
        setIsHosting(false);
        log("Lobby closed.");
    };

    // --- LEADERBOARD ---

    // --- LEADERBOARD LOGIC ---
    const [leaderboardData, setLeaderboardData] = useState([]);

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch(`${SERVER_URL}/leaderboard`);
            const data = await res.json();
            // Format for UI
            const formatted = data.map(u => ({
                name: u.name || `${u.wallet.slice(0, 4)}...${u.wallet.slice(-4)}`,
                avatar: u.avatar || null,
                stats: {
                    level: u.level || 1,
                    wins: u.wins || 0,
                    losses: u.losses || 0,
                    xp: u.xp || 0
                }
            }));
            setLeaderboardData(formatted);
        } catch (e) {
            console.error("Failed to fetch leaderboard:", e);
            setLeaderboardData([]); // Empty if fail
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 10000); // 10s refresh
        return () => clearInterval(interval);
    }, []);

    // --- WALLET ---
    const handleWalletConnection = async (pKeyStr) => {
        log(`Handshake with ${pKeyStr.slice(0, 8)}...`);
        // Just load profile and wait for explicit signature from UI
        setWalletValue(pKeyStr);
        const existing = localStorage.getItem('bg_profile_' + pKeyStr);
        let profileData;
        if (existing) {
            try {
                profileData = JSON.parse(existing);
            } catch (e) {
                profileData = { name: '', avatar: null, stats: { level: 1, wins: 0, losses: 0, xp: 0 } };
            }
        } else {
            profileData = { name: '', avatar: null, stats: { level: 1, wins: 0, losses: 0, xp: 0 } };
        }
        setUserProfile(profileData);

        // Register with Server (Sync Profile)
        if (socket) {
            socket.emit('register_user', {
                wallet: pKeyStr,
                name: profileData.name,
                avatar: profileData.avatar
            });
            setTimeout(() => fetchLeaderboard(), 500);

            // Check for active game
            if (gameStatus === 'menu') {
                socket.emit('check_active_game', pKeyStr);
            }
        }

        // Fetch Balance disabled (undefined)
        // fetchBalance();
    };

    /**
     * NEW: Clean Identity Signature Helper
     * Ensures we always get a signature to prove ownership
     */
    const handleIdentitySignature = async () => {
        if (!signMessage || !publicKey) return;
        try {
            setIsLoggingIn(true);
            log("IDENTITY: Requesting proof of ownership...");
            const message = new TextEncoder().encode("Login to Backgammon Solana");

            // Priority 1: Standard Message Sign
            const signed = await signMessage(message);
            if (signed) {
                setLoggedInValue(true);
                log("IDENTITY: Success!");
                handleWalletConnection(publicKey.toBase58());
                return true;
            }
        } catch (err) {
            log(`ID ERR: ${err.message?.slice(0, 30)}`);
            // Priority 2: Transaction Fallback (Mandatory for some mobile wallets)
            if (!err.message?.includes('User rejected')) {
                log("IDENTITY: Message blocked, trying transaction proof...");
                try {
                    const tx = new Transaction().add(SystemProgram.transfer({
                        fromPubkey: publicKey, toPubkey: publicKey, lamports: 0
                    }));
                    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
                    tx.feePayer = publicKey;
                    const sig = await sendTransaction(tx, connection);
                    if (sig) {
                        setLoggedInValue(true);
                        handleWalletConnection(publicKey.toBase58());
                        return true;
                    }
                } catch (txErr) { log("ID: Tx proof failed."); }
            }
        } finally {
            setIsLoggingIn(false);
        }
        return false;
    };

    /**
     * Main Connect Controller
     */
    const connectWallet = async () => {
        log(`TAP: Connect`);

        // PRIORITY 1: Deep Link if Capacitor App
        if (isCapacitor) {
            try {
                const connectUrl = buildConnectUrl();
                window.open(connectUrl, '_system');
                return;
            } catch (err) {
                log(`Failed to build connect URL: ${err.message}`);
                // fallback below
            }
        }

        // PRIORITY 2: Second Tap Login (Connected but not verified)
        if (connected && publicKey && !isLoggedIn) {
            await handleIdentitySignature();
            return;
        }

        // PRIORITY 3: Direct Solflare Login
        if (!connected) {
            log("Connecting to Solflare...");
            const solflareWallet = wallets.find(w => w.adapter.name === 'Solflare');
            if (solflareWallet) {
                select(solflareWallet.adapter.name);
            } else {
                log("Error: Solflare adapter not found.");
            }
        }
    };


    // Log State Changes for Debugging
    useEffect(() => {
        log(`State: Conn=${connected} PK=${!!publicKey} SignFn=${!!signMessage}`);
    }, [connected, publicKey, !!signMessage]);

    const handleForceReset = async () => {
        log("Forcing Reset...");
        try {
            await disconnect();
            setWalletValue(null);
            setLoggedInValue(false);
            setIsLoggingIn(false);
            log("Local state cleared.");
        } catch (e) {
            log("Reset error.");
        }
    };

    const handleGuestLogin = () => {
        const guestId = Math.floor(Math.random() * 9000) + 1000;
        setWalletValue(`Guest#${guestId}`);
        setBalance("1000 PLAY"); // Demo currrency
        log("Logged in as Guest.");
    };

    const log = (msg) => {
        setLogs(prev => [msg, ...prev.slice(0, 4)]);
    };

    const [openingRoll, setOpeningRoll] = useState(null); // { human: 0, ai: 0 }

    const startGame = (diff) => {
        setDifficulty(diff || 'advanced');
        setGameMode('single'); // Explictly set single player
        setBoard(initialBoard);
        setBar({ [PLAYER_HUMAN]: 0, [PLAYER_AI]: 0 });
        setOff({ [PLAYER_HUMAN]: 0, [PLAYER_AI]: 0 });
        setDice([]);
        setVisualDice([]);
        setValidMoves([]);
        setSelectedPoint(null);
        setHistory([]);
        setGameResult(null);
        setOpeningRoll(null);
        setGameStatus('opening_roll');
        log(`Game Started! Difficulty: ${diff}`);
        log("Rolling for first turn...");
    };

    const handleOpeningRoll = () => {
        playDiceSound();
        setRolling(true);

        // MULTIPLAYER LOGIC
        if (gameMode === 'multi') {
            // Prevent double rolling
            if (openingRoll && openingRoll.human) return;

            setTimeout(() => {
                const hDie = Math.ceil(Math.random() * 6);

                // Update Local State
                setOpeningRoll(prev => {
                    const newState = { ...(prev || {}), human: hDie };

                    // Visual Update
                    if (newState.ai) {
                        setVisualDice([hDie, newState.ai]);
                    } else {
                        setVisualDice([hDie]);
                    }

                    checkMultiOpeningWinner(newState);
                    return newState;
                });
                setRolling(false);
                log(`You Rolled: ${hDie} (Opening)`);

                // Emit to Opponent
                emitGameEvent('roll', [hDie]);

            }, 600);
            return;
        }

        // SINGLE PLAYER LOGIC

        setTimeout(() => {
            const hDie = Math.ceil(Math.random() * 6);
            const aDie = Math.ceil(Math.random() * 6);
            setOpeningRoll({ human: hDie, ai: aDie });
            setRolling(false);

            if (hDie > aDie) {
                log(`You rolled ${hDie}, AI rolled ${aDie}. You start!`);
                setTurn('human');
                setDice([]); // Reset for re-roll
                setVisualDice([]);
                setCanRoll(true); // Winner rolls again
                setTimeout(() => setGameStatus('playing'), 1500);
            } else if (aDie > hDie) {
                log(`You rolled ${hDie}, AI rolled ${aDie}. AI starts!`);
                setTurn('ai');
                setDice([]); // Reset for re-roll
                setVisualDice([]);
                setTimeout(() => {
                    setGameStatus('playing');
                    // Trigger AI Logic
                }, 1500);
            } else {
                log(`Tie (${hDie}-${aDie})! Rerolling...`);
                setTimeout(handleOpeningRoll, 1000);
            }
        }, 600);
    };

    const checkMultiOpeningWinner = (rolls) => {
        if (rolls && rolls.human && rolls.ai) {
            setTimeout(() => {
                const h = rolls.human;
                const a = rolls.ai;

                if (h > a) {
                    log(`You won opening roll (${h} vs ${a})! You start.`);
                    setTurn('human');
                    setDice([]); // Winner rolls again
                    setVisualDice([]);
                    setCanRoll(true);
                    setGameStatus('playing');
                    setOpeningRoll(null);
                } else if (a > h) {
                    log(`Opponent won opening roll (${a} vs ${h}). Opponent starts.`);
                    setTurn('opponent');
                    setDice([]); // Wait for opponent re-roll
                    setVisualDice([]);
                    setGameStatus('playing');
                    setOpeningRoll(null);
                } else {
                    log(`Tie (${h}-${a})! Re-rolling...`);
                    setTimeout(() => {
                        setOpeningRoll(null);
                        log("Click Roll to try again.");
                    }, 1500);
                }
            }, 1000);
        }
    };

    const handleManualRoll = () => {
        if (!canRoll || rolling || turn !== 'human') return;
        performRoll((d) => {
            log(`You Rolled: ${d.join(', ')}`);
            setCanRoll(false);
            // Snapshot state after roll
            setHistory([]);
            setIsBlocked(false); // Reset blocked state on new roll

            if (gameMode === 'multi') {
                emitGameEvent('roll', d);
            }
        });
    };

    const handleUndo = () => {
        if (history.length === 0 || finishingTurn) return;
        const lastState = history[history.length - 1];
        setBoard(lastState.board);
        setBar(lastState.bar);
        setDice(lastState.dice);
        setTurn(lastState.turn);
        // Don't restore canRoll usually, as we undoing moves after roll.
        setIsBlocked(false); // Undo should always unblock

        setHistory(prev => prev.slice(0, -1));
        setValidMoves([]);
        setSelectedPoint(null);
        log("Undo last move.");

        // MULTIPLAYER SYNC
        if (gameMode === 'multi') {
            emitGameEvent('state_update', {
                board: lastState.board,
                bar: lastState.bar,
                dice: lastState.dice
            });
        }
    };

    // --- DICE COMPONENT ---
    const Die = ({ value, isOpponent, style, className, children }) => {
        const dots = value ? Array.from({ length: value }) : [];
        return (
            <div className={`die-3d ${value ? `die-face-${value}` : ''} ${isOpponent ? 'opponent' : ''} ${className || ''}`} style={style}>
                {value ? dots.map((_, i) => <div key={i} className="dot"></div>) : children}
            </div>
        );
    };

    // --- GAME CONSTANTS ---

    const playMoveSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            // Simulate a wooden click/tap
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(500, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) { }
    };

    const playDiceSound = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const t = ctx.currentTime;

            // Create two "hits" to simulate dice rattling/landing
            [0, 0.1].forEach(offset => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'triangle'; // Wood-like sound
                osc.frequency.setValueAtTime(150 + Math.random() * 50, t + offset);
                osc.frequency.exponentialRampToValueAtTime(40, t + offset + 0.1);

                gain.gain.setValueAtTime(0.5, t + offset);
                gain.gain.exponentialRampToValueAtTime(0.01, t + offset + 0.1);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(t + offset);
                osc.stop(t + offset + 0.1);
            });
        } catch (e) {
            console.error("Sound Synth Error", e);
        }
    };

    const performRoll = (cb) => {
        playDiceSound();

        setRolling(true);
        setDice([]);
        setVisualDice([]);

        setTimeout(() => {
            let roll = [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
            setVisualDice(roll);

            // Handle Doubles (x4 Moves, but keep 2 Visual Dice)
            let functionalDice = [...roll];
            if (roll[0] === roll[1]) {
                log(`Doubles! ${roll[0]}-${roll[0]} (4 Moves)`);
                functionalDice = [roll[0], roll[0], roll[0], roll[0]];
            }

            setDice(functionalDice);
            setRolling(false);
            if (cb) cb(functionalDice);
        }, 800);
    };

    const rollDice = () => {
        return [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
    };



    const handlePassTurn = () => {
        setDice([]);
        setIsBlocked(false);
        setFinishingTurn(true);
        setTimeout(() => {
            setFinishingTurn(false);
            if (gameMode === 'multi') {
                log("Turn Finished. Waiting for opponent...");
                setTurn('opponent');
                emitGameEvent('end_turn', {});
            } else {
                log("Turn Finished. AI Moving...");
                setTurn('ai');
            }
        }, 2000);
    };

    // CHECK HUMAN MOVES LOGIC
    const checkHumanCanMove = (currentBoard, currentBar, currentDice) => {
        if (currentDice.length === 0) return true; // Handled elsewhere

        const uniqueDice = [...new Set(currentDice)];
        const opponent = playerColor === PLAYER_HUMAN ? PLAYER_AI : PLAYER_HUMAN;
        const direction = playerColor === PLAYER_HUMAN ? -1 : 1;

        // 1. Check Bar
        if (currentBar[playerColor] > 0) {
            return uniqueDice.some(d => {
                // White (1): 24-d. Red (-1): d-1
                const target = playerColor === PLAYER_HUMAN ? 24 - d : d - 1;
                if (target >= 0 && target <= 23) {
                    const dest = currentBoard[target];
                    return !(dest.player === opponent && dest.count > 1);
                }
                return false;
            });
        }

        // 2. Check Board
        let canBearOff = true;
        if (currentBar[playerColor] > 0) canBearOff = false;
        else {
            // White: 6-23. Red: 0-17.
            const start = playerColor === PLAYER_HUMAN ? 6 : 0;
            const end = playerColor === PLAYER_HUMAN ? 23 : 17;
            for (let i = start; i <= end; i++) {
                if (currentBoard[i].player === playerColor && currentBoard[i].count > 0) {
                    canBearOff = false;
                    break;
                }
            }
        }

        for (let i = 0; i < 24; i++) {
            if (currentBoard[i].player === playerColor && currentBoard[i].count > 0) {
                for (let d of uniqueDice) {
                    const target = i + (d * direction);
                    // Normal Move
                    if (target >= 0 && target <= 23) {
                        const dest = currentBoard[target];
                        if (!(dest.player === opponent && dest.count > 1)) return true;
                    }
                    // Bear Off Move
                    else if (canBearOff) {
                        if (playerColor === PLAYER_HUMAN) {
                            if (target === -1) return true;
                            let higherPieces = false;
                            for (let h = i + 1; h <= 5; h++) {
                                if (currentBoard[h].player === playerColor && currentBoard[h].count > 0) higherPieces = true;
                            }
                            if (!higherPieces) return true;
                        } else {
                            if (target === 24) return true;
                            let higherPieces = false;
                            for (let h = 18; h < i; h++) {
                                if (currentBoard[h].player === playerColor && currentBoard[h].count > 0) higherPieces = true;
                            }
                            if (!higherPieces) return true;
                        }
                    }
                }
            }
        }
        return false;
    };

    // Monitor Human Moves
    useEffect(() => {
        if (turn === 'human' && !rolling && dice.length > 0) {
            const canMove = checkHumanCanMove(board, bar, dice);
            if (!canMove) {
                log("No valid moves possible. Undo to retry, or Pass.");
                setIsBlocked(true);
                // Do NOT auto-end. Let user decide.
            } else {
                setIsBlocked(false); // If moves are possible, ensure not blocked
            }
        }
    }, [dice, turn, rolling, board, bar, playerColor]);

    useEffect(() => {
        if (gameStatus === 'playing' && turn === 'ai' && gameMode === 'single') {
            // Give user time to Undo their last move before AI takes over
            const timer = setTimeout(() => {
                playAITurn();
            }, 3000); // 3 seconds delay
            return () => clearTimeout(timer);
        }
    }, [turn, gameStatus, gameMode]);

    const playAITurn = () => {
        try {
            log("AI Rolling...");

            performRoll((aiDice) => {
                log(`AI Rolled: ${aiDice.join(', ')}`);

                // --- AI LOGIC (Minimax / Expectimax Simplified) ---
                const getBestSequence = (startBoard, startBar, dicePool) => {
                    let bestSeq = [];
                    let maxScore = -Infinity;
                    let maxDiceUsed = -1;
                    let maxDiceValSum = -1;

                    // Evaluation Function (Static Board State)
                    const evaluateBoard = (bd, br) => {
                        let score = 0;

                        // --- PHASE DETECTION: BEAR OFF ---
                        let allHome = true;
                        if (br[PLAYER_AI] > 0) allHome = false;
                        else {
                            for (let i = 0; i <= 17; i++) {
                                if (bd[i].player === PLAYER_AI && bd[i].count > 0) {
                                    allHome = false; break;
                                }
                            }
                        }

                        // Check for Opponent Presence in AI Home Board (18-23)
                        let opponentInHouse = false;
                        for (let i = 18; i < 24; i++) {
                            if (bd[i].player === PLAYER_HUMAN && bd[i].count > 0) {
                                opponentInHouse = true;
                                break;
                            }
                        }

                        if (allHome) {
                            // STRATEGY: Bear Off Phase

                            let piecesOnBoard = 0;
                            for (let i = 18; i < 24; i++) {
                                if (bd[i].player === PLAYER_AI) piecesOnBoard += bd[i].count;
                            }

                            // Base Score: Maximizing pieces removed
                            // (15 total start). Each removal is a huge step to winning.
                            score += (15 - piecesOnBoard) * 100000;

                            if (opponentInHouse) {
                                // CONDITION A: Opponent is lurking! SAFETY FIRST.
                                // "Focus on bear off without letting any pieces uncovered"
                                for (let i = 18; i < 24; i++) {
                                    if (bd[i].player === PLAYER_AI && bd[i].count === 1) {
                                        // BLOT PENALTY: EXTREME
                                        // Must be higher than the reward for bearing off to discourage unsafe moves
                                        // unless absolutely forced.
                                        // BearOff Reward = 100,000. Penalty must be > 100,000.
                                        score -= 200000;
                                    }
                                }
                            } else {
                                // CONDITION B: Coast is clear. SPEED FIRST.
                                // "Bear off as fast as possible"
                                // No penalty for blots. Just race!
                                // We can add a tiny bonus for having FEWER points occupied (stacking to high points is bad for speed),
                                // but the main driver is (15 - piecesOnBoard).
                            }

                            return score;
                        }

                        // --- NORMAL STRATEGY ---
                        // "Defensive... try to bring all his pieces in his house making gates where is possible"

                        // 1. Hitting Opponent (Opponent on Bar) - Still always good to set them back
                        score += (br[PLAYER_HUMAN] * 12000);

                        // 2. Board Analysis
                        for (let i = 0; i < 24; i++) {
                            const p = bd[i];
                            if (p.player === PLAYER_AI) {
                                if (p.count === 1) {
                                    // BLOT (Danger)
                                    // Penalize heavily if opponent is ahead of us or can hit us
                                    score -= 4000;
                                } else if (p.count > 1) {
                                    // GATE/POINT (Good)
                                    // Base Gate Bonus
                                    score += 2000;

                                    // Home Board Gate (18-23) - Highest Priority ("Building House")
                                    if (i >= 18) score += 3000;

                                    // Outer Board Gate (12-17) - Blocking
                                    if (i >= 12 && i < 18) score += 1000;
                                }
                            }
                        }

                        // 3. Distance to Home (Encourage moving forward)
                        // We want to minimize the pip count (sum of indices for AI? No, AI moves 0->24).
                        // AI Home is 18-23 (High Indices). We want to INCREASE total index sum.
                        let totalDistance = 0;
                        for (let i = 0; i < 24; i++) {
                            if (bd[i].player === PLAYER_AI) {
                                totalDistance += (i * bd[i].count);
                            }
                        }
                        score += totalDistance * 10; // Small tie-breaker to prefer forward motion

                        return score;
                    };

                    // Recursive Search
                    const search = (currentBoard, currentBar, currentDice, moveSeq) => {
                        // Maximize Dice Used First
                        // If we used more dice than max found, this is new best tier
                        const diceUsed = moveSeq.length;

                        // Valid moves check
                        let validMovesFound = false;

                        // Optimization: If seq is full (based on dicePool size), eval immediately
                        // Wait, Backgammon rules: Must use max dice possible.

                        const uniqueDice = [...new Set(currentDice)]; // Try each unique die value available

                        for (let die of uniqueDice) {
                            // Find all possible sources for this die
                            // 1. From Bar
                            if (currentBar[PLAYER_AI] > 0) {
                                const target = die - 1; // AI enters 0..5 based on dice 1..6
                                // Validation
                                if (target >= 0 && target <= 23) { // Bounds
                                    const dest = currentBoard[target];
                                    if (!(dest.player === PLAYER_HUMAN && dest.count > 1)) {
                                        // Valid Move
                                        validMovesFound = true;

                                        // Apply Move
                                        const nextBoard = JSON.parse(JSON.stringify(currentBoard));
                                        const nextBar = { ...currentBar };
                                        nextBar[PLAYER_AI]--;
                                        let action = 'move';

                                        // Hit Logic
                                        if (nextBoard[target].player === PLAYER_HUMAN) {
                                            nextBar[PLAYER_HUMAN]++;
                                            nextBoard[target] = { player: PLAYER_AI, count: 1 };
                                            action = 'hit';
                                        } else {
                                            nextBoard[target].player = PLAYER_AI;
                                            nextBoard[target].count++;
                                        }

                                        // Recurse
                                        const nextDice = [...currentDice];
                                        nextDice.splice(nextDice.indexOf(die), 1);

                                        search(nextBoard, nextBar, nextDice, [...moveSeq, {
                                            from: 'bar', to: target, dieVal: die, action
                                        }]);
                                    }
                                }
                            }
                            // 2. From Board (Only if Bar is empty)
                            else {
                                for (let i = 0; i < 24; i++) {
                                    if (currentBoard[i].player === PLAYER_AI) {
                                        const target = i + die;
                                        // Normal Move
                                        if (target <= 23) {
                                            const dest = currentBoard[target];
                                            if (!(dest.player === PLAYER_HUMAN && dest.count > 1)) {
                                                // Valid Move
                                                validMovesFound = true;

                                                const nextBoard = JSON.parse(JSON.stringify(currentBoard));
                                                const nextBar = { ...currentBar };
                                                nextBoard[i].count--;
                                                if (nextBoard[i].count === 0) nextBoard[i].player = 0;

                                                if (nextBoard[target].player === PLAYER_HUMAN) {
                                                    nextBar[PLAYER_HUMAN]++;
                                                    nextBoard[target] = { player: PLAYER_AI, count: 1 };
                                                } else {
                                                    nextBoard[target].player = PLAYER_AI;
                                                    nextBoard[target].count++;
                                                }

                                                const nextDice = [...currentDice];
                                                nextDice.splice(nextDice.indexOf(die), 1);

                                                search(nextBoard, nextBar, nextDice, [...moveSeq, {
                                                    from: i, to: target, dieVal: die
                                                }]);
                                            }
                                        }
                                        // Bear Off Move
                                        else {
                                            // Check if AI can bear off (All pieces in 18-23)
                                            let aiCanBearOff = true;
                                            if (currentBar[PLAYER_AI] > 0) aiCanBearOff = false;
                                            else {
                                                for (let z = 0; z < 18; z++) {
                                                    if (currentBoard[z].player === PLAYER_AI && currentBoard[z].count > 0) {
                                                        aiCanBearOff = false;
                                                        break;
                                                    }
                                                }
                                            }

                                            if (aiCanBearOff) {
                                                let validBearOff = false;
                                                if (target === 24) validBearOff = true; // Exact check
                                                else {
                                                    // Over-bear check: Allow if no pieces on lower indices (18..i) in Home
                                                    // For AI (0->24), pieces "behind" are at indices < i.
                                                    // Home starts at 18. So check 18 to i-1.
                                                    let lowerPieces = false;
                                                    for (let b = 18; b < i; b++) {
                                                        if (currentBoard[b].player === PLAYER_AI && currentBoard[b].count > 0) lowerPieces = true;
                                                    }
                                                    if (!lowerPieces) validBearOff = true;
                                                }

                                                if (validBearOff) {
                                                    validMovesFound = true;
                                                    const nextBoard = JSON.parse(JSON.stringify(currentBoard));
                                                    const nextBar = { ...currentBar };
                                                    nextBoard[i].count--;
                                                    if (nextBoard[i].count === 0) nextBoard[i].player = 0;

                                                    const nextDice = [...currentDice];
                                                    nextDice.splice(nextDice.indexOf(die), 1);

                                                    // Use -1 logic (or 24?) for Bear Off destination? 
                                                    // We used -1 for Human. Let's use -1 for AI too to signify 'Off Board'. 
                                                    // The visualizer MUST handle this.
                                                    search(nextBoard, nextBar, nextDice, [...moveSeq, {
                                                        from: i, to: -1, dieVal: die, action: 'bearoff'
                                                    }]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // If no moves could be made (Leaf Node decision)
                        if (!validMovesFound) {
                            // Rule: Must use max dice. 
                            // Rule 2: If dice count equal, must use max VALUE (Pips).
                            const diceUsed = moveSeq.length;
                            const valSum = moveSeq.reduce((a, b) => a + b.dieVal, 0);

                            if (diceUsed > maxDiceUsed) {
                                maxDiceUsed = diceUsed;
                                maxDiceValSum = valSum;
                                maxScore = evaluateBoard(currentBoard, currentBar);
                                bestSeq = moveSeq;
                            } else if (diceUsed === maxDiceUsed) {
                                if (valSum > maxDiceValSum) {
                                    maxDiceValSum = valSum;
                                    maxScore = evaluateBoard(currentBoard, currentBar);
                                    bestSeq = moveSeq;
                                } else if (valSum === maxDiceValSum) {
                                    const score = evaluateBoard(currentBoard, currentBar);
                                    if (score > maxScore) {
                                        maxScore = score;
                                        bestSeq = moveSeq;
                                    }
                                }
                            }
                        }
                    };

                    search(startBoard, startBar, dicePool, []);
                    return bestSeq;
                };


                // Determine Moves
                let sequence = [];
                if (difficulty === 'beginner') {
                    // Keep random simple recursive logic? 
                    // Actually, for beginner, just run search with BAD evaluation? 
                    // Or just use the first valid random path found?
                    // Let's stick to the high-quality search for now as the user requested "Pro". 
                    // Beginner can just pick random moves locally (revert to random if needed, but lets just make AI smart overall first).
                    // To allow beginner, we can inject noise into `evaluateBoard`.
                    sequence = getBestSequence(board, bar, aiDice); // Just use smart for now
                } else {
                    // Advanced
                    sequence = getBestSequence(board, bar, aiDice);
                }

                if (sequence.length === 0) {
                    log("AI has no moves.");
                    setTurn('human');
                    setCanRoll(true);
                    setDice([]);
                    setVisualDice([]);
                    setHistory([]);
                    return;
                }

                log(`AI found BEST path: ${sequence.length} moves.`);

                // EXECUTE SEQUENCE WITH VISUAL DELAY
                const runSequence = (seq, idx, currBoard, currBar) => {
                    if (idx >= seq.length) {
                        setTimeout(() => {
                            log("AI Turn Ends.");
                            setTurn('human');
                            setCanRoll(true);
                            setDice([]);
                            setVisualDice([]);
                            setHistory([]);
                        }, 800);
                        return;
                    }

                    const move = seq[idx];
                    setTimeout(() => {
                        // Update State Visuals
                        setBoard(prev => {
                            const nb = [...prev]; // Should match currBoard logic ideally, but we re-apply for React State
                            // Apply logic again strictly based on move param
                            // NOTE: We use the Logic derived in Search to ensure consistency
                            if (move.from === 'bar') {
                                setBar(b => {
                                    const newBarState = { ...b };
                                    newBarState[PLAYER_AI]--;
                                    // If the move was a hit, the bar state for PLAYER_HUMAN would have changed in the search.
                                    // We need to reflect that here.
                                    // The `currBar` passed to `runSequence` is the state *before* any moves in the sequence.
                                    // The `move.action` property can help here.
                                    if (move.action === 'hit') {
                                        newBarState[PLAYER_HUMAN]++;
                                        log("AI Hits!");
                                    }
                                    return newBarState;
                                });
                            } else {
                                const src = { ...nb[move.from] }; // Create a copy to avoid direct mutation
                                src.count--;
                                if (src.count === 0) src.player = 0;
                                nb[move.from] = src;
                            }

                            playMoveSound();
                            if (move.to === -1) {
                                log("AI Bears Off.");
                                setOff(prev => ({ ...prev, [PLAYER_AI]: prev[PLAYER_AI] + 1 }));
                            } else {
                                const dst = { ...nb[move.to] }; // Create a copy
                                if (dst.player === PLAYER_HUMAN) {
                                    setBar(b => ({ ...b, [PLAYER_HUMAN]: b[PLAYER_HUMAN] + 1 }));
                                    dst.count = 1;
                                    dst.player = PLAYER_AI;
                                    log("AI Hits!");
                                } else {
                                    dst.player = PLAYER_AI;
                                    dst.count++;
                                }
                                nb[move.to] = dst;
                            }
                            return nb;
                        });

                        // Remove used die from Visual Dice
                        setDice(prev => {
                            const newD = [...prev];
                            const dIdx = newD.indexOf(move.dieVal);
                            if (dIdx > -1) newD.splice(dIdx, 1);
                            return newD;
                        });

                        // Propagate tracking state for next step (Hit counts etc)
                        // We can just rely on the Search's plan.

                        runSequence(seq, idx + 1, null, null); // currBoard and currBar are not needed for subsequent steps as state is updated via setBoard/setBar

                    }, 1000);
                };

                runSequence(sequence, 0, board, bar);
            });
        } catch (e) {
            console.error("AI Error:", e);
            log("AI Error: " + e.message);
        }
    };

    // HUMAN MOVES
    const handlePointClick = (index) => {
        console.log("HandlePointClick Entry:", index, "Selected:", selectedPoint, "Turn:", turn);
        if (turn !== 'human' || rolling) return;

        // Is the player clicking an owned piece that is NOT a valid target? If so, this is a "Selection" or "Re-selection" intent.
        const isOwnedPiece = index >= 0 && index <= 23 && board[index].player === playerColor && board[index].count > 0;
        const isMoveTarget = validMoves.includes(index);
        const isReSelection = selectedPoint !== null && isOwnedPiece && !isMoveTarget && index !== selectedPoint;

        // SELECT SOURCE
        if (selectedPoint === null || isReSelection) {
            if (bar[playerColor] > 0) return log("Must enter from bar!");

            if (isOwnedPiece) {
                setSelectedPoint(index);

                // Calculate Valid Moves
                const possibleMoves = [];

                // Check for Bear Off Condition
                let canBearOff = true;
                if (bar[playerColor] > 0) canBearOff = false;
                else {
                    if (playerColor === PLAYER_HUMAN) {
                        for (let i = 6; i < 24; i++) {
                            if (board[i].player === PLAYER_HUMAN && board[i].count > 0) {
                                canBearOff = false;
                                break;
                            }
                        }
                    } else {
                        for (let i = 0; i < 18; i++) {
                            if (board[i].player === PLAYER_AI && board[i].count > 0) {
                                canBearOff = false;
                                break;
                            }
                        }
                    }
                }

                [...new Set(dice)].forEach(d => {
                    const target = playerColor === PLAYER_HUMAN ? index - d : index + d;
                    const inBounds = target >= 0 && target <= 23;

                    if (inBounds) {
                        const dest = board[target];
                        const opponent = playerColor === PLAYER_HUMAN ? PLAYER_AI : PLAYER_HUMAN;
                        const blocked = dest.player === opponent && dest.count > 1;
                        if (!blocked) possibleMoves.push(target);
                    } else if (canBearOff) {
                        const isBearOffMove = playerColor === PLAYER_HUMAN ? target < 0 : target > 23;
                        if (isBearOffMove) {
                            const exact = playerColor === PLAYER_HUMAN ? (index - d === -1) : (index + d === 24);
                            if (exact) {
                                possibleMoves.push(-1);
                            } else {
                                let hasHigher = false;
                                if (playerColor === PLAYER_HUMAN) {
                                    for (let k = index + 1; k <= 5; k++) {
                                        if (board[k].player === playerColor && board[k].count > 0) hasHigher = true;
                                    }
                                } else {
                                    for (let k = index - 1; k >= 18; k--) {
                                        if (board[k].player === playerColor && board[k].count > 0) hasHigher = true;
                                    }
                                }
                                if (!hasHigher) possibleMoves.push(-1);
                            }
                        }
                    }
                });
                setValidMoves(possibleMoves);
            }
        }
        // DESTINATION CLICK / EXECUTE MOVE
        else {
            const targetIndex = (index === selectedPoint && validMoves.includes(-1)) ? -1 : index;

            if (!validMoves.includes(targetIndex)) {
                if (index === selectedPoint) {
                    setSelectedPoint(null);
                    setValidMoves([]);
                } else {
                    log("Invalid move!");
                }
                return;
            }

            // EXECUTE MOVE
            playMoveSound();
            const snapshot = {
                board: JSON.parse(JSON.stringify(board)),
                bar: { ...bar },
                dice: [...dice],
                turn: turn
            };
            setHistory(prev => [...prev, snapshot]);

            let dieUsed;
            if (selectedPoint === 'bar') {
                if (playerColor === PLAYER_HUMAN) dieUsed = 24 - targetIndex;
                else dieUsed = targetIndex + 1;
            } else {
                if (targetIndex === -1) {
                    if (playerColor === PLAYER_HUMAN) {
                        const exactDie = selectedPoint + 1;
                        dieUsed = dice.includes(exactDie) ? exactDie : (dice.find(d => selectedPoint - d < -1) || exactDie);
                    } else {
                        const exactDie = 24 - selectedPoint;
                        dieUsed = dice.includes(exactDie) ? exactDie : (dice.find(d => selectedPoint + d > 23) || exactDie);
                    }
                } else {
                    dieUsed = Math.abs(selectedPoint - targetIndex);
                }
            }
            const dieIdx = dice.indexOf(dieUsed);

            const nextBoard = [...board];
            const nextBar = { ...bar };
            const nextOff = { ...off };

            if (selectedPoint === 'bar') {
                nextBar[playerColor]--;
            } else {
                const source = { ...nextBoard[selectedPoint] };
                source.count--;
                if (source.count === 0) source.player = 0;
                nextBoard[selectedPoint] = source;
            }

            if (targetIndex === -1) {
                log("Bearing Off!");
                nextOff[playerColor]++;
            } else {
                const dest = { ...nextBoard[targetIndex] };
                const opponent = playerColor === PLAYER_HUMAN ? PLAYER_AI : PLAYER_HUMAN;
                if (dest.player === opponent) {
                    log("Checkers Hit!");
                    nextBar[opponent] = nextBar[opponent] + 1;
                    dest.player = playerColor;
                    dest.count = 1;
                } else {
                    dest.player = playerColor;
                    dest.count += 1;
                }
                nextBoard[targetIndex] = dest;
            }

            setBoard(nextBoard);
            setBar(nextBar);
            setOff(nextOff);

            const newDice = [...dice];
            newDice.splice(dieIdx, 1);
            setDice(newDice);

            if (gameMode === 'multi') {
                emitGameEvent('state_update', { board: nextBoard, bar: nextBar, off: nextOff, dice: newDice });
            }

            setSelectedPoint(null);
            setValidMoves([]);

            if (newDice.length > 0 && !checkHumanCanMove(nextBoard, nextBar, newDice)) {
                log("No valid moves left. Undo to retry, or Pass.");
                setIsBlocked(true);
            }
            if (newDice.length === 0) {
                handlePassTurn();
            }
        }
    };

    // Bar Click handler
    const handleBarClick = () => {
        if (turn !== 'human') return; // 'human' here means 'MY turn' locally

        const myBarCount = bar[playerColor];
        if (myBarCount > 0) {
            setSelectedPoint('bar');

            const possibleMoves = [];
            // Logic depends on Color
            // White (Standard): Enters at 24 - die (Index 18..23)
            // Red (Flipped/Opponent): Enters at 0 + die (Index 0..5)? No.
            // Red moves 1 -> 24. Enters at 1. White Home is 1..6.
            // So Red enters into Indices 0..5.
            // Target = die - 1. (Die 1 -> Index 0)

            [...new Set(dice)].forEach(d => {
                let target;
                if (playerColor === PLAYER_AI) {
                    target = d - 1; // 1-based die to 0-based index
                } else {
                    target = 24 - d;
                }

                if (target >= 0 && target <= 23) {
                    const dest = board[target];
                    // Check blockage. I am blocked by OPPONENT.
                    // If I am PLAYER_AI, Opponent is PLAYER_HUMAN.
                    const opponent = playerColor === PLAYER_HUMAN ? PLAYER_AI : PLAYER_HUMAN;
                    const blocked = dest.player === opponent && dest.count > 1;

                    if (!blocked) possibleMoves.push(target);
                }
            });
            setValidMoves(possibleMoves);
            log("Select a valid point to enter.");
        }
    };

    // WIN CHECKER
    useEffect(() => {
        if (gameStatus !== 'playing') return;

        const countHuman = board.reduce((acc, p) => p.player === PLAYER_HUMAN ? acc + p.count : acc, 0) + bar[PLAYER_HUMAN];
        const countAI = board.reduce((acc, p) => p.player === PLAYER_AI ? acc + p.count : acc, 0) + bar[PLAYER_AI];

        // Determine "My" pieces and "Opponent" pieces
        const myPieces = playerColor === PLAYER_HUMAN ? countHuman : countAI;
        const oppPieces = playerColor === PLAYER_HUMAN ? countAI : countHuman;

        if (myPieces === 0) {
            setGameStatus('gameover');
            setGameResult('win'); // "YOU WIN"
            playDiceSound();
            updateStats('win');

            // Notify Server of Win (for rankings)
            if (gameMode === 'multi' && socket) {
                socket.emit('finish_game', { roomId, result: 'win' });
            } else if (gameMode === 'single' && socket && wallet && !wallet.startsWith('Guest')) {
                // Allow Single Player progress if Wallet connected
                socket.emit('update_single_player_stats', { wallet, result: 'win' });
            }

            // Payout Logic
            const stake = selectedStakeRef.current;
            if (stake > 0) {
                // Win = Return Stake + Opponent Stake (minus fee?)
                // Simple 2x return for MVP
                const confirmWin = stake * 2;
                const fee = confirmWin * 0.02; // 2% Fee
                const payout = confirmWin - fee;

                setEscrowBalance(prev => parseFloat((prev + payout).toFixed(2)));
                log(`Won ${payout.toFixed(3)} SOL! Added to Escrow.`);
            }

        } else if (oppPieces === 0) {
            setGameStatus('gameover');
            setGameResult('loss');
            updateStats('loss');
        }
    }, [board, bar, gameStatus, playerColor]);

    // RENDER
    // 1. LANDING PAGE
    if (gameStatus === 'menu') {
        return (
            <div className="landing-page">
                <div className="landing-visual" style={{ transform: 'scale(0.9)' }}>
                    <div className="landing-die die-1 face-6">
                        <div className="dot"></div><div className="dot"></div>
                        <div className="dot"></div><div className="dot"></div>
                        <div className="dot"></div><div className="dot"></div>
                    </div>
                    <div className="landing-die die-2 face-5">
                        <div className="dot"></div><div className="dot"></div>
                        <div className="dot"></div><div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>

                <div className="landing-title">
                    <span style={{ color: '#d32f2f', WebkitTextFillColor: 'initial', background: 'none' }}>Play</span>
                    <span style={{ color: '#fff', WebkitTextFillColor: 'initial', background: 'none' }}>24</span>
                    <span style={{ color: '#e8e0d5', WebkitTextFillColor: 'initial', background: 'none' }}> Backgammon</span>
                </div>
                <div className="landing-subtitle">Powered by Solana</div>



                {/* Top Right Wallet Badge (Only if connected) */}
                {wallet && (
                    <>
                        {/* DISCONNECT STATUS BANNER - VISIBLE ALWAYS if State True */}
                        {opponentDisconnected && (
                            <div style={{
                                position: 'fixed', top: 0, left: 0, right: 0, width: '100%',
                                height: '60px', background: 'red', color: 'white',
                                zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '1.5rem'
                            }}>
                                ⚠️ OPPONENT DISCONNECTED - AUTO WIN IN 15s ⚠️
                            </div>
                        )}

                        {/* Top Left Wallet Info */}
                        <div className="wallet-badge-container">
                            <div className="wallet-badge" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start', padding: '12px' }} onClick={() => setIsProfileModalOpen(true)}>
                                {wallet.startsWith('Guest') ? (
                                    <div style={{ fontWeight: 'bold' }}>Guest Mode</div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {userProfile.avatar && (
                                                <img src={userProfile.avatar} style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} />
                                            )}
                                            <span style={{ fontWeight: 'bold' }}>{userProfile.name || `${wallet.slice(0, 4)}...${wallet.slice(-4)}`}</span>
                                            <span style={{ fontSize: '0.8rem', marginLeft: '5px', opacity: 0.7 }}>✏️</span>
                                        </div>

                                        {/* STATS STRIP */}
                                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', fontSize: '0.8rem', opacity: 0.9, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', gap: '8px' }}>
                                            <span style={{ color: '#66bb6a' }}>{userProfile.stats.wins}W</span>
                                            <span style={{ opacity: 0.5 }}>-</span>
                                            <span style={{ color: '#ef5350' }}>{userProfile.stats.losses}L</span>
                                            <span style={{ opacity: 0.5 }}>|</span>
                                            <span style={{ color: '#ffd700' }}>Lvl {userProfile.stats.level}</span>
                                            <span style={{ opacity: 0.5 }}>|</span>
                                            <span style={{ color: '#00e676' }}>{userProfile.stats.xp} XP</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* PROFILE MODAL */}
                {isProfileModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Edit Profile</h3>
                            <div className="form-group">
                                <label>Display Name</label>
                                <input
                                    type="text"
                                    id="input-name"
                                    defaultValue={userProfile.name}
                                    placeholder="Enter your name"
                                    className="modal-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Avatar</label>
                                <input
                                    type="file"
                                    id="input-file"
                                    accept="image/*"
                                    className="modal-input"
                                />
                            </div>
                            <div className="modal-actions">
                                <button className="btn-secondary" onClick={() => setIsProfileModalOpen(false)}>Cancel</button>
                                <button className="btn-primary" onClick={() => {
                                    const name = document.getElementById('input-name').value;
                                    const fileInput = document.getElementById('input-file');

                                    if (fileInput.files && fileInput.files[0]) {
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            handleSaveProfile(name, e.target.result);
                                        };
                                        reader.readAsDataURL(fileInput.files[0]);
                                    } else {
                                        handleSaveProfile(name, userProfile.avatar);
                                    }
                                }}>Save</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONDITIONS MODAL */}




                {
                    (!wallet || (!wallet.startsWith('Guest') && !isLoggedIn)) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button className="btn-primary" style={{ fontSize: '1.2rem', padding: '15px 30px', display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', minWidth: '250px' }} onClick={handleGuestLogin}>
                                <span style={{ fontSize: '1.4rem' }}>👤</span>
                                <span>Guest Mode</span>
                            </button>
                            <button
                                className="btn-primary"
                                style={{
                                    fontSize: '1.2rem', padding: '15px 30px',
                                    background: (connected && !isLoggedIn) ? '#4caf50' : 'transparent',
                                    border: (connected && !isLoggedIn) ? 'none' : '1px solid #8d6e63',
                                    display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', minWidth: '250px'
                                }}
                                onClick={connectWallet}
                                disabled={isLoggingIn}
                            >
                                <span style={{ fontSize: '1.4rem' }}>{(connected && !isLoggedIn) ? '✅' : '🔗'}</span>
                                <span>{isLoggingIn ? 'Verifying...' : ((connected && !isLoggedIn) ? 'Verify & Login' : 'Connect Wallet')}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="landing-menu">
                            {/* Single Player Dropdown */}
                            <div className="dropdown-container">
                                <div className="dropdown-header" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span className="icon">👤</span>
                                        <span>Single Player</span>
                                    </div>
                                    <span>{isDropdownOpen ? '▲' : '▼'}</span>
                                </div>
                                <div className={`dropdown-options ${isDropdownOpen ? 'open' : ''}`}>
                                    <div className="dropdown-item" onClick={() => startGame('beginner')}>
                                        <span>Easy (Beginner)</span>
                                        <span>👶</span>
                                    </div>
                                    <div className="dropdown-item" onClick={() => startGame('advanced')}>
                                        <span>Hard (Advanced)</span>
                                        <span>🤖</span>
                                    </div>
                                </div>
                            </div>

                            <button className="btn-mode" onClick={() => setGameStatus('multiplayer_menu')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span className="icon">👥</span>
                                    <span>Multiplayer</span>
                                </div>
                                <span></span> {/* Spacer for flex-between */}
                            </button>

                            {/* TOURNAMENT - Hidden for now
                                <button className="btn-mode" disabled>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span className="icon">🏆</span>
                                        <span>Tournament</span>
                                    </div>
                                    <span></span>
                                </button>
                                */}

                            <button className="btn-mode" onClick={() => setGameStatus('leaderboard')}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span className="icon">📊</span>
                                    <span>Stats / Leaderboard</span>
                                </div>
                                <span></span>
                            </button>

                            <button className="btn-mode" style={{ borderColor: '#d32f2f', background: 'rgba(211, 47, 47, 0.1)' }} onClick={() => {
                                disconnect().catch(() => { }); // Try adapter disconnect
                                setWalletValue(null);
                                setLoggedInValue(false);
                                setGameStatus('menu'); // Ensure we are on main menu/login
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span className="icon">🚪</span>
                                    <span style={{ color: '#ffcdd2' }}>{wallet.startsWith('Guest') ? 'Exit Guest' : 'Disconnect'}</span>
                                </div>
                                <span></span>
                            </button>
                        </div>
                    )
                }
            </div >
        );
    }

    if (gameStatus === 'multiplayer_menu') {
        return (
            <div className="landing-page">
                {/* Top Right Wallet Badge (Replicated) */}
                {wallet && (
                    <>
                        <div className="wallet-badge-container">
                            <div className="wallet-badge" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', alignItems: 'flex-start' }} onClick={() => setIsProfileModalOpen(true)}>
                                {wallet.startsWith('Guest') ? (
                                    <div style={{ fontWeight: 'bold' }}>Guest Mode</div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {userProfile.avatar && (
                                                <img src={userProfile.avatar} style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '5px' }} />
                                            )}
                                            <span style={{ fontWeight: 'bold' }}>{userProfile.name || `${wallet.slice(0, 4)}...`}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', fontSize: '0.8rem', opacity: 0.9, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', gap: '8px' }}>
                                            <span style={{ color: '#66bb6a' }}>{userProfile.stats.wins}W</span>
                                            <span style={{ opacity: 0.5 }}>-</span>
                                            <span style={{ color: '#ef5350' }}>{userProfile.stats.losses}L</span>
                                            <span style={{ opacity: 0.5 }}>|</span>
                                            <span style={{ color: '#ffd700' }}>Lvl {userProfile.stats.level}</span>
                                            <span style={{ opacity: 0.5 }}>|</span>
                                            <span style={{ color: '#00e676' }}>{userProfile.stats.xp} XP</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <h2 className="landing-title">Select Mode</h2>

                {isSearching ? (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', border: '2px solid #4caf50', background: 'rgba(0,0,0,0.8)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
                        <h3>Searching for opponent...</h3>
                        <p style={{ color: '#aaa' }}>Stake: {selectedStake ? selectedStake + ' SOL' : 'Free Play'}</p>
                        <button className="btn-secondary" style={{ marginTop: '20px' }} onClick={() => setIsSearching(false)}>Cancel</button>
                    </div>
                ) : isLobbyOpen ? (
                    <div className="card" style={{
                        width: '95%',
                        maxWidth: '500px',
                        background: 'rgba(30, 15, 10, 0.98)',
                        border: '2px solid #8d6e63',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        minHeight: '400px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #4e342e', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h3 style={{ margin: 0, color: '#d7ccc8' }}>Free Play Tables</h3>
                                <button className="btn-secondary" style={{ padding: '2px 8px', fontSize: '0.7rem' }} onClick={() => socket?.emit('get_lobbies')}>🔄 Refresh</button>
                            </div>
                            <button className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => setIsLobbyOpen(false)}>Close</button>
                        </div>

                        {isHosting ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px dashed #8d6e63' }}>
                                <div className="loading-spinner" style={{ marginBottom: '20px' }}>🎲</div>
                                <h4>Your Table is Live!</h4>
                                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Waiting for someone to join...</p>
                                <button className="btn-secondary" style={{ marginTop: '20px', background: '#c62828' }} onClick={handleLeaveLobby}>Stop Hosting</button>
                            </div>
                        ) : (
                            <>
                                <button className="btn-primary" style={{ padding: '15px' }} onClick={handleHostGame}>
                                    ➕ Create New Table
                                </button>

                                <div style={{ flex: 1, overflowY: 'auto', maxHeight: '300px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {activeLobbies.length === 0 ? (
                                        <div style={{ textAlign: 'center', color: '#6d4c41', padding: '40px 0' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🕳️</div>
                                            No tables open. Host one!
                                        </div>
                                    ) : (
                                        activeLobbies.map(lobby => (
                                            <div key={lobby.roomId} style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                border: '1px solid #4e342e'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ fontSize: '1.5rem' }}>👤</div>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{lobby.hostData.name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                                            Lvl {lobby.hostData.level} | {lobby.hostData.stats?.wins}W - {lobby.hostData.stats?.losses}L
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }} onClick={() => handleJoinLobby(lobby)}>
                                                    Join
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', maxWidth: '100%' }}>
                        {/* FREE PLAY */}
                        <div className="card" style={{
                            textAlign: 'center',
                            width: '90%',
                            maxWidth: '400px',
                            cursor: 'pointer',
                            border: '2px solid #8d6e63',
                            padding: '20px',
                            boxSizing: 'border-box',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'rgba(62, 39, 35, 0.95)'
                        }} onClick={() => handleSearchMatch(null)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ fontSize: '2rem' }}>🎮</div>
                                <div style={{ textAlign: 'left' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Free Play</h3>
                                    <p style={{ margin: 0, color: '#aaa', fontSize: '0.8rem' }}>Practice vs Random</p>
                                </div>
                            </div>
                            <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '8px 15px', minWidth: '80px' }}>Play</button>
                        </div>

                        {/* STAKE PLAY */}
                        {/* STAKE PLAY - LOCKED / UNLOCKED */}
                        {userProfile.stats.level < 5 ? (
                            <div className="card" style={{
                                textAlign: 'center',
                                width: '90%',
                                maxWidth: '400px',
                                border: '2px solid #555',
                                background: 'rgba(30, 30, 30, 0.95)',
                                padding: '40px 20px',
                                boxSizing: 'border-box',
                                position: 'relative',
                                opacity: 0.8,
                                cursor: 'not-allowed',
                                minHeight: '260px'
                            }}>
                                <div style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                                        <div style={{ fontSize: '2rem', filter: 'grayscale(100%)' }}>💰</div>
                                        <h3 style={{ margin: 0, color: '#aaa' }}>Ranked / Stake</h3>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        {[0.01, 0.02].map(amt => (
                                            <button key={amt} className="btn-secondary" disabled style={{ background: '#333', border: '1px solid #555', color: '#777' }}>
                                                {amt} SOL
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                    width: '100%', textAlign: 'center', color: '#fff', textShadow: '0 2px 4px #000',
                                    padding: '10px',
                                    background: 'rgba(0,0,0,0.6)',
                                    borderRadius: '10px'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🔒</div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#ff5252', marginBottom: '5px' }}>LOCKED</div>
                                    <div style={{ fontSize: '0.9rem', color: '#ddd' }}>Reach <span style={{ color: '#ffd700' }}>Level 5</span> to Unlock</div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '5px' }}>Current: Lvl {userProfile.stats.level}</div>
                                    <button
                                        className="btn-secondary"
                                        style={{ marginTop: '10px', fontSize: '0.8rem', padding: '5px 10px', pointerEvents: 'auto', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', border: '1px solid #777' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsConditionsOpen(true);
                                        }}
                                    >
                                        ℹ️ View Conditions
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card" style={{
                                textAlign: 'center',
                                width: '90%',
                                maxWidth: '400px',
                                border: '2px solid gold',
                                background: 'rgba(62, 39, 35, 0.95)',
                                padding: '20px',
                                boxSizing: 'border-box'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '15px' }}>
                                    <div style={{ fontSize: '2rem' }}>💰</div>
                                    <h3 style={{ margin: 0 }}>Ranked / Stake</h3>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    {[0.01, 0.02, 0.03, 0.04].map(amt => (
                                        <button key={amt} className="btn-secondary" style={{ background: '#3e2723', border: '1px solid gold', padding: '10px' }} onClick={() => handleSearchMatch(amt)}>
                                            {amt} SOL
                                        </button>
                                    ))}
                                </div>

                                <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #4e342e' }}>
                                    <div style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Escrow: <span style={{ color: '#fff', fontWeight: 'bold' }}>{escrowBalance} SOL</span></span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <button className="btn-secondary" style={{ flex: 1, fontSize: '0.8rem', padding: '8px', background: '#2e7d32' }} onClick={handleEscrowDeposit}>
                                            + Deposit
                                        </button>
                                        <button className="btn-secondary" style={{ flex: 1, fontSize: '0.8rem', padding: '8px', background: '#c62828' }} onClick={handleEscrowWithdraw}>
                                            - Withdraw
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button className="btn-primary" style={{ marginTop: '5px', background: '#3e2723', width: '90%', maxWidth: '400px', padding: '15px' }} onClick={() => {
                            setGameStatus('menu');
                            setGameMode('single');
                        }}>Back to Main Menu</button>
                    </div>
                )}
                {isConditionsOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🏆</div>
                            <h3 style={{ margin: '0 0 15px' }}>Level 5 Requirements</h3>

                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '15px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.1rem' }}>
                                    <span>Target XP:</span>
                                    <span style={{ color: '#ffd700', fontWeight: 'bold' }}>400 XP</span>
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '10px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span>Reward per Win:</span>
                                    <span style={{ color: '#66bb6a', fontWeight: 'bold' }}>+20 XP</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Reward per Loss:</span>
                                    <span style={{ color: '#ef5350', fontWeight: 'bold' }}>+5 XP</span>
                                </div>
                            </div>

                            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>
                                Keep playing "Free Play" matches to earn XP. Even losses help you progress!
                            </p>

                            <button className="btn-primary" onClick={() => setIsConditionsOpen(false)}>
                                Got it!
                            </button>
                        </div>
                    </div>
                )}

                {showGuestPopup && (
                    <div className="modal-overlay">
                        <div className="modal-content" style={{ textAlign: 'center', maxWidth: '400px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔒</div>
                            <h3 style={{ marginBottom: '10px' }}>Wallet Required</h3>
                            <p style={{ color: '#bdbdbd', marginBottom: '25px' }}>
                                You must connect a real wallet to play Multiplayer!
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button className="btn-primary" style={{
                                    fontSize: '1.1rem',
                                    padding: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    background: 'transparent',
                                    border: '1px solid #8d6e63'
                                }} onClick={() => {
                                    setShowGuestPopup(false);
                                    connectWallet();
                                }}>
                                    <span>🔗</span>
                                    <span>Connect Wallet</span>
                                </button>

                                <button className="btn-secondary" onClick={() => setShowGuestPopup(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }



    if (gameStatus === 'leaderboard') {
        const leaderboard = leaderboardData;
        return (
            <div className="landing-page">
                <h2 className="landing-title" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Top 100 Players</h2>
                <div style={{
                    background: 'rgba(44, 36, 27, 0.95)',
                    padding: '20px',
                    borderRadius: '12px',
                    width: '90%',
                    maxWidth: '600px',
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    marginBottom: '20px',
                    border: '1px solid #5d4037'
                }}>
                    {leaderboard.length === 0 && (
                        <div style={{ color: '#fff', textAlign: 'center', padding: '20px' }}>
                            No players found yet. Be the first! <br />
                            (Connect your wallet to appear)
                        </div>
                    )}
                    {leaderboard.map((p, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '15px',
                            borderBottom: '1px solid #3e2723',
                            background: i === 0 ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', width: '30px', color: i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? '#cd7f32' : '#a1887f' }}>#{i + 1}</div>
                                {p.avatar ? <img src={p.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #5d4037', objectFit: 'cover' }} /> : <div className="dot" style={{ width: '40px', height: '40px', position: 'static', background: '#3e2723' }}></div>}
                                <div>
                                    <div style={{ fontWeight: 'bold', color: '#e8e0d5' }}>{p.name || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                        Lvl {p.stats?.level || 1} • <span style={{ color: '#81c784' }}>{p.stats?.wins || 0}W</span> / <span style={{ color: '#e57373' }}>{p.stats?.losses || 0}L</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ffca28' }}>
                                {p.stats?.xp || 0} XP
                            </div>
                        </div>
                    ))}
                </div>
                <button className="btn-primary" style={{ background: '#3e2723', padding: '10px 40px' }} onClick={() => setGameStatus('menu')}>Back to Menu</button>
            </div>
        );
    }

    // Helper for specific Perspective Rendering
    // Helper for specific Perspective Rendering
    const isFlipped = playerColor === PLAYER_AI;
    // Standard: 0 (Bottom Right) -> 23 (Top Right)
    // Flipped (Red View): 23 (Top Right) should ideally be Bottom Right.
    // visual 0 (Bottom Right) -> Logical 23.
    // visual 23 (Top Right) -> Logical 0.
    const getLogIdx = (i) => isFlipped ? 23 - i : i;

    // Determine Players for Trays based on Flip
    const topTrayPlayer = isFlipped ? PLAYER_HUMAN : PLAYER_AI;
    const bottomTrayPlayer = isFlipped ? PLAYER_AI : PLAYER_HUMAN;

    // 2. GAME BOARD
    return (
        <div className="app-container">
            {opponentDisconnected && (
                <div style={{
                    position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, 0)',
                    width: '55%', padding: '15px',
                    background: '#d32f2f', color: '#fff',
                    zIndex: 2147483647, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '1rem',
                    border: '3px solid #fff', borderRadius: '12px',
                    boxShadow: '0 0 30px rgba(0,0,0,0.6)',
                    textAlign: 'center'
                }}>
                    <div style={{ marginBottom: '5px', fontSize: '1.2rem' }}>⚠️ Connection Lost</div>
                    <div>Waiting for opponent to reconnect... (60s)</div>
                </div>
            )}




            {/* MAIN GAME AREA */}
            <div className="board-wrapper">

                {/* UNIFIED HEADER ABOVE BOARD */}
                <div className={`unified-header ${turn === 'ai' || turn === 'opponent' ? 'active-turn' : ''}`}>
                    <div className="header-left">
                        <div className="logo-mini">
                            <span style={{ color: '#d32f2f' }}>P</span><span style={{ color: '#fff' }}>24</span>
                        </div>
                        <div className="opponent-info-compact">
                            <div className="opponent-avatar-mini" style={{
                                width: '24px', height: '24px',
                                background: playerColor === PLAYER_HUMAN
                                    ? 'radial-gradient(circle at 30% 30%, #4a4a4a, #000000)'
                                    : 'radial-gradient(circle at 30% 30%, #ffffff, #dcdcdc)',
                                borderColor: playerColor === PLAYER_HUMAN ? '#000' : '#b0b0b0'
                            }}></div>
                            <span className="opp-name-text">{gameMode === 'multi' ? opponentName : `AI`}</span>
                        </div>
                    </div>

                    <div className="header-center">
                        <div className="turn-status-compact">
                            <span className="turn-label">{turn === 'human' ? 'YOUR TURN' : 'OPPONENT TURN'}</span>
                            {turn === 'human' && (
                                <span className="turn-timer-compact">
                                    {Math.floor(turnTimer / 60)}:{(turnTimer % 60).toString().padStart(2, '0')}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="header-right">
                        <button className="btn-header-action"
                            onClick={() => {
                                if (gameStatus === 'playing' || gameStatus === 'opening_roll') {
                                    if (gameMode === 'single') {
                                        setShowResignModal(true);
                                    } else {
                                        if (window.confirm("Are you sure you want to resign? You will lose the match.")) {
                                            handleForfeit();
                                        }
                                    }
                                } else {
                                    setGameStatus('menu');
                                    setBoard(initialBoard);
                                    setGameResult(null);
                                    setVisualDice([]);
                                    setDice([]);
                                    setOpponentDisconnected(false);
                                }
                            }}
                        >
                            {gameStatus === 'playing' || gameStatus === 'opening_roll' ? '🏳️' : '🏠'}
                        </button>
                    </div>
                </div>

                {/* GAME OVER OVERLAY */}
                {gameStatus === 'gameover' && (
                    <div className="game-over-overlay">
                        <div className={`game-over-title ${gameResult}`}>
                            {gameResult === 'win' ? 'YOU WIN!' : 'YOU LOST!'}
                        </div>
                        <div className="game-over-subtitle">
                            {gameResult === 'win' ? 'Great moves! You dominated the board.' : 'Better luck next time!'}
                        </div>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <button className="btn-primary" onClick={() => {
                                setGameStatus('menu');
                                setBoard(initialBoard);
                                setGameResult(null);
                                setOpponentDisconnected(false);
                            }}>Back to Menu</button>
                            <button className="btn-primary" style={{ background: '#4caf50', border: '1px solid #81c784' }} onClick={() => {
                                setBoard(initialBoard);
                                setBar({ 0: 0, 1: 0 });
                                setGameResult(null);
                                setOpponentDisconnected(false);

                                if (gameMode === 'multi') {
                                    setGameStatus('multiplayer_menu');
                                    handleSearchMatch(selectedStake);
                                } else {
                                    startGame(difficulty);
                                }
                            }}>Play Again</button>
                        </div>
                    </div>
                )}

                {/* OPENING ROLL OVERLAY */}
                {gameStatus === 'opening_roll' && (
                    <div className="game-over-overlay" style={{ background: 'rgba(0,0,0,0.92)', zIndex: 900 }}>
                        <div className="game-over-title" style={{ fontSize: '2rem', marginBottom: '10px', color: '#fff' }}>Opening Roll</div>
                        <div className="game-over-subtitle" style={{ marginBottom: '20px' }}>
                            Roll to decide who moves first!
                        </div>

                        {(openingRoll || rolling) ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '60px', margin: '30px 0' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#fff', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.2rem' }}>YOU</div>
                                    {(openingRoll && openingRoll.human) ? (
                                        <Die value={openingRoll.human} style={{ width: '70px', height: '70px' }} />
                                    ) : (
                                        rolling ? (
                                            <Die style={{ width: '70px', height: '70px', animation: 'spin 1s infinite linear' }} />
                                        ) : (
                                            <Die style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #666', background: 'transparent', color: '#666', fontSize: '2rem' }}>?</Die>
                                        )
                                    )}
                                </div>
                                <div style={{ fontSize: '1.5rem', color: '#aaa', paddingTop: '20px' }}>vs</div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ color: '#d32f2f', marginBottom: '10px', fontWeight: 'bold', fontSize: '1.2rem' }}>{gameMode === 'multi' ? opponentName : 'AI'}</div>
                                    {(openingRoll && openingRoll.ai) ? (
                                        <Die value={openingRoll.ai} isOpponent={true} style={{ width: '70px', height: '70px' }} />
                                    ) : (
                                        (gameMode === 'single' && rolling) ? (
                                            <Die isOpponent={true} style={{ width: '70px', height: '70px', animation: 'spin 1s infinite linear' }} />
                                        ) : (
                                            <Die isOpponent={true} style={{ width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #d32f2f', background: 'transparent', color: '#d32f2f', fontSize: '2rem' }}>{gameMode === 'multi' ? '...' : '?'}</Die>
                                        )
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '30px 0' }}>
                                <div style={{ fontSize: '4rem' }}>🎲</div>
                            </div>
                        )}

                        {(!openingRoll || !openingRoll.human) && !rolling && (
                            <button className="btn-primary" style={{ fontSize: '1.3rem', padding: '15px 50px' }} onClick={handleOpeningRoll}>ROLL FOR FIRST TURN</button>
                        )}
                    </div>
                )}

                {/* DICE TABLE OVERLAY */}
                <div className={`dice-table-overlay ${rolling ? 'rolling' : ''}`}>
                    {/* Turn Notification */}
                    {turn === 'human' && (canRoll || dice.length > 0) && !rolling && (
                        <div className="turn-message">YOUR TURN!</div>
                    )}

                    {(visualDice.length > 0 || rolling) && (
                        <div className="dice-pair">
                            {rolling ? (
                                <>
                                    <div className="die-3d rolling-anim"></div>
                                    <div className="die-3d rolling-anim"></div>
                                </>
                            ) : (
                                visualDice.map((d, i) => (
                                    <Die key={i} value={d} isOpponent={turn === 'opponent' || turn === PLAYER_AI} />
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* TOP HALF (Indices 12-23) */}
                <OffTray
                    player={topTrayPlayer}
                    count={off[topTrayPlayer]}
                    position="top"
                    valid={topTrayPlayer === playerColor && validMoves.includes(-1)}
                    onClick={topTrayPlayer === playerColor ? () => handlePointClick(-1) : undefined}
                />
                <div className="board-row top">
                    {/* 12-17 */}
                    <div className="quadrant">
                        {[12, 13, 14, 15, 16, 17].map(i => {
                            const logical = getLogIdx(i);
                            return <Point key={i} index={i} data={board[logical]} isTop={true} selected={selectedPoint === logical} isValid={validMoves.includes(logical)} onClick={() => handlePointClick(logical)} playerColor={playerColor} />
                        })}
                    </div>

                    {/* BAR TOP - OPPONENT (AI) */}
                    <div className="bar-center">
                        {bar[PLAYER_AI] > 0 && (
                            <div
                                className="checker red"
                                onClick={playerColor === PLAYER_AI ? handleBarClick : undefined}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: playerColor === PLAYER_AI ? 'pointer' : 'default', color: '#fff', fontSize: '1.2rem', position: 'relative', zIndex: 5 }}>
                                {bar[PLAYER_AI]}
                            </div>
                        )}
                    </div>

                    {/* 18-23 */}
                    <div className="quadrant">
                        {[18, 19, 20, 21, 22, 23].map(i => {
                            const logical = getLogIdx(i);
                            return <Point key={i} index={i} data={board[logical]} isTop={true} selected={selectedPoint === logical} isValid={validMoves.includes(logical)} onClick={() => handlePointClick(logical)} playerColor={playerColor} />
                        })}
                    </div>
                </div>

                {/* BOTTOM HALF (Indices 11-0) */}
                {/* Bottom Left: 11-6. Bottom Right: 5-0 */}
                <div className="board-row bottom">
                    {/* 11-6 */}
                    <div className="quadrant">
                        {[11, 10, 9, 8, 7, 6].map(i => {
                            const logical = getLogIdx(i);
                            return <Point key={i} index={i} data={board[logical]} isTop={false} selected={selectedPoint === logical} isValid={validMoves.includes(logical)} onClick={() => handlePointClick(logical)} playerColor={playerColor} />
                        })}
                    </div>

                    {/* BAR BOTTOM - PLAYER (HUMAN) */}
                    <div className="bar-center">
                        {bar[PLAYER_HUMAN] > 0 && (
                            <div
                                className="checker white"
                                onClick={playerColor === PLAYER_HUMAN ? handleBarClick : undefined}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: playerColor === PLAYER_HUMAN ? 'pointer' : 'default', color: '#000', fontSize: '1.2rem', position: 'relative', zIndex: 5 }}
                            >
                                {bar[PLAYER_HUMAN]}
                            </div>
                        )}
                    </div>

                    {/* 5-0 */}
                    <div className="quadrant">
                        {[5, 4, 3, 2, 1, 0].map(i => {
                            const logical = getLogIdx(i);
                            return <Point key={i} index={i} data={board[logical]} isTop={false} selected={selectedPoint === logical} isValid={validMoves.includes(logical)} onClick={() => handlePointClick(logical)} playerColor={playerColor} />
                        })}
                    </div>
                </div>
                <OffTray
                    player={bottomTrayPlayer}
                    count={off[bottomTrayPlayer]}
                    position="bottom"
                    valid={bottomTrayPlayer === playerColor && validMoves.includes(-1)}
                    onClick={bottomTrayPlayer === playerColor ? () => handlePointClick(-1) : undefined}
                />

                {/* PLAYER CONTROLS */}
                <div className={`player-controls-bar ${turn === 'human' && (canRoll || dice.length > 0) ? 'active-turn' : ''}`}>
                    <div className="player-info">
                        <div className="player-avatar" style={{
                            background: playerColor === PLAYER_AI
                                ? 'radial-gradient(circle at 30% 30%, #4a4a4a, #000000)' // I am Red (Black/Red styling)
                                : 'radial-gradient(circle at 30% 30%, #ffffff, #dcdcdc)', // I am White
                            borderColor: playerColor === PLAYER_AI ? '#000' : '#b0b0b0'
                        }}>
                            {userProfile.avatar && <img src={userProfile.avatar} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />}
                        </div>
                        <div className="player-name">
                            <div style={{ fontWeight: 'bold' }}>
                                {wallet ? (wallet.startsWith('Guest') ? 'Guest' : (userProfile.name || `${wallet.slice(0, 4)}...${wallet.slice(-4)}`)) : 'Player 1'}
                            </div>
                            {wallet && !wallet.startsWith('Guest') && userProfile.stats && (
                                <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    {userProfile.name && (
                                        <>
                                            <span style={{ fontFamily: 'monospace', color: '#8d6e63' }}>
                                                {wallet.slice(0, 4)}...{wallet.slice(-4)}
                                            </span>
                                            <span>•</span>
                                        </>
                                    )}
                                    <span>Lvl {userProfile.stats.level}</span>
                                    <span>•</span>
                                    <span>{userProfile.stats.wins}W / {userProfile.stats.losses}L</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="controls-actions">
                        <button
                            className="btn-action"
                            onClick={handleUndo}
                            disabled={turn !== 'human' || history.length === 0 || finishingTurn || dice.length === 0}
                        >
                            Undo
                        </button>
                        {validMoves.includes(-1) ? (
                            <button
                                className="btn-action"
                                style={{ backgroundColor: '#ffca28', color: '#000', fontWeight: 'bold' }}
                                onClick={() => handlePointClick(-1)}
                            >
                                BEAR OFF
                            </button>
                        ) : (
                            <button
                                className="btn-action"
                                onClick={() => isBlocked ? handlePassTurn() : handleManualRoll()}
                                disabled={(!canRoll && !isBlocked) || turn !== 'human'}
                                style={(dice.length > 0 && turn === 'human') ? { background: isBlocked ? '#d32f2f' : '#2e7d32', color: '#fff', border: isBlocked ? '1px solid #b71c1c' : '1px solid #66bb6a', cursor: 'pointer' } : {}}
                            >
                                {isBlocked ? "Pass Turn (Blocked)" : ((dice.length > 0 && turn === 'human') ? "MOVE" : "Roll Dice")}
                            </button>
                        )}
                    </div>
                </div>


                {/* CHAT REMOVED FROM HERE */}
            </div>

            {/* GAME OVER OVERLAY */}
            {gameStatus === 'gameover' && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ textAlign: 'center', border: gameResult === 'win' ? '2px solid gold' : '2px solid #d32f2f' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                            {gameResult === 'win' ? '🏆' : '💀'}
                        </div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: gameResult === 'win' ? 'gold' : '#ef9a9a' }}>
                            {gameResult === 'win' ? 'YOU WON!' : 'YOU LOST'}
                        </h2>
                        <p style={{ color: '#aaa', marginBottom: '30px' }}>
                            {gameResult === 'win' ? "Congratulations! Great game." : "Better luck next time."}
                        </p>

                        <button className="btn-primary" onClick={() => {
                            setGameStatus('menu');
                            // Reset visuals
                            setGameResult(null);
                            setDice([]);
                            setVisualDice([]);
                        }}>
                            Back to Menu
                        </button>
                    </div>
                </div>
            )}


            {/* OPPONENT DISCONNECT WARNING */}
            {opponentDisconnected && gameStatus !== 'gameover' && (
                <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 2000 }}>
                    <div className="card" style={{
                        position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, -50%)',
                        border: '2px solid #ff9800', background: '#3e2723', padding: '30px', textAlign: 'center',
                        boxShadow: '0 0 50px rgba(255, 152, 0, 0.4)', minWidth: '300px'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚠️</div>
                        <h2 style={{ color: '#ffcc80' }}>Opponent Disconnected</h2>
                        <p style={{ color: '#fff', margin: '15px 0', fontSize: '1.2rem' }}>Waiting for opponent to reconnect...</p>
                        <div className="loader" style={{ margin: '20px auto', borderColor: '#ffcc80', borderTopColor: 'transparent' }}></div>
                        <p style={{ fontSize: '0.9rem', color: '#ffecb3', marginTop: '15px', fontWeight: 'bold' }}>Auto-win in 15 seconds.</p>
                    </div>
                </div>
            )}

            {/* SINGLE PLAYER RESIGN MODAL */}
            {showResignModal && (
                <div className="modal-overlay" style={{ zIndex: 3000 }}>
                    <div className="modal-content" style={{ textAlign: 'center', border: '1px solid #8d6e63' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🏳️</div>
                        <h3 style={{ marginBottom: '10px' }}>Resign Game?</h3>
                        <p style={{ color: '#bdbdbd', marginBottom: '20px', fontSize: '1rem' }}>
                            Are you sure you want to return to the menu?
                        </p>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                <span style={{ color: '#aaa' }}>•</span>
                                <span>No Loss Recorded</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#aaa' }}>•</span>
                                <span>No XP Changed</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button className="btn-secondary" onClick={() => setShowResignModal(false)} style={{ flex: 1 }}>
                                Cancel
                            </button>
                            <button className="btn-primary" style={{ background: '#d32f2f', border: '1px solid #b71c1c', flex: 1 }} onClick={() => {
                                setShowResignModal(false);
                                handleForfeit();
                            }}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* RIGHT SIDEBAR REMOVED */}
        </div>
    );
}

function Point({ index, data, isTop, selected, isValid, onClick, playerColor }) {
    const checkers = [];
    for (let i = 0; i < data.count; i++) {
        // FIXED: Absolute colors. Player 1 (Human) = White. Player 2 (AI/Opponent) = Red.
        checkers.push(<div key={i} className={`checker ${data.player === 1 ? 'white' : 'red'}`}></div>);
    }
    // Color logic: even index is light? Standard board pattern alternating.
    const isDark = index % 2 !== 0;

    return (
        <div
            className={`point ${isTop ? 'down' : 'up'} ${isDark ? 'dark' : 'light'} ${selected ? 'selected' : ''} ${isValid ? 'valid' : ''}`}
            onClick={onClick}
        >
            <div className="point-triangle"></div>
            <div className="checker-stack">
                {checkers}
            </div>
            {/* Debug Index */}
            {/* <div className="index-label">{index}</div> */}
        </div>
    );
}

function OffTray({ player, count, position, valid, onClick }) {
    const isHuman = player === PLAYER_HUMAN;

    // Create array for visual pieces, capped if needed to prevent rendering issues, 
    // though 15 checks fit easily.
    const pieces = Array.from({ length: count });

    return (
        <div
            className={`off-tray ${position} ${valid ? 'valid' : ''}`}
            onClick={valid ? onClick : undefined}
        >
            <div className="off-tray-label">OFF</div>
            <div className="off-pieces-row">
                {pieces.map((_, i) => (
                    <div key={i} className={`off-piece ${isHuman ? 'white' : 'red'}`} style={{ zIndex: i }}></div>
                ))}
            </div>
            {count > 0 && <div className="off-counter-text">{count}</div>}
        </div>
    );
}

export default App;