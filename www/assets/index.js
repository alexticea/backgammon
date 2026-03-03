import { r as reactExports, u as useConnection, b as useWallet, d as useWalletModal, j as jsxRuntimeExports, C as ConnectionProvider, W as WalletProvider$1, e as WalletModalProvider, f as client, R as React } from "./react-core.js";
import { B as Buffer$1, N as App$1, O as StatusBar, P as lookup } from "./vendor-libs.js";
import { l as bs58, F as nacl, P as PublicKey, T as Transaction, G as SystemProgram, H as WalletAdapterNetwork, I as SolflareWalletAdapter } from "./solana-web3.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
if (typeof window !== "undefined") {
  if (!window.global) {
    window.global = window;
  }
  if (!window.Buffer) {
    window.Buffer = Buffer$1;
  }
  if (!window.process) {
    window.process = { env: {} };
  }
}
let sessionState = null;
const loadSession = () => {
  try {
    const saved = localStorage.getItem("dapp_session_secret");
    if (saved) {
      const secretKey = bs58.decode(saved);
      const keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
      sessionState = { dappKeyPair: keyPair };
      return sessionState;
    }
  } catch (e) {
  }
  return null;
};
const initSession = () => {
  const keyPair = nacl.box.keyPair();
  sessionState = { dappKeyPair: keyPair };
  localStorage.setItem("dapp_session_secret", bs58.encode(keyPair.secretKey));
  return sessionState;
};
const buildConnectUrl = () => {
  if (!sessionState) initSession();
  const { dappKeyPair } = sessionState;
  const params = new URLSearchParams({
    dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
    cluster: "mainnet-beta",
    app_url: "https://backgammon-beige.vercel.app",
    redirect_link: "backgammon://connect"
  });
  return `solflare://ul/v1/connect?${params.toString()}`;
};
const handleConnectCallback = (urlStr) => {
  var _a;
  if (!sessionState) loadSession();
  if (!sessionState) {
    throw new Error("No session state found.");
  }
  try {
    let qs = urlStr.includes("?") ? urlStr.split("?")[1].split("#")[0] : null;
    if (!qs) throw new Error(`Invalid URL format: no query params in ${urlStr}`);
    const searchParams = new URLSearchParams(qs);
    const queryParams = Object.fromEntries(searchParams.entries());
    if (!queryParams) throw new Error("No queryParams parsed");
    if (queryParams.errorCode) {
      throw new Error(`Solflare Error: ${queryParams.errorMessage}`);
    }
    const phantomPublicKeyStr = ((_a = queryParams.phantom_encryption_public_key || queryParams.solflare_encryption_public_key) == null ? void 0 : _a.trim()) || "";
    const dataStr = (queryParams.data || "").trim();
    const nonceStr = (queryParams.nonce || "").trim();
    if (phantomPublicKeyStr && dataStr && nonceStr) {
      console.log("[SolanaLogin] Key found, attempting decrypt...");
      let phantomPublicKey, dataBytes, nonceBytes;
      try {
        phantomPublicKey = bs58.decode(phantomPublicKeyStr);
      } catch (e) {
        throw new Error(`Invalid base58 in public_key [${phantomPublicKeyStr}]: ${e.message}`);
      }
      try {
        dataBytes = bs58.decode(dataStr);
      } catch (e) {
        throw new Error(`Invalid base58 in data [${dataStr}]: ${e.message}`);
      }
      try {
        nonceBytes = bs58.decode(nonceStr);
      } catch (e) {
        throw new Error(`Invalid base58 in nonce [${nonceStr}]: ${e.message}`);
      }
      const sharedSecret = nacl.box.before(phantomPublicKey, sessionState.dappKeyPair.secretKey);
      sessionState.sharedSecret = sharedSecret;
      sessionState.phantomPublicKey = phantomPublicKey;
      const decryptedBox = nacl.box.open.after(dataBytes, nonceBytes, sharedSecret);
      if (!decryptedBox) {
        throw new Error("Decryption failed. Invalid shared root.");
      }
      const decryptedPayload = JSON.parse(new TextDecoder().decode(decryptedBox));
      if (decryptedPayload.public_key) {
        sessionState.session = decryptedPayload.session;
        return {
          publicKey: new PublicKey(decryptedPayload.public_key),
          session: decryptedPayload.session
        };
      }
    } else {
      throw new Error(`Missing expected fields. pubKey=${!!phantomPublicKeyStr}, data=${!!dataStr}, nonce=${!!nonceStr}`);
    }
  } catch (e) {
    console.error("Error handling connect callback", e);
    throw e;
  }
};
const PLAYER_HUMAN = 1;
const PLAYER_AI = -1;
function App() {
  const isCapacitor = !!window.Capacitor;
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname.startsWith("192.168.") || window.location.hostname.startsWith("10.") || window.location.hostname.startsWith("172.") || window.location.protocol === "file:";
  const PRODUCTION_BACKEND_URL = "https://backgammon-usxq.onrender.com";
  const SERVER_URL = isCapacitor ? PRODUCTION_BACKEND_URL : isLocal ? `http://${window.location.hostname}:3001` : PRODUCTION_BACKEND_URL;
  const [wallet, setWallet] = reactExports.useState(() => {
    return localStorage.getItem("bg_wallet_address") || null;
  });
  const setWalletValue = (val) => {
    setWallet(val);
    if (val) {
      localStorage.setItem("bg_wallet_address", val);
    } else {
      localStorage.removeItem("bg_wallet_address");
    }
  };
  const [balance, setBalance] = reactExports.useState(0);
  const [isLoggedIn, setIsLoggedIn] = reactExports.useState(() => {
    return localStorage.getItem("bg_is_logged_in") === "true";
  });
  const setLoggedInValue = (val) => {
    setIsLoggedIn(val);
    localStorage.setItem("bg_is_logged_in", val ? "true" : "false");
  };
  const [isLoggingIn, setIsLoggingIn] = reactExports.useState(false);
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signMessage, disconnect, connected, select, wallets, connect, wallet: activeWallet } = useWallet();
  const { setVisible } = useWalletModal();
  reactExports.useEffect(() => {
    if (isCapacitor) {
      const processUrl = (url) => {
        console.log(`App processing URL: ${url}`);
        if (url && url.includes("backgammon://")) {
          try {
            const result = handleConnectCallback(url);
            if (result && result.publicKey) {
              const pKeyStr = result.publicKey.toBase58();
              console.log(`Deep link connect success! Key: ${pKeyStr.slice(0, 4)}...`);
              setLoggedInValue(true);
              setWalletValue(pKeyStr);
              handleWalletConnection(pKeyStr);
            } else {
              alert("Solflare callback yielded no keys. Try again.");
              console.log(`Deep link result was null.`);
            }
          } catch (err) {
            alert(`Deep Link Error:

${err.message}`);
            console.log(`Deep link connect error: ${err.message}`);
          }
        }
      };
      App$1.getLaunchUrl().then((launchData) => {
        if (launchData && launchData.url) {
          processUrl(launchData.url);
        }
      });
      const listener = App$1.addListener("appUrlOpen", (data) => {
        if (data && data.url) {
          processUrl(data.url);
        }
      });
      return () => {
        if (listener.remove) listener.remove();
      };
    }
  }, [isCapacitor]);
  reactExports.useEffect(() => {
    if (isCapacitor) {
      StatusBar.hide().catch((e) => console.warn("StatusBar hide failed", e));
    }
  }, [isCapacitor]);
  reactExports.useEffect(() => {
    if (connected && publicKey) {
      const pKeyStr = publicKey.toBase58();
      if (wallet !== pKeyStr) {
        setWalletValue(pKeyStr);
        handleWalletConnection(pKeyStr);
        log(`Connected: ${pKeyStr.slice(0, 4)}...${pKeyStr.slice(-4)}`);
      }
    } else if (!isCapacitor && !connected && wallet && !wallet.startsWith("Guest") && !wallet.startsWith("Mock")) {
      setWalletValue(null);
      setLoggedInValue(false);
    }
  }, [connected, publicKey, wallet]);
  reactExports.useEffect(() => {
    if (activeWallet && !connected && !isLoggingIn) {
      log(`Attempting connection to ${activeWallet.adapter.name}...`);
      connect().catch((err) => {
        var _a;
        log(`Connection failed: ${(_a = err.message) == null ? void 0 : _a.slice(0, 30)}`);
      });
    }
  }, [activeWallet, connected, isLoggingIn]);
  const initialBoard = Array(24).fill(null).map(() => ({ count: 0, player: 0 }));
  const place = (idx, count, player) => {
    initialBoard[idx] = { count, player };
  };
  place(23, 2, PLAYER_HUMAN);
  place(12, 5, PLAYER_HUMAN);
  place(7, 3, PLAYER_HUMAN);
  place(5, 5, PLAYER_HUMAN);
  place(0, 2, PLAYER_AI);
  place(11, 5, PLAYER_AI);
  place(16, 3, PLAYER_AI);
  place(18, 5, PLAYER_AI);
  const [board, setBoard] = reactExports.useState(initialBoard);
  const [bar, setBar] = reactExports.useState({ [PLAYER_HUMAN]: 0, [PLAYER_AI]: 0 });
  const [off, setOff] = reactExports.useState({ [PLAYER_HUMAN]: 0, [PLAYER_AI]: 0 });
  const [dice, setDice] = reactExports.useState([]);
  const [visualDice, setVisualDice] = reactExports.useState([]);
  const [turn, setTurn] = reactExports.useState(null);
  const [difficulty, setDifficulty] = reactExports.useState("beginner");
  const [isDropdownOpen, setIsDropdownOpen] = reactExports.useState(false);
  const [logs, setLogs] = reactExports.useState(["Welcome to Solana Backgammon!"]);
  const [selectedPoint, setSelectedPoint] = reactExports.useState(null);
  const [validMoves, setValidMoves] = reactExports.useState([]);
  const [rolling, setRolling] = reactExports.useState(false);
  const [canRoll, setCanRoll] = reactExports.useState(false);
  const [history, setHistory] = reactExports.useState([]);
  const [gameStatus, setGameStatus] = reactExports.useState("menu");
  const [gameMode, setGameMode] = reactExports.useState("single");
  const [playerColor, setPlayerColor] = reactExports.useState(PLAYER_HUMAN);
  const [roomId, setRoomId] = reactExports.useState(null);
  const [opponentName, setOpponentName] = reactExports.useState("Opponent (Waiting)");
  const [opponentWallet, setOpponentWallet] = reactExports.useState(null);
  const [opponentLevel, setOpponentLevel] = reactExports.useState(1);
  const [opponentStats, setOpponentStats] = reactExports.useState({ wins: 0, losses: 0 });
  const [socket, setSocket] = reactExports.useState(null);
  const [finishingTurn, setFinishingTurn] = reactExports.useState(false);
  const [isBlocked, setIsBlocked] = reactExports.useState(false);
  const [escrowBalance, setEscrowBalance] = reactExports.useState(0);
  const [opponentDisconnected, setOpponentDisconnected] = reactExports.useState(false);
  const [chatMessages, setChatMessages] = reactExports.useState([]);
  const [chatInput, setChatInput] = reactExports.useState("");
  const [unreadChat, setUnreadChat] = reactExports.useState(0);
  const [selectedStake, setSelectedStake] = reactExports.useState(0);
  const [activeLobbies, setActiveLobbies] = reactExports.useState([]);
  const [isLobbyOpen, setIsLobbyOpen] = reactExports.useState(false);
  const [isHosting, setIsHosting] = reactExports.useState(false);
  const [onlineCount, setOnlineCount] = reactExports.useState(1);
  const [incomingInvite, setIncomingInvite] = reactExports.useState(null);
  const [isInviting, setIsInviting] = reactExports.useState(false);
  const gameStatusRef = reactExports.useRef(gameStatus);
  reactExports.useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);
  const selectedStakeRef = reactExports.useRef(selectedStake);
  reactExports.useEffect(() => {
    selectedStakeRef.current = selectedStake;
  }, [selectedStake]);
  const escrowBalanceRef = reactExports.useRef(escrowBalance);
  reactExports.useEffect(() => {
    escrowBalanceRef.current = escrowBalance;
  }, [escrowBalance]);
  const walletRef = reactExports.useRef(wallet);
  reactExports.useEffect(() => {
    walletRef.current = wallet;
  }, [wallet]);
  const gameModeRef = reactExports.useRef(gameMode);
  reactExports.useEffect(() => {
    gameModeRef.current = gameMode;
  }, [gameMode]);
  const opponentNameRef = reactExports.useRef(opponentName);
  reactExports.useEffect(() => {
    opponentNameRef.current = opponentName;
  }, [opponentName]);
  reactExports.useEffect(() => {
    const newSocket = lookup(SERVER_URL);
    setSocket(newSocket);
    newSocket.on("connect", () => {
      console.log("Connected to Game Server:", newSocket.id);
      setLogs((prev) => ["Connected to Server!", ...prev]);
      if (walletRef.current) {
        console.log("Reconnected to socket. Checking for active game and registering:", walletRef.current);
        newSocket.emit("check_active_game", walletRef.current);
        const existing = localStorage.getItem("bg_profile_" + walletRef.current);
        let profile;
        try {
          profile = existing ? JSON.parse(existing) : null;
        } catch (e) {
        }
        newSocket.emit("register_user", {
          wallet: walletRef.current,
          name: (profile == null ? void 0 : profile.name) || "",
          avatar: (profile == null ? void 0 : profile.avatar) || null
        });
      }
      fetchLeaderboard();
    });
    newSocket.on("connect_error", (err) => {
      console.error("Connection Error:", err);
      setLogs((prev) => ["Connection Failed! Check Server URL.", ...prev]);
    });
    newSocket.on("online_count_update", (data) => {
      setOnlineCount(data.count);
    });
    newSocket.on("waiting_for_match", () => {
      setLogs((prev) => ["Waiting for an opponent...", ...prev]);
    });
    newSocket.on("active_game_found", ({ roomId: roomId2 }) => {
      console.log("Found Active Game:", roomId2);
      if (wallet && !isSearching) {
        handleSearchMatch(null);
      }
    });
    newSocket.on("match_found", (data) => {
      var _a, _b;
      console.log("Match Found Event Data:", data);
      console.log("My Socket ID:", newSocket.id);
      setRoomId(data.roomId);
      setIsSearching(false);
      setIsInviting(false);
      setInvitingPlayerName(null);
      const pIds = Object.keys(data.players);
      const oppId = pIds.find((id) => id !== newSocket.id);
      console.log("Opponent ID found:", oppId);
      const oppName = ((_a = data.players[oppId]) == null ? void 0 : _a.name) || "Opponent";
      console.log("Opponent Name resolved:", oppName);
      setOpponentName(oppName);
      setOpponentWallet(((_b = data.players[oppId]) == null ? void 0 : _b.wallet) || null);
      if (data.players[oppId]) {
        setOpponentLevel(data.players[oppId].level || 1);
        setOpponentStats(data.players[oppId].stats || { wins: 0, losses: 0 });
      }
      if (data.isRejoin) {
        return;
      }
    });
    newSocket.on("assign_color", (colorStr) => {
      const myColor = colorStr === "white" ? PLAYER_HUMAN : PLAYER_AI;
      setPlayerColor(myColor);
      console.log("Assigned Color:", colorStr, myColor);
      const stake = selectedStakeRef.current;
      if (stake && stake > 0) {
        const balance2 = escrowBalanceRef.current || 0;
        if (balance2 >= stake) {
          setEscrowBalance((prev) => parseFloat((prev - stake).toFixed(2)));
          log(`Staked ${stake} SOL from Escrow Balance.`);
          setGameMode("multi");
          setGameStatus("opening_roll");
          setOpeningRoll(null);
          const resetBoard = Array(24).fill(null).map(() => ({ count: 0, player: 0 }));
          const placeReset = (idx, count, player) => {
            resetBoard[idx] = { count, player };
          };
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
          setTurn("human");
          log(`Match Found against ${opponentNameRef.current}! Good luck!`);
        } else {
          alert(`Insufficient Escrow Balance! You need ${stake} SOL. Please deposit.`);
          setGameStatus("multiplayer_menu");
          return;
        }
      } else {
        setGameMode("multi");
        setGameStatus("opening_roll");
        setOpeningRoll(null);
        const resetBoard = Array(24).fill(null).map(() => ({ count: 0, player: 0 }));
        const placeReset = (idx, count, player) => {
          resetBoard[idx] = { count, player };
        };
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
        setTurn("human");
        log(`Match Found against ${opponentNameRef.current}! Have fun!`);
      }
    });
    newSocket.on("game_update", ({ type, payload }) => {
      console.log(`[CLIENT] Received game_update: ${type}`, payload);
      if (handleRemoteEventRef.current) {
        handleRemoteEventRef.current(type, payload);
      } else {
        console.error("[CLIENT] handleRemoteEventRef is null!");
      }
    });
    newSocket.on("withdraw_success", ({ amount, signature }) => {
      log(`Withdrawal of ${amount} SOL sent! Sig: ${signature.slice(0, 8)}...`);
      alert(`Funds sent to your wallet!`);
      setEscrowBalance((prev) => parseFloat((prev - amount).toFixed(2)));
    });
    newSocket.on("chat_message", (msg) => {
      setChatMessages((prev) => [...prev.slice(-49), msg]);
      if (msg.sender !== "You") {
        setUnreadChat((prev) => prev + 1);
      }
    });
    newSocket.on("receive_invite", (data) => {
      console.log("RECEIVED INVITE:", data);
      setIncomingInvite(data);
    });
    newSocket.on("invite_result", ({ fromWallet, response }) => {
      console.log("INVITE RESULT:", fromWallet, response);
      setIsInviting(false);
      setInvitingPlayerName(null);
      if (response === "decline") {
        alert("Player declined your invite.");
      }
    });
    newSocket.on("request_state_sync", () => {
      const state = gameStateRef.current;
      if (state.roomId) {
        log("Syncing state to opponent...");
        newSocket.emit("sync_state", {
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
    newSocket.on("sync_state_received", (state) => {
      log("Game State Synced!");
      setBoard(state.board);
      setBar(state.bar);
      setOff(state.off);
      const myTurnStr = state.turn === "human" ? "opponent" : "human";
      setTurn(myTurnStr);
      if (myTurnStr === "human") {
        if (state.dice && state.dice.length > 0) {
          setDice(state.dice);
          setVisualDice(state.dice.slice(0, 2));
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
    newSocket.on("user_profile_update", (data) => {
      console.log("[SOCKET] Profile updated from server:", data);
      setUserProfile((prev) => {
        const updated = {
          ...prev,
          name: data.name !== void 0 ? data.name : prev.name,
          avatar: data.avatar !== void 0 ? data.avatar : prev.avatar,
          stats: {
            ...data.stats
            // Accept all stats from server (wins, losses, xp, level)
          }
        };
        if (walletRef.current && !walletRef.current.startsWith("Guest")) {
          localStorage.setItem("bg_profile_" + walletRef.current, JSON.stringify(updated));
        }
        return updated;
      });
    });
    newSocket.on("lobby_list_update", (lobbies) => {
      console.log("Lobbies Updated:", lobbies);
      setActiveLobbies(lobbies);
    });
    newSocket.on("rejoin_success", ({ roomId: roomId2, color, players }) => {
      var _a, _b;
      log("Rejoined match! Waiting for sync...");
      const myColor = color === "white" ? PLAYER_HUMAN : PLAYER_AI;
      setPlayerColor(myColor);
      setRoomId(roomId2);
      setGameMode("multi");
      setGameStatus("playing");
      setOpeningRoll(null);
      setOpponentDisconnected(false);
      if (players) {
        const pIds = Object.keys(players);
        const oppId = pIds.find((id) => players[id].wallet !== walletRef.current);
        if (oppId) {
          const oppName = ((_a = players[oppId]) == null ? void 0 : _a.name) || "Opponent";
          setOpponentName(oppName);
          setOpponentWallet(((_b = players[oppId]) == null ? void 0 : _b.wallet) || null);
          console.log("Opponent Updated (Rejoin):", oppName);
        }
      }
    });
    newSocket.on("active_game_not_found", () => {
      const currentStatus = gameStatusRef.current;
      const mode = gameModeRef.current;
      if (mode !== "multi") {
        console.log("Ignoring active_game_not_found in non-multiplayer mode:", mode);
        return;
      }
      console.log("No active game found.");
      if (currentStatus === "playing" || currentStatus === "waiting_for_match") {
        console.log("Forcing return to menu from stale game.");
        setGameStatus("menu");
        setRoomId(null);
        setOpponentDisconnected(false);
        setTimeout(() => fetchLeaderboard(), 1e3);
        if (walletRef.current) {
          newSocket.emit("register_user", walletRef.current);
        }
        alert("Game session expired. You may have timed out.");
      }
    });
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("App returned to foreground.");
        if (!newSocket.connected) {
          console.log("Socket disconnected. Reconnecting...");
          newSocket.connect();
        } else {
          if (walletRef.current) {
            newSocket.emit("check_active_game", walletRef.current);
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      newSocket.close();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const gameStateRef = reactExports.useRef({});
  reactExports.useEffect(() => {
    gameStateRef.current = { board, bar, off, dice, turn, roomId };
  }, [board, bar, off, dice, turn, roomId]);
  const handleRemoteEventRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    handleRemoteEventRef.current = handleRemoteEvent;
  });
  const handleRemoteEvent = (type, payload) => {
    const currentStatus = gameStatusRef.current;
    if (type === "opponent_disconnectING") {
      console.log("EVENT RECEIVED: Opponent Disconnecting");
      log(`Opponent disconnected! Waiting ${payload.timeLeft}s...`);
      setOpponentDisconnected(true);
    } else if (type === "opponent_reconnected") {
      log("Opponent returned! Resuming...");
      setOpponentDisconnected(false);
    } else if (type === "roll") {
      playDiceSound();
      setRolling(true);
      if (currentStatus !== "opening_roll") {
        setDice([]);
        setVisualDice([]);
      }
      setTimeout(() => {
        setRolling(false);
        if (currentStatus === "opening_roll" && payload.length === 1) {
          const val = payload[0];
          log(`Opponent Rolled: ${val} (Opening)`);
          setOpeningRoll((prev) => {
            const newState = { ...prev || {}, ai: val };
            if (newState.human) {
              setVisualDice([newState.human, val]);
            } else {
              setVisualDice([val]);
            }
            checkMultiOpeningWinner(newState);
            return newState;
          });
        } else {
          log(`Opponent Rolled: ${payload.join(", ")}`);
          setVisualDice(payload.slice(0, 2));
          setDice(payload);
        }
      }, 800);
    } else if (type === "opponent_reconnected") {
      console.log("Opponent returned! Resuming...");
      setOpponentDisconnected(false);
    } else if (type === "opponent_disconnectING") {
      console.log("Opponent Disconnecting... Waiting...");
      setOpponentDisconnected(true);
    } else if (type === "state_update") {
      console.log("Applying State Sync:", payload);
      if (payload.board) setBoard(payload.board);
      if (payload.bar) setBar(payload.bar);
      if (payload.off) setOff(payload.off);
      if (payload.dice) {
        if (turn === "human" && dice.length > 0) {
          console.warn("Ignored remote dice update because I have active dice:", dice, "Remote:", payload.dice);
        } else {
          setDice(payload.dice);
          if (payload.dice.length > 0) {
            setVisualDice(payload.dice.slice(0, 2));
          }
        }
      }
      if (payload.turn) {
        const newTurn = payload.turn === "human" ? "ai" : "human";
        setTurn(newTurn);
        if (newTurn === "human") {
          if (!payload.dice || payload.dice.length === 0) {
            setCanRoll(true);
            setRolling(false);
            log("It's your turn. Please Roll.");
          } else {
            setCanRoll(false);
            setRolling(false);
            log("It's your turn. Please Move.");
          }
        } else {
          setCanRoll(false);
        }
      }
      log("Game State Synchronized.");
    } else if (type === "move") {
      if (payload.board) {
        setBoard(payload.board);
        setBar(payload.bar);
      }
    } else if (type === "end_turn") {
      log("Opponent finished turn.");
      setTurn("human");
      setDice([]);
      setVisualDice([]);
      setCanRoll(true);
    } else if (type === "resign") {
      setGameStatus("gameover");
      setGameResult("win");
      log("Opponent Resigned! You Win!");
      playDiceSound();
      updateStats("win");
    } else if (type === "opponent_disconnected") {
      setGameStatus("gameover");
      setGameResult("win");
      log("Opponent Disconnected! You Win!");
      setOpponentDisconnected(false);
    }
  };
  const emitGameEvent = (type, payload) => {
    if (socket && roomId) {
      socket.emit("game_event", { roomId, type, payload });
    }
  };
  const [userProfile, setUserProfile] = reactExports.useState({ name: "", avatar: null, stats: { wins: 0, losses: 0, xp: 0, level: 1 } });
  const [isProfileModalOpen, setIsProfileModalOpen] = reactExports.useState(false);
  const [turnTimer, setTurnTimer] = reactExports.useState(180);
  reactExports.useEffect(() => {
    let interval = null;
    if (gameStatus === "playing" && turn === "human") {
      interval = setInterval(() => {
        setTurnTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleForfeit();
            return 0;
          }
          return prev - 1;
        });
      }, 1e3);
    } else {
      setTurnTimer(180);
      setIsBlocked(false);
    }
    return () => clearInterval(interval);
  }, [turn, gameStatus]);
  const handleForfeit = () => {
    if (gameMode === "multi") {
      emitGameEvent("resign", {});
      setGameStatus("gameover");
      setGameResult("loss");
      log("You resigned.");
      updateStats("loss");
    } else {
      setGameStatus("menu");
      setGameMode("single");
      log("You resigned from single player.");
    }
  };
  reactExports.useEffect(() => {
    if (wallet && !wallet.startsWith("Guest")) {
      const saved = localStorage.getItem("bg_profile_" + wallet);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (!parsed.stats) parsed.stats = { wins: 0, losses: 0, xp: 0, level: 1 };
          setUserProfile(parsed);
        } catch (e) {
          console.error(e);
        }
      } else {
        setUserProfile({ name: "", avatar: null, stats: { wins: 0, losses: 0, xp: 0, level: 1 } });
      }
      const savedBalance = localStorage.getItem("escrow_balance_" + wallet);
      if (savedBalance) {
        setEscrowBalance(parseFloat(savedBalance));
      } else {
        setEscrowBalance(0);
      }
    } else if (wallet && wallet.startsWith("Guest")) {
      setUserProfile({ name: "Guest", avatar: null, stats: { wins: 0, losses: 0, xp: 0, level: 1 } });
      setEscrowBalance(0);
    }
  }, [wallet]);
  reactExports.useEffect(() => {
    if (wallet && !wallet.startsWith("Guest")) {
      localStorage.setItem("escrow_balance_" + wallet, escrowBalance.toString());
    }
  }, [escrowBalance, wallet]);
  const updateStats = (result) => {
    if (!wallet || wallet.startsWith("Guest")) return;
    setUserProfile((prev) => {
      const newStats = { ...prev.stats };
      if (result === "win") {
        newStats.wins += 1;
        newStats.xp += 20;
      } else {
        newStats.losses += 1;
        newStats.xp += 5;
      }
      newStats.level = Math.floor(newStats.xp / 100) + 1;
      const newProfile = { ...prev, stats: newStats };
      localStorage.setItem("bg_profile_" + wallet, JSON.stringify(newProfile));
      return newProfile;
    });
  };
  const handleSaveProfile = (name, avatarBase64) => {
    const updated = { ...userProfile, name, avatar: avatarBase64 };
    setUserProfile(updated);
    if (wallet && !wallet.startsWith("Guest")) {
      try {
        localStorage.setItem("bg_profile_" + wallet, JSON.stringify(updated));
        if (socket) {
          socket.emit("register_user", {
            wallet,
            name,
            avatar: avatarBase64
          });
          setTimeout(() => fetchLeaderboard(), 500);
        }
      } catch (e) {
        alert("Image too large/Error saving profile.");
        console.error(e);
      }
    }
    setIsProfileModalOpen(false);
  };
  const chatEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);
  const [gameResult, setGameResult] = reactExports.useState(null);
  const [depositTx, setDepositTx] = reactExports.useState(null);
  const handleEscrowDeposit = async () => {
    const amountStr = prompt("Enter annual amount to deposit (SOL):", "0.1");
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;
    try {
      if (!publicKey) return alert("Wallet Login first");
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("6cgsK8ph5tNUCiKG5WXLMZFX1CoL4jzuVouTPBwPC8fk"),
          // House Escrow
          lamports: amount * 1e9
        })
      );
      const signature = await sendTransaction(transaction, connection);
      log("Escrow Deposit: " + amount + " SOL");
      setEscrowBalance((prev) => parseFloat((prev + amount).toFixed(2)));
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
    log(`Requesting Withdrawal of ${amount} SOL...`);
    console.log("Emitting request_withdraw", { wallet, amount });
    if (socket && socket.connected) {
      socket.emit("request_withdraw", { wallet, amount });
    } else {
      alert("Not connected to server. Please try refreshing or checking connection.");
      if (socket) socket.connect();
    }
  };
  const [isSearching, setIsSearching] = reactExports.useState(false);
  const [isConditionsOpen, setIsConditionsOpen] = reactExports.useState(false);
  const [showGuestPopup, setShowGuestPopup] = reactExports.useState(false);
  const [showResignModal, setShowResignModal] = reactExports.useState(false);
  const handleSearchMatch = (stake) => {
    var _a, _b, _c;
    if (stake !== null && stake !== 0) {
      if (!wallet || wallet.startsWith("Guest")) {
        setShowGuestPopup(true);
        return;
      }
    }
    setSelectedStake(stake);
    if (stake === null || stake === 0) {
      setIsLobbyOpen(true);
      if (socket) {
        console.log("Requesting lobbies from server...");
        socket.emit("get_lobbies");
      }
    } else {
      setIsSearching(true);
      if (socket) {
        const profile = userProfile;
        const walletStr = wallet;
        const displayName = profile.name && profile.name.trim() !== "" ? profile.name : `${walletStr.slice(0, 4)}...${walletStr.slice(-4)}`;
        socket.emit("find_match", {
          name: displayName,
          wallet: walletStr,
          level: ((_a = profile.stats) == null ? void 0 : _a.level) || 1,
          stats: {
            wins: ((_b = profile.stats) == null ? void 0 : _b.wins) || 0,
            losses: ((_c = profile.stats) == null ? void 0 : _c.losses) || 0
          }
        });
      }
    }
  };
  const handleHostGame = () => {
    var _a;
    if (!socket || !wallet) return;
    const profile = userProfile;
    const displayName = profile.name && profile.name.trim() !== "" ? profile.name : `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
    setIsHosting(true);
    socket.emit("create_lobby", {
      name: displayName,
      wallet,
      level: ((_a = profile.stats) == null ? void 0 : _a.level) || 1,
      stats: profile.stats
    });
    log("Hosting Free Play Game...");
  };
  const handleJoinLobby = (lobby) => {
    var _a;
    if (!socket || !wallet) return;
    const profile = userProfile;
    const displayName = profile.name && profile.name.trim() !== "" ? profile.name : `${wallet.slice(0, 4)}...${wallet.slice(-4)}`;
    socket.emit("join_lobby", {
      roomId: lobby.roomId,
      userData: {
        name: displayName,
        wallet,
        level: ((_a = profile.stats) == null ? void 0 : _a.level) || 1,
        stats: profile.stats
      }
    });
    setIsLobbyOpen(false);
    log(`Joining ${lobby.hostData.name}'s table...`);
  };
  const handleLeaveLobby = () => {
    if (socket) socket.emit("leave_lobby");
    setIsHosting(false);
    log("Lobby closed.");
  };
  const [invitingPlayerName, setInvitingPlayerName] = reactExports.useState(null);
  const handleInvitePlayer = (targetWallet, targetName) => {
    if (!socket || !wallet) return;
    if (targetWallet === wallet) return alert("You cannot invite yourself!");
    if (gameStatus !== "leaderboard") return;
    setIsInviting(true);
    setInvitingPlayerName(targetName);
    socket.emit("invite_player", { targetWallet, stake: 0 });
    log(`Inviting ${targetName}...`);
  };
  const handleRespondToInvite = (response) => {
    if (!socket || !incomingInvite) return;
    const fromUserData = {
      wallet: incomingInvite.fromWallet,
      name: incomingInvite.fromName,
      level: 1,
      // Placeholder
      stats: { wins: 0, losses: 0, xp: 0 }
    };
    const myUserData = {
      wallet,
      name: userProfile.name,
      level: userProfile.stats.level,
      stats: userProfile.stats
    };
    socket.emit("invite_response", {
      fromWallet: incomingInvite.fromWallet,
      response,
      myUserData,
      fromUserData
    });
    setIncomingInvite(null);
    if (response === "accept") {
      log("Accepting invite...");
    }
  };
  const [leaderboardData, setLeaderboardData] = reactExports.useState([]);
  const [expandedLeaderboardIndex, setExpandedLeaderboardIndex] = reactExports.useState(null);
  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/leaderboard`);
      const data = await res.json();
      const formatted = data.map((u) => ({
        wallet: u.wallet,
        name: u.name || `${u.wallet.slice(0, 4)}...${u.wallet.slice(-4)}`,
        avatar: u.avatar || null,
        isOnline: u.isOnline,
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
      setLeaderboardData([]);
    }
  };
  reactExports.useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 1e4);
    return () => clearInterval(interval);
  }, []);
  const handleWalletConnection = async (pKeyStr) => {
    log(`Handshake with ${pKeyStr.slice(0, 8)}...`);
    setWalletValue(pKeyStr);
    const existing = localStorage.getItem("bg_profile_" + pKeyStr);
    let profileData;
    if (existing) {
      try {
        profileData = JSON.parse(existing);
      } catch (e) {
        profileData = { name: "", avatar: null, stats: { level: 1, wins: 0, losses: 0, xp: 0 } };
      }
    } else {
      profileData = { name: "", avatar: null, stats: { level: 1, wins: 0, losses: 0, xp: 0 } };
    }
    setUserProfile(profileData);
    if (socket) {
      socket.emit("register_user", pKeyStr);
      fetchLeaderboard();
      setTimeout(() => fetchLeaderboard(), 1e3);
      if (gameStatus === "menu") {
        socket.emit("check_active_game", pKeyStr);
      }
    }
  };
  const handleIdentitySignature = async () => {
    var _a, _b;
    if (!signMessage || !publicKey) return;
    try {
      setIsLoggingIn(true);
      log("IDENTITY: Requesting proof of ownership...");
      const message = new TextEncoder().encode("Login to Backgammon Solana");
      const signed = await signMessage(message);
      if (signed) {
        setLoggedInValue(true);
        log("IDENTITY: Success!");
        handleWalletConnection(publicKey.toBase58());
        return true;
      }
    } catch (err) {
      log(`ID ERR: ${(_a = err.message) == null ? void 0 : _a.slice(0, 30)}`);
      if (!((_b = err.message) == null ? void 0 : _b.includes("User rejected"))) {
        log("IDENTITY: Message blocked, trying transaction proof...");
        try {
          const tx = new Transaction().add(SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: publicKey,
            lamports: 0
          }));
          tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
          tx.feePayer = publicKey;
          const sig = await sendTransaction(tx, connection);
          if (sig) {
            setLoggedInValue(true);
            handleWalletConnection(publicKey.toBase58());
            return true;
          }
        } catch (txErr) {
          log("ID: Tx proof failed.");
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
    return false;
  };
  const connectWallet = async () => {
    log(`TAP: Connect`);
    if (isCapacitor) {
      try {
        const connectUrl = buildConnectUrl();
        window.open(connectUrl, "_system");
        return;
      } catch (err) {
        log(`Failed to build connect URL: ${err.message}`);
      }
    }
    if (connected && publicKey && !isLoggedIn) {
      await handleIdentitySignature();
      return;
    }
    if (!connected) {
      log("Connecting to Solflare...");
      const solflareWallet = wallets.find((w) => w.adapter.name === "Solflare");
      if (solflareWallet) {
        select(solflareWallet.adapter.name);
      } else {
        log("Error: Solflare adapter not found.");
      }
    }
  };
  reactExports.useEffect(() => {
    log(`State: Conn=${connected} PK=${!!publicKey} SignFn=${!!signMessage}`);
  }, [connected, publicKey, !!signMessage]);
  const handleGuestLogin = () => {
    const guestId = Math.floor(Math.random() * 9e3) + 1e3;
    setWalletValue(`Guest#${guestId}`);
    setBalance("1000 PLAY");
    log("Logged in as Guest.");
  };
  const log = (msg) => {
    setLogs((prev) => [msg, ...prev.slice(0, 4)]);
  };
  const [openingRoll, setOpeningRoll] = reactExports.useState(null);
  const startGame = (diff) => {
    setDifficulty(diff || "advanced");
    setGameMode("single");
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
    setPlayerColor(PLAYER_HUMAN);
    setGameStatus("opening_roll");
    log(`Game Started! Difficulty: ${diff}`);
    log("Rolling for first turn...");
  };
  const handleOpeningRoll = () => {
    playDiceSound();
    setRolling(true);
    if (gameMode === "multi") {
      if (openingRoll && openingRoll.human) return;
      setTimeout(() => {
        const hDie = Math.ceil(Math.random() * 6);
        setOpeningRoll((prev) => {
          const newState = { ...prev || {}, human: hDie };
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
        emitGameEvent("roll", [hDie]);
      }, 600);
      return;
    }
    setTimeout(() => {
      const hDie = Math.ceil(Math.random() * 6);
      const aDie = Math.ceil(Math.random() * 6);
      setOpeningRoll({ human: hDie, ai: aDie });
      setRolling(false);
      if (hDie > aDie) {
        log(`You rolled ${hDie}, AI rolled ${aDie}. You start!`);
        setTurn("human");
        setDice([]);
        setVisualDice([]);
        setCanRoll(true);
        setTimeout(() => setGameStatus("playing"), 1500);
      } else if (aDie > hDie) {
        log(`You rolled ${hDie}, AI rolled ${aDie}. AI starts!`);
        setTurn("ai");
        setDice([]);
        setVisualDice([]);
        setTimeout(() => {
          setGameStatus("playing");
        }, 1500);
      } else {
        log(`Tie (${hDie}-${aDie})! Rerolling...`);
        setTimeout(handleOpeningRoll, 1e3);
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
          setTurn("human");
          setDice([]);
          setVisualDice([]);
          setCanRoll(true);
          setGameStatus("playing");
          setOpeningRoll(null);
        } else if (a > h) {
          log(`Opponent won opening roll (${a} vs ${h}). Opponent starts.`);
          setTurn("opponent");
          setDice([]);
          setVisualDice([]);
          setGameStatus("playing");
          setOpeningRoll(null);
        } else {
          log(`Tie (${h}-${a})! Re-rolling...`);
          setTimeout(() => {
            setOpeningRoll(null);
            log("Click Roll to try again.");
          }, 1500);
        }
      }, 1e3);
    }
  };
  const handleManualRoll = () => {
    if (!canRoll || rolling || turn !== "human") return;
    performRoll((d) => {
      log(`You Rolled: ${d.join(", ")}`);
      setCanRoll(false);
      setHistory([]);
      setIsBlocked(false);
      if (gameMode === "multi") {
        emitGameEvent("roll", d);
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
    setIsBlocked(false);
    setHistory((prev) => prev.slice(0, -1));
    setValidMoves([]);
    setSelectedPoint(null);
    log("Undo last move.");
    if (gameMode === "multi") {
      emitGameEvent("state_update", {
        board: lastState.board,
        bar: lastState.bar,
        dice: lastState.dice
      });
    }
  };
  const Die = ({ value, isOpponent, style, className, children }) => {
    const dots = value ? Array.from({ length: value }) : [];
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `die-3d ${value ? `die-face-${value}` : ""} ${isOpponent ? "opponent" : ""} ${className || ""}`, style, children: value ? dots.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" }, i)) : children });
  };
  const playMoveSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
    }
  };
  const playDiceSound = () => {
    try {
      const audio = new Audio("/dice-roll.mp3");
      audio.play().catch(() => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const t = ctx.currentTime;
        [0, 0.1].forEach((offset) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(150 + Math.random() * 50, t + offset);
          osc.frequency.exponentialRampToValueAtTime(40, t + offset + 0.1);
          gain.gain.setValueAtTime(0.5, t + offset);
          gain.gain.exponentialRampToValueAtTime(0.01, t + offset + 0.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + offset);
          osc.stop(t + offset + 0.1);
        });
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
  const handlePassTurn = () => {
    setDice([]);
    setIsBlocked(false);
    setFinishingTurn(true);
    setTimeout(() => {
      setFinishingTurn(false);
      if (gameMode === "multi") {
        log("Turn Finished. Waiting for opponent...");
        setTurn("opponent");
        emitGameEvent("end_turn", {});
      } else {
        log("Turn Finished. AI Moving...");
        setTurn("ai");
      }
    }, 2e3);
  };
  const checkHumanCanMove = (currentBoard, currentBar, currentDice) => {
    if (currentDice.length === 0) return true;
    const uniqueDice = [...new Set(currentDice)];
    const opponent = playerColor === PLAYER_HUMAN ? PLAYER_AI : PLAYER_HUMAN;
    const direction = playerColor === PLAYER_HUMAN ? -1 : 1;
    if (currentBar[playerColor] > 0) {
      return uniqueDice.some((d) => {
        const target = playerColor === PLAYER_HUMAN ? 24 - d : d - 1;
        if (target >= 0 && target <= 23) {
          const dest = currentBoard[target];
          return !(dest.player === opponent && dest.count > 1);
        }
        return false;
      });
    }
    let canBearOff = true;
    if (currentBar[playerColor] > 0) canBearOff = false;
    else {
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
          const target = i + d * direction;
          if (target >= 0 && target <= 23) {
            const dest = currentBoard[target];
            if (!(dest.player === opponent && dest.count > 1)) return true;
          } else if (canBearOff) {
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
  reactExports.useEffect(() => {
    if (turn === "human" && !rolling && dice.length > 0) {
      const canMove = checkHumanCanMove(board, bar, dice);
      if (!canMove) {
        log("No valid moves possible. Undo to retry, or Pass.");
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    }
  }, [dice, turn, rolling, board, bar, playerColor]);
  reactExports.useEffect(() => {
    if (gameStatus === "playing" && turn === "ai" && gameMode === "single") {
      const timer = setTimeout(() => {
        playAITurn();
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [turn, gameStatus, gameMode]);
  const playAITurn = () => {
    try {
      log("AI Rolling...");
      performRoll((aiDice) => {
        log(`AI Rolled: ${aiDice.join(", ")}`);
        const getBestSequence = (startBoard, startBar, dicePool) => {
          let bestSeq = [];
          let maxScore = -Infinity;
          let maxDiceUsed = -1;
          let maxDiceValSum = -1;
          const evaluateBoard = (bd, br) => {
            let score = 0;
            let allHome = true;
            if (br[PLAYER_AI] > 0) allHome = false;
            else {
              for (let i = 0; i <= 17; i++) {
                if (bd[i].player === PLAYER_AI && bd[i].count > 0) {
                  allHome = false;
                  break;
                }
              }
            }
            let opponentInHouse = false;
            for (let i = 18; i < 24; i++) {
              if (bd[i].player === PLAYER_HUMAN && bd[i].count > 0) {
                opponentInHouse = true;
                break;
              }
            }
            if (allHome) {
              let piecesOnBoard = 0;
              for (let i = 18; i < 24; i++) {
                if (bd[i].player === PLAYER_AI) piecesOnBoard += bd[i].count;
              }
              score += (15 - piecesOnBoard) * 1e5;
              if (opponentInHouse) {
                for (let i = 18; i < 24; i++) {
                  if (bd[i].player === PLAYER_AI && bd[i].count === 1) {
                    score -= 2e5;
                  }
                }
              } else {
              }
              return score;
            }
            score += br[PLAYER_HUMAN] * 12e3;
            for (let i = 0; i < 24; i++) {
              const p = bd[i];
              if (p.player === PLAYER_AI) {
                if (p.count === 1) {
                  score -= 4e3;
                } else if (p.count > 1) {
                  score += 2e3;
                  if (i >= 18) score += 3e3;
                  if (i >= 12 && i < 18) score += 1e3;
                }
              }
            }
            let totalDistance = 0;
            for (let i = 0; i < 24; i++) {
              if (bd[i].player === PLAYER_AI) {
                totalDistance += i * bd[i].count;
              }
            }
            score += totalDistance * 10;
            return score;
          };
          const search = (currentBoard, currentBar, currentDice, moveSeq) => {
            const diceUsed = moveSeq.length;
            let validMovesFound = false;
            const uniqueDice = [...new Set(currentDice)];
            for (let die of uniqueDice) {
              if (currentBar[PLAYER_AI] > 0) {
                const target = die - 1;
                if (target >= 0 && target <= 23) {
                  const dest = currentBoard[target];
                  if (!(dest.player === PLAYER_HUMAN && dest.count > 1)) {
                    validMovesFound = true;
                    const nextBoard = JSON.parse(JSON.stringify(currentBoard));
                    const nextBar = { ...currentBar };
                    nextBar[PLAYER_AI]--;
                    let action = "move";
                    if (nextBoard[target].player === PLAYER_HUMAN) {
                      nextBar[PLAYER_HUMAN]++;
                      nextBoard[target] = { player: PLAYER_AI, count: 1 };
                      action = "hit";
                    } else {
                      nextBoard[target].player = PLAYER_AI;
                      nextBoard[target].count++;
                    }
                    const nextDice = [...currentDice];
                    nextDice.splice(nextDice.indexOf(die), 1);
                    search(nextBoard, nextBar, nextDice, [...moveSeq, {
                      from: "bar",
                      to: target,
                      dieVal: die,
                      action
                    }]);
                  }
                }
              } else {
                for (let i = 0; i < 24; i++) {
                  if (currentBoard[i].player === PLAYER_AI) {
                    const target = i + die;
                    if (target <= 23) {
                      const dest = currentBoard[target];
                      if (!(dest.player === PLAYER_HUMAN && dest.count > 1)) {
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
                          from: i,
                          to: target,
                          dieVal: die
                        }]);
                      }
                    } else {
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
                        if (target === 24) validBearOff = true;
                        else {
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
                          search(nextBoard, nextBar, nextDice, [...moveSeq, {
                            from: i,
                            to: -1,
                            dieVal: die,
                            action: "bearoff"
                          }]);
                        }
                      }
                    }
                  }
                }
              }
            }
            if (!validMovesFound) {
              const diceUsed2 = moveSeq.length;
              const valSum = moveSeq.reduce((a, b) => a + b.dieVal, 0);
              if (diceUsed2 > maxDiceUsed) {
                maxDiceUsed = diceUsed2;
                maxDiceValSum = valSum;
                maxScore = evaluateBoard(currentBoard, currentBar);
                bestSeq = moveSeq;
              } else if (diceUsed2 === maxDiceUsed) {
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
        let sequence = [];
        if (difficulty === "beginner") {
          sequence = getBestSequence(board, bar, aiDice);
        } else {
          sequence = getBestSequence(board, bar, aiDice);
        }
        if (sequence.length === 0) {
          log("AI has no moves.");
          setTurn("human");
          setCanRoll(true);
          setDice([]);
          setVisualDice([]);
          setHistory([]);
          return;
        }
        log(`AI found BEST path: ${sequence.length} moves.`);
        const runSequence = (seq, idx, currBoard, currBar) => {
          if (idx >= seq.length) {
            setTimeout(() => {
              log("AI Turn Ends.");
              setTurn("human");
              setCanRoll(true);
              setDice([]);
              setVisualDice([]);
              setHistory([]);
            }, 800);
            return;
          }
          const move = seq[idx];
          setTimeout(() => {
            setBoard((prev) => {
              const nb = [...prev];
              if (move.from === "bar") {
                setBar((b) => {
                  const newBarState = { ...b };
                  newBarState[PLAYER_AI]--;
                  if (move.action === "hit") {
                    newBarState[PLAYER_HUMAN]++;
                    log("AI Hits!");
                  }
                  return newBarState;
                });
              } else {
                const src = { ...nb[move.from] };
                src.count--;
                if (src.count === 0) src.player = 0;
                nb[move.from] = src;
              }
              playMoveSound();
              if (move.to === -1) {
                log("AI Bears Off.");
                setOff((prev2) => ({ ...prev2, [PLAYER_AI]: prev2[PLAYER_AI] + 1 }));
              } else {
                const dst = { ...nb[move.to] };
                if (dst.player === PLAYER_HUMAN) {
                  setBar((b) => ({ ...b, [PLAYER_HUMAN]: b[PLAYER_HUMAN] + 1 }));
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
            setDice((prev) => {
              const newD = [...prev];
              const dIdx = newD.indexOf(move.dieVal);
              if (dIdx > -1) newD.splice(dIdx, 1);
              return newD;
            });
            runSequence(seq, idx + 1, null, null);
          }, 1e3);
        };
        runSequence(sequence, 0, board, bar);
      });
    } catch (e) {
      console.error("AI Error:", e);
      log("AI Error: " + e.message);
    }
  };
  const handlePointClick = (index) => {
    if (turn !== "human" || rolling) return;
    const isOwnedPiece = index >= 0 && index <= 23 && board[index].player === playerColor && board[index].count > 0;
    const isMoveTarget = validMoves.includes(index);
    const isReSelection = selectedPoint !== null && isOwnedPiece && !isMoveTarget && index !== selectedPoint;
    if (selectedPoint === null || isReSelection) {
      if (bar[playerColor] > 0) return log("Must enter from bar!");
      if (isOwnedPiece) {
        setSelectedPoint(index);
        const possibleMoves = [];
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
        [...new Set(dice)].forEach((d) => {
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
              const exact = playerColor === PLAYER_HUMAN ? index - d === -1 : index + d === 24;
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
    } else {
      const targetIndex = index === selectedPoint && validMoves.includes(-1) ? -1 : index;
      if (!validMoves.includes(targetIndex)) {
        if (index === selectedPoint) {
          setSelectedPoint(null);
          setValidMoves([]);
        } else {
          log("Invalid move!");
        }
        return;
      }
      playMoveSound();
      const snapshot = {
        board: JSON.parse(JSON.stringify(board)),
        bar: { ...bar },
        dice: [...dice],
        turn
      };
      setHistory((prev) => [...prev, snapshot]);
      let dieUsed;
      if (selectedPoint === "bar") {
        if (playerColor === PLAYER_HUMAN) dieUsed = 24 - targetIndex;
        else dieUsed = targetIndex + 1;
      } else {
        if (targetIndex === -1) {
          if (playerColor === PLAYER_HUMAN) {
            const exactDie = selectedPoint + 1;
            dieUsed = dice.includes(exactDie) ? exactDie : dice.find((d) => selectedPoint - d < -1) || exactDie;
          } else {
            const exactDie = 24 - selectedPoint;
            dieUsed = dice.includes(exactDie) ? exactDie : dice.find((d) => selectedPoint + d > 23) || exactDie;
          }
        } else {
          dieUsed = Math.abs(selectedPoint - targetIndex);
        }
      }
      const dieIdx = dice.indexOf(dieUsed);
      const nextBoard = [...board];
      const nextBar = { ...bar };
      const nextOff = { ...off };
      if (selectedPoint === "bar") {
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
      if (gameMode === "multi") {
        emitGameEvent("state_update", { board: nextBoard, bar: nextBar, off: nextOff, dice: newDice });
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
  const handleBarClick = () => {
    if (turn !== "human") return;
    const myBarCount = bar[playerColor];
    if (myBarCount > 0) {
      setSelectedPoint("bar");
      const possibleMoves = [];
      [...new Set(dice)].forEach((d) => {
        let target;
        if (playerColor === PLAYER_AI) {
          target = d - 1;
        } else {
          target = 24 - d;
        }
        if (target >= 0 && target <= 23) {
          const dest = board[target];
          const opponent = playerColor === PLAYER_HUMAN ? PLAYER_AI : PLAYER_HUMAN;
          const blocked = dest.player === opponent && dest.count > 1;
          if (!blocked) possibleMoves.push(target);
        }
      });
      setValidMoves(possibleMoves);
      log("Select a valid point to enter.");
    }
  };
  reactExports.useEffect(() => {
    if (gameStatus !== "playing") return;
    const countHuman = board.reduce((acc, p) => p.player === PLAYER_HUMAN ? acc + p.count : acc, 0) + bar[PLAYER_HUMAN];
    const countAI = board.reduce((acc, p) => p.player === PLAYER_AI ? acc + p.count : acc, 0) + bar[PLAYER_AI];
    const myPieces = playerColor === PLAYER_HUMAN ? countHuman : countAI;
    const oppPieces = playerColor === PLAYER_HUMAN ? countAI : countHuman;
    if (myPieces === 0) {
      setGameStatus("gameover");
      setGameResult("win");
      playDiceSound();
      updateStats("win");
      if (gameMode === "multi" && socket) {
        socket.emit("finish_game", { roomId, result: "win" });
      } else if (gameMode === "single" && socket && wallet && !wallet.startsWith("Guest")) {
        socket.emit("update_single_player_stats", { wallet, result: "win" });
      }
      const stake = selectedStakeRef.current;
      if (stake > 0) {
        const confirmWin = stake * 2;
        const fee = confirmWin * 0.02;
        const payout = confirmWin - fee;
        setEscrowBalance((prev) => parseFloat((prev + payout).toFixed(2)));
        log(`Won ${payout.toFixed(3)} SOL! Added to Escrow.`);
      }
    } else if (oppPieces === 0) {
      setGameStatus("gameover");
      setGameResult("loss");
      updateStats("loss");
    }
  }, [board, bar, gameStatus, playerColor]);
  if (gameStatus === "menu") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "landing-page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "landing-visual", style: { transform: "scale(0.9)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "landing-die die-1 face-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "landing-die die-2 face-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dot" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "landing-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#d32f2f", WebkitTextFillColor: "initial", background: "none" }, children: "Play" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", WebkitTextFillColor: "initial", background: "none" }, children: "24" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#e8e0d5", WebkitTextFillColor: "initial", background: "none" }, children: " Backgammon" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "landing-subtitle", children: "Powered by Solana" }),
      wallet && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        opponentDisconnected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          height: "60px",
          background: "red",
          color: "white",
          zIndex: 999999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "1.5rem"
        }, children: "⚠️ OPPONENT DISCONNECTED - AUTO WIN IN 15s ⚠️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wallet-badge-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wallet-badge", style: { cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-start", padding: "12px" }, onClick: () => setIsProfileModalOpen(true), children: wallet.startsWith("Guest") ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold" }, children: "Guest Mode" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [
            userProfile.avatar && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile.avatar, style: { width: "20px", height: "20px", borderRadius: "50%", marginRight: "5px" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold" }, children: userProfile.name || `${wallet.slice(0, 4)}...${wallet.slice(-4)}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", marginLeft: "5px", opacity: 0.7 }, children: "✏️" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", width: "100%", fontSize: "0.8rem", opacity: 0.9, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "6px", gap: "8px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#66bb6a" }, children: [
              userProfile.stats.wins,
              "W"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.5 }, children: "-" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ef5350" }, children: [
              userProfile.stats.losses,
              "L"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.5 }, children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ffd700" }, children: [
              "Lvl ",
              userProfile.stats.level
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.5 }, children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#00e676" }, children: [
              userProfile.stats.xp,
              " XP"
            ] })
          ] })
        ] }) }) })
      ] }),
      isProfileModalOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Edit Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Display Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              id: "input-name",
              defaultValue: userProfile.name,
              placeholder: "Enter your name",
              className: "modal-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: "Avatar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "file",
              id: "input-file",
              accept: "image/*",
              className: "modal-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", onClick: () => setIsProfileModalOpen(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", onClick: () => {
            const name = document.getElementById("input-name").value;
            const fileInput = document.getElementById("input-file");
            if (fileInput.files && fileInput.files[0]) {
              const reader = new FileReader();
              reader.onload = (e) => {
                handleSaveProfile(name, e.target.result);
              };
              reader.readAsDataURL(fileInput.files[0]);
            } else {
              handleSaveProfile(name, userProfile.avatar);
            }
          }, children: "Save" })
        ] })
      ] }) }),
      showGuestPopup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content", style: { textAlign: "center", maxWidth: "400px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "15px" }, children: "🔒" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { marginBottom: "10px" }, children: "Wallet Required" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#bdbdbd", marginBottom: "25px" }, children: "You must connect a real wallet to play Multiplayer!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-primary", style: {
            fontSize: "1.1rem",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: "#4caf50",
            border: "none"
          }, onClick: () => {
            setShowGuestPopup(false);
            connectWallet();
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔗" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Wallet Login" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", onClick: () => setShowGuestPopup(false), children: "Cancel" })
        ] })
      ] }) }),
      !wallet || !wallet.startsWith("Guest") && !isLoggedIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "15px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-primary", style: {
          fontSize: "1.2rem",
          padding: "15px 30px",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          justifyContent: "center",
          minWidth: "250px",
          background: "#4caf50",
          border: "none"
        }, onClick: handleGuestLogin, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.4rem" }, children: "👤" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Guest Mode" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn-primary",
            style: {
              fontSize: "1.2rem",
              padding: "15px 30px",
              background: "#4caf50",
              border: "none",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              justifyContent: "center",
              minWidth: "250px"
            },
            onClick: connectWallet,
            disabled: isLoggingIn,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "1.4rem" }, children: connected && !isLoggedIn ? "✅" : "🔗" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isLoggingIn ? "Verifying..." : connected && !isLoggedIn ? "Verify & Login" : "Wallet Login" })
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "landing-menu", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dropdown-container", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dropdown-header", onClick: () => setIsDropdownOpen(!isDropdownOpen), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon", children: "👤" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Single Player" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isDropdownOpen ? "▲" : "▼" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `dropdown-options ${isDropdownOpen ? "open" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dropdown-item", onClick: () => startGame("beginner"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Easy (Beginner)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "👶" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dropdown-item", onClick: () => startGame("advanced"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Hard (Advanced)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🤖" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-mode", onClick: () => {
          if (wallet && wallet.startsWith("Guest")) {
            setShowGuestPopup(true);
          } else {
            setGameStatus("multiplayer_menu");
          }
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon", children: "👥" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Multiplayer" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", opacity: 0.8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "6px", height: "6px", background: "#4caf50", borderRadius: "50%" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.8rem", color: "#81c784" }, children: onlineCount })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-mode", onClick: () => {
          setGameStatus("leaderboard");
          fetchLeaderboard();
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon", children: "📊" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stats / Leaderboard" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-mode", style: { borderColor: "#d32f2f", background: "rgba(211, 47, 47, 0.1)" }, onClick: () => {
          disconnect().catch(() => {
          });
          setWalletValue(null);
          setLoggedInValue(false);
          setGameStatus("menu");
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "icon", children: "🚪" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ffcdd2" }, children: wallet.startsWith("Guest") ? "Exit Guest" : "Disconnect" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
        ] })
      ] }),
      incomingInvite && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", style: { zIndex: 3e3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content", style: { textAlign: "center", maxWidth: "350px", border: "2px solid #4caf50" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "15px" }, children: "🎲" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { marginBottom: "10px" }, children: "Game Invite!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#bdbdbd", marginBottom: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: "bold" }, children: incomingInvite.fromName }),
          " wants to play a match with you!"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", justifyContent: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", style: { background: "#4caf50", border: "none", flex: 1 }, onClick: () => handleRespondToInvite("accept"), children: "Accept" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", style: { flex: 1 }, onClick: () => handleRespondToInvite("decline"), children: "Decline" })
        ] })
      ] }) })
    ] });
  }
  if (gameStatus === "multiplayer_menu") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "landing-page", children: [
      wallet && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wallet-badge-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wallet-badge", style: { cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px", padding: "12px", alignItems: "flex-start" }, onClick: () => setIsProfileModalOpen(true), children: wallet.startsWith("Guest") ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold" }, children: "Guest Mode" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [
          userProfile.avatar && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile.avatar, style: { width: "20px", height: "20px", borderRadius: "50%", marginRight: "5px" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: "bold" }, children: userProfile.name || `${wallet.slice(0, 4)}...` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", width: "100%", fontSize: "0.8rem", opacity: 0.9, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "6px", gap: "8px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#66bb6a" }, children: [
            userProfile.stats.wins,
            "W"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.5 }, children: "-" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ef5350" }, children: [
            userProfile.stats.losses,
            "L"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.5 }, children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#ffd700" }, children: [
            "Lvl ",
            userProfile.stats.level
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.5 }, children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#00e676" }, children: [
            userProfile.stats.xp,
            " XP"
          ] })
        ] })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(0,0,0,0.4)",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "0.8rem",
        color: "#81c784",
        border: "1px solid rgba(129, 199, 132, 0.2)",
        marginBottom: "10px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pulse-dot", style: { width: "8px", height: "8px", background: "#4caf50", borderRadius: "50%" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: "bold" }, children: [
          onlineCount,
          " Users Online"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "landing-title", children: "Select Mode" }),
      isSearching ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "40px", textAlign: "center", border: "2px solid #4caf50", background: "rgba(0,0,0,0.8)" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "20px" }, children: "🔍" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Searching for opponent..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#aaa" }, children: [
          "Stake: ",
          selectedStake ? selectedStake + " SOL" : "Free Play"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", style: { marginTop: "20px" }, onClick: () => setIsSearching(false), children: "Cancel" })
      ] }) : isLobbyOpen ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: {
        width: "95%",
        maxWidth: "500px",
        background: "rgba(30, 15, 10, 0.98)",
        border: "2px solid #8d6e63",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        minHeight: "400px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #4e342e", paddingBottom: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, color: "#d7ccc8" }, children: "Free Play Tables" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", style: { padding: "2px 8px", fontSize: "0.7rem" }, onClick: () => socket == null ? void 0 : socket.emit("get_lobbies"), children: "🔄 Refresh" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", style: { padding: "5px 10px", fontSize: "0.8rem" }, onClick: () => setIsLobbyOpen(false), children: "Close" })
        ] }),
        isHosting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", padding: "40px 20px", background: "rgba(0,0,0,0.3)", borderRadius: "10px", border: "1px dashed #8d6e63" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-spinner", style: { marginBottom: "20px" }, children: "🎲" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Your Table is Live!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#aaa", fontSize: "0.9rem" }, children: "Waiting for someone to join..." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", style: { marginTop: "20px", background: "#c62828" }, onClick: handleLeaveLobby, children: "Stop Hosting" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", style: { padding: "15px", background: "#4caf50", border: "1px solid #388e3c" }, onClick: handleHostGame, children: "➕ Create New Table" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, overflowY: "auto", maxHeight: "300px", display: "flex", flexDirection: "column", gap: "10px" }, children: activeLobbies.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", color: "#6d4c41", padding: "40px 0" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "10px" }, children: "🕳️" }),
            "No tables open. Host one!"
          ] }) : activeLobbies.map((lobby) => {
            var _a, _b;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
              background: "rgba(255,255,255,0.05)",
              padding: "12px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #4e342e"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                lobby.hostData.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: lobby.hostData.avatar, style: { width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "40px", height: "40px", background: "#3e2723", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }, children: "👤" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", fontSize: "1.2rem", color: "#fff" }, children: lobby.hostData.name }),
                  lobby.hostData.isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    position: "absolute",
                    top: "-2px",
                    right: "-12px",
                    width: "10px",
                    height: "10px",
                    background: "#4caf50",
                    borderRadius: "50%",
                    border: "2px solid #231b15",
                    boxShadow: "0 0 5px #4caf50"
                  } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#aaa" }, children: [
                    "Lvl ",
                    lobby.hostData.level,
                    " | ",
                    (_a = lobby.hostData.stats) == null ? void 0 : _a.wins,
                    "W - ",
                    (_b = lobby.hostData.stats) == null ? void 0 : _b.losses,
                    "L"
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", style: { padding: "8px 20px", fontSize: "0.9rem" }, onClick: () => handleJoinLobby(lobby), children: "Join" })
            ] }, lobby.roomId);
          }) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", width: "100%", maxWidth: "100%" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: {
          textAlign: "center",
          width: "90%",
          maxWidth: "400px",
          cursor: "pointer",
          border: "2px solid #8d6e63",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(62, 39, 35, 0.95)"
        }, onClick: () => handleSearchMatch(null), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "15px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem" }, children: "🎮" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "left" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: "1.2rem" }, children: "Free Play" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: 0, color: "#aaa", fontSize: "0.8rem" }, children: "Practice vs Random" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", style: { fontSize: "0.9rem", padding: "8px 15px", minWidth: "80px", background: "#4caf50", border: "1px solid #388e3c" }, children: "Play" })
        ] }),
        userProfile.stats.level < 5 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: {
          textAlign: "center",
          width: "90%",
          maxWidth: "400px",
          border: "2px solid #555",
          background: "rgba(30, 30, 30, 0.95)",
          padding: "40px 20px",
          boxSizing: "border-box",
          position: "relative",
          opacity: 0.8,
          cursor: "not-allowed",
          minHeight: "260px"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { filter: "blur(3px)", pointerEvents: "none", userSelect: "none" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "15px" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", filter: "grayscale(100%)" }, children: "💰" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, color: "#aaa" }, children: "Ranked / Stake" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }, children: [0.01, 0.02].map((amt) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-secondary", disabled: true, style: { background: "#333", border: "1px solid #555", color: "#777" }, children: [
              amt,
              " SOL"
            ] }, amt)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            textAlign: "center",
            color: "#fff",
            textShadow: "0 2px 4px #000",
            padding: "10px",
            background: "rgba(0,0,0,0.6)",
            borderRadius: "10px"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "5px" }, children: "🔒" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold", fontSize: "1rem", color: "#ff5252", padding: "0 10px 10px" }, children: "Reach Level 5 to Unlock Play with Stake!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#aaa", marginTop: "5px" }, children: [
              "Current: Lvl ",
              userProfile.stats.level
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "btn-secondary",
                style: { marginTop: "10px", fontSize: "0.8rem", padding: "5px 10px", pointerEvents: "auto", cursor: "pointer", background: "rgba(255,255,255,0.1)", border: "1px solid #777" },
                onClick: (e) => {
                  e.stopPropagation();
                  setIsConditionsOpen(true);
                },
                children: "ℹ️ View Conditions"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: {
          textAlign: "center",
          width: "90%",
          maxWidth: "400px",
          border: "2px solid gold",
          background: "rgba(62, 39, 35, 0.95)",
          padding: "20px",
          boxSizing: "border-box"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "15px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem" }, children: "💰" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0 }, children: "Ranked / Stake" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }, children: [0.01, 0.02, 0.03, 0.04].map((amt) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-secondary", style: { background: "#3e2723", border: "1px solid gold", padding: "10px" }, onClick: () => handleSearchMatch(amt), children: [
            amt,
            " SOL"
          ] }, amt)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: "15px", paddingTop: "10px", borderTop: "1px solid #4e342e" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#aaa", fontSize: "0.9rem", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "Escrow: ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "#fff", fontWeight: "bold" }, children: [
                escrowBalance,
                " SOL"
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", justifyContent: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", style: { flex: 1, fontSize: "0.8rem", padding: "8px", background: "#2e7d32" }, onClick: handleEscrowDeposit, children: "+ Deposit" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", style: { flex: 1, fontSize: "0.8rem", padding: "8px", background: "#c62828" }, onClick: handleEscrowWithdraw, children: "- Withdraw" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", style: { marginTop: "5px", background: "#3e2723", width: "90%", maxWidth: "400px", padding: "15px" }, onClick: () => {
          setGameStatus("menu");
          setGameMode("single");
        }, children: "Back to Main Menu" })
      ] }),
      isConditionsOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content", style: { maxWidth: "400px", textAlign: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "10px" }, children: "🏆" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: "0 0 15px" }, children: "Level 5 Requirements" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.05)", borderRadius: "10px", padding: "15px", marginBottom: "20px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "1.1rem" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Target XP:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ffd700", fontWeight: "bold" }, children: "400 XP" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { style: { border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "10px 0" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: "5px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reward per Win:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#66bb6a", fontWeight: "bold" }, children: "+20 XP" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Reward per Loss:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ef5350", fontWeight: "bold" }, children: "+5 XP" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#aaa", fontSize: "0.9rem", marginBottom: "20px" }, children: 'Keep playing "Free Play" matches to earn XP. Even losses help you progress!' }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", onClick: () => setIsConditionsOpen(false), children: "Got it!" })
      ] }) }),
      showGuestPopup && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content", style: { textAlign: "center", maxWidth: "400px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "15px" }, children: "🔒" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { marginBottom: "10px" }, children: "Wallet Required" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#bdbdbd", marginBottom: "25px" }, children: "You must connect a real wallet to play Multiplayer!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn-primary", style: {
            fontSize: "1.1rem",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: "#4caf50",
            border: "none"
          }, onClick: () => {
            setShowGuestPopup(false);
            connectWallet();
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔗" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Wallet Login" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", onClick: () => setShowGuestPopup(false), children: "Cancel" })
        ] })
      ] }) })
    ] });
  }
  if (gameStatus === "leaderboard") {
    const leaderboard = leaderboardData;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "landing-page", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "landing-title", style: { fontSize: "1.8rem", marginBottom: "15px" }, children: "Leaderboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        background: "rgba(44, 36, 27, 0.98)",
        padding: "10px 5px",
        borderRadius: "10px",
        width: "95%",
        maxWidth: "500px",
        maxHeight: "70vh",
        overflowY: "auto",
        marginBottom: "15px",
        border: "1px solid #5d4037"
      }, children: [
        leaderboard.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { color: "#fff", textAlign: "center", padding: "20px" }, children: [
          "No players found yet. Be the first! ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "(Connect your wallet to appear)"
        ] }),
        leaderboardData.map((p, i) => {
          var _a, _b, _c;
          const isMe = p.wallet === wallet;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                padding: "10px 12px",
                borderBottom: "1px solid rgba(141, 110, 99, 0.15)",
                background: i === 0 ? "rgba(255, 215, 0, 0.05)" : "transparent",
                gap: "10px",
                minHeight: "60px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  fontSize: "0.9rem",
                  fontWeight: "800",
                  width: "28px",
                  color: i === 0 ? "#ffd700" : i === 1 ? "#e0e0e0" : i === 2 ? "#cd7f32" : "#6d4c41",
                  textAlign: "center"
                }, children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                  width: "8px",
                  height: "8px",
                  background: p.isOnline ? "#4caf50" : "#444",
                  borderRadius: "50%",
                  boxShadow: p.isOnline ? "0 0 8px rgba(76, 175, 80, 0.8)" : "none",
                  flexShrink: 0
                }, title: p.isOnline ? "Online" : "Offline" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flexShrink: 0 }, children: p.avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.avatar, style: { width: "36px", height: "36px", borderRadius: "50%", border: "1px solid #5d4037", objectFit: "cover" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: "36px", height: "36px", background: "#3e2723", borderRadius: "50%", border: "1px solid #5d4037", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }, children: "👤" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minWidth: 0, overflow: "hidden" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
                    fontWeight: "bold",
                    color: isMe ? "#4caf50" : "#e8e0d5",
                    fontSize: "0.95rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }, children: p.name || "Anonymous" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.75rem", color: "#8d6e63", display: "flex", gap: "8px" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      "Lvl ",
                      ((_a = p.stats) == null ? void 0 : _a.level) || 1
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "rgba(255,255,255,0.3)" }, children: "|" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      ((_b = p.stats) == null ? void 0 : _b.wins) || 0,
                      "W"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      (_c = p.stats) == null ? void 0 : _c.xp,
                      " XP"
                    ] })
                  ] })
                ] }),
                !isMe && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    style: {
                      background: p.isOnline ? "#2e7d32" : "transparent",
                      border: p.isOnline ? "none" : "1px solid #5d4037",
                      color: p.isOnline ? "#fff" : "#5d4037",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      cursor: p.isOnline ? "pointer" : "default",
                      opacity: p.isOnline ? 1 : 0.5,
                      transition: "all 0.2s",
                      whiteSpace: "nowrap"
                    },
                    onClick: () => p.isOnline ? handleInvitePlayer(p.wallet, p.name) : null,
                    disabled: isInviting || !p.isOnline,
                    children: p.isOnline ? "Invite" : "Offline"
                  }
                )
              ]
            },
            i
          );
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", style: { background: "#3e2723", padding: "10px 40px" }, onClick: () => setGameStatus("menu"), children: "Back to Menu" })
    ] });
  }
  const isFlipped = playerColor === PLAYER_AI;
  const getLogIdx = (i) => isFlipped ? 23 - i : i;
  const topTrayPlayer = isFlipped ? PLAYER_HUMAN : PLAYER_AI;
  const bottomTrayPlayer = isFlipped ? PLAYER_AI : PLAYER_HUMAN;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-container", children: [
    opponentDisconnected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      position: "fixed",
      top: "10%",
      left: "50%",
      transform: "translate(-50%, 0)",
      width: "55%",
      padding: "15px",
      background: "#d32f2f",
      color: "#fff",
      zIndex: 2147483647,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "1rem",
      border: "3px solid #fff",
      borderRadius: "12px",
      boxShadow: "0 0 30px rgba(0,0,0,0.6)",
      textAlign: "center"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginBottom: "5px", fontSize: "1.2rem" }, children: "⚠️ Connection Lost" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Waiting for opponent to reconnect... (60s)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "board-wrapper", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `unified-header ${turn === "ai" || turn === "opponent" ? "active-turn" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "logo-mini", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#d32f2f" }, children: "P" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff" }, children: "24" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opponent-info-compact", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opponent-avatar-mini", style: {
              width: "24px",
              height: "24px",
              background: playerColor === PLAYER_HUMAN ? "radial-gradient(circle at 30% 30%, #4a4a4a, #000000)" : "radial-gradient(circle at 30% 30%, #ffffff, #dcdcdc)",
              borderColor: playerColor === PLAYER_HUMAN ? "#000" : "#b0b0b0"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opp-name-text", children: gameMode === "multi" ? opponentName : `AI` })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "header-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "turn-status-compact", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "turn-label", children: turn === "human" ? "YOUR TURN" : "OPPONENT TURN" }),
          turn === "human" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "turn-timer-compact", children: [
            Math.floor(turnTimer / 60),
            ":",
            (turnTimer % 60).toString().padStart(2, "0")
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "header-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "btn-header-action",
            onClick: () => {
              if (gameStatus === "playing" || gameStatus === "opening_roll") {
                if (gameMode === "single") {
                  setShowResignModal(true);
                } else {
                  if (window.confirm("Are you sure you want to resign? You will lose the match.")) {
                    handleForfeit();
                  }
                }
              } else {
                setGameStatus("menu");
                setBoard(initialBoard);
                setGameResult(null);
                setVisualDice([]);
                setDice([]);
                setOpponentDisconnected(false);
              }
            },
            children: gameStatus === "playing" || gameStatus === "opening_roll" ? "🏳️" : "🏠"
          }
        ) })
      ] }),
      gameStatus === "gameover" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-over-overlay", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `game-over-title ${gameResult}`, children: gameResult === "win" ? "YOU WIN!" : "YOU LOST!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "game-over-subtitle", children: gameResult === "win" ? "Great moves! You dominated the board." : "Better luck next time!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "20px", justifyContent: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", onClick: () => {
            setGameStatus("menu");
            setBoard(initialBoard);
            setGameResult(null);
            setOpponentDisconnected(false);
          }, children: "Back to Menu" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", style: { background: "#4caf50", border: "1px solid #81c784" }, onClick: () => {
            setBoard(initialBoard);
            setBar({ 0: 0, 1: 0 });
            setGameResult(null);
            setOpponentDisconnected(false);
            if (gameMode === "multi") {
              setGameStatus("multiplayer_menu");
              handleSearchMatch(selectedStake);
            } else {
              startGame(difficulty);
            }
          }, children: "Play Again" })
        ] })
      ] }),
      gameStatus === "opening_roll" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-over-overlay", style: { background: "rgba(0,0,0,0.92)", zIndex: 900 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "game-over-title", style: { fontSize: "2rem", marginBottom: "10px", color: "#fff" }, children: "Opening Roll" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "game-over-subtitle", style: { marginBottom: "20px" }, children: "Roll to decide who moves first!" }),
        openingRoll || rolling ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", gap: "60px", margin: "30px 0" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#fff", marginBottom: "10px", fontWeight: "bold", fontSize: "1.2rem" }, children: "YOU" }),
            openingRoll && openingRoll.human ? /* @__PURE__ */ jsxRuntimeExports.jsx(Die, { value: openingRoll.human, style: { width: "70px", height: "70px" } }) : rolling ? /* @__PURE__ */ jsxRuntimeExports.jsx(Die, { style: { width: "70px", height: "70px", animation: "spin 1s infinite linear" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Die, { style: { width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #666", background: "transparent", color: "#666", fontSize: "2rem" }, children: "?" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "1.5rem", color: "#aaa", paddingTop: "20px" }, children: "vs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { color: "#d32f2f", marginBottom: "10px", fontWeight: "bold", fontSize: "1.2rem" }, children: gameMode === "multi" ? opponentName : "AI" }),
            openingRoll && openingRoll.ai ? /* @__PURE__ */ jsxRuntimeExports.jsx(Die, { value: openingRoll.ai, isOpponent: true, style: { width: "70px", height: "70px" } }) : rolling ? /* @__PURE__ */ jsxRuntimeExports.jsx(Die, { isOpponent: true, style: { width: "70px", height: "70px", animation: "spin 1s infinite linear" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Die, { isOpponent: true, style: { width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center", border: "2px dashed #d32f2f", background: "transparent", color: "#d32f2f", fontSize: "2rem" }, children: gameMode === "multi" ? "..." : "?" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "80px", display: "flex", alignItems: "center", justifyContent: "center", margin: "30px 0" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "4rem" }, children: "🎲" }) }),
        (!openingRoll || !openingRoll.human) && !rolling && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", style: { fontSize: "1.3rem", padding: "15px 50px", background: "#4caf50", border: "1px solid #388e3c" }, onClick: handleOpeningRoll, children: "ROLL FOR FIRST TURN" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `dice-table-overlay ${rolling ? "rolling" : ""}`, children: [
        turn === "human" && (canRoll || dice.length > 0) && !rolling && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "turn-message", children: "YOUR TURN!" }),
        (visualDice.length > 0 || rolling) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dice-pair", children: rolling ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "die-3d rolling-anim" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "die-3d rolling-anim" })
        ] }) : visualDice.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Die, { value: d, isOpponent: turn === "opponent" || turn === PLAYER_AI }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        OffTray,
        {
          player: topTrayPlayer,
          count: off[topTrayPlayer],
          position: "top",
          valid: topTrayPlayer === playerColor && validMoves.includes(-1),
          onClick: topTrayPlayer === playerColor ? () => handlePointClick(-1) : void 0
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "board-row top", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quadrant", children: [12, 13, 14, 15, 16, 17].map((i) => {
          const logical = getLogIdx(i);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Point, { index: i, data: board[logical], isTop: true, selected: selectedPoint === logical, isValid: validMoves.includes(logical), onClick: () => handlePointClick(logical), playerColor }, i);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bar-center", children: bar[PLAYER_AI] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "checker red",
            onClick: playerColor === PLAYER_AI ? handleBarClick : void 0,
            style: { display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", cursor: playerColor === PLAYER_AI ? "pointer" : "default", color: "#fff", fontSize: "1.2rem", position: "relative", zIndex: 5 },
            children: bar[PLAYER_AI]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quadrant", children: [18, 19, 20, 21, 22, 23].map((i) => {
          const logical = getLogIdx(i);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Point, { index: i, data: board[logical], isTop: true, selected: selectedPoint === logical, isValid: validMoves.includes(logical), onClick: () => handlePointClick(logical), playerColor }, i);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "board-row bottom", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quadrant", children: [11, 10, 9, 8, 7, 6].map((i) => {
          const logical = getLogIdx(i);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Point, { index: i, data: board[logical], isTop: false, selected: selectedPoint === logical, isValid: validMoves.includes(logical), onClick: () => handlePointClick(logical), playerColor }, i);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bar-center", children: bar[PLAYER_HUMAN] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "checker white",
            onClick: playerColor === PLAYER_HUMAN ? handleBarClick : void 0,
            style: { display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", cursor: playerColor === PLAYER_HUMAN ? "pointer" : "default", color: "#000", fontSize: "1.2rem", position: "relative", zIndex: 5 },
            children: bar[PLAYER_HUMAN]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quadrant", children: [5, 4, 3, 2, 1, 0].map((i) => {
          const logical = getLogIdx(i);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(Point, { index: i, data: board[logical], isTop: false, selected: selectedPoint === logical, isValid: validMoves.includes(logical), onClick: () => handlePointClick(logical), playerColor }, i);
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        OffTray,
        {
          player: bottomTrayPlayer,
          count: off[bottomTrayPlayer],
          position: "bottom",
          valid: bottomTrayPlayer === playerColor && validMoves.includes(-1),
          onClick: bottomTrayPlayer === playerColor ? () => handlePointClick(-1) : void 0
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `player-controls-bar ${turn === "human" && (canRoll || dice.length > 0) ? "active-turn" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "player-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "player-avatar", style: {
            background: playerColor === PLAYER_AI ? "radial-gradient(circle at 30% 30%, #4a4a4a, #000000)" : "radial-gradient(circle at 30% 30%, #ffffff, #dcdcdc)",
            // I am White
            borderColor: playerColor === PLAYER_AI ? "#000" : "#b0b0b0"
          }, children: userProfile.avatar && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: userProfile.avatar, style: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "player-name", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: "bold" }, children: wallet ? wallet.startsWith("Guest") ? "Guest" : userProfile.name || `${wallet.slice(0, 4)}...${wallet.slice(-4)}` : "Player 1" }),
            wallet && !wallet.startsWith("Guest") && userProfile.stats && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontSize: "0.8rem", color: "#aaa", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px" }, children: [
              userProfile.name && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "monospace", color: "#8d6e63" }, children: [
                  wallet.slice(0, 4),
                  "...",
                  wallet.slice(-4)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Lvl ",
                userProfile.stats.level
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "•" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                userProfile.stats.wins,
                "W / ",
                userProfile.stats.losses,
                "L"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "controls-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn-action",
              onClick: handleUndo,
              disabled: turn !== "human" || history.length === 0 || finishingTurn || dice.length === 0,
              children: "Undo"
            }
          ),
          validMoves.includes(-1) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn-action",
              style: { backgroundColor: "#ffca28", color: "#000", fontWeight: "bold" },
              onClick: () => handlePointClick(-1),
              children: "BEAR OFF"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn-action",
              onClick: () => isBlocked ? handlePassTurn() : handleManualRoll(),
              disabled: !canRoll && !isBlocked || turn !== "human",
              style: dice.length > 0 && turn === "human" ? { background: isBlocked ? "#d32f2f" : "#2e7d32", color: "#fff", border: isBlocked ? "1px solid #b71c1c" : "1px solid #66bb6a", cursor: "pointer" } : {},
              children: isBlocked ? "Pass Turn (Blocked)" : dice.length > 0 && turn === "human" ? "MOVE" : "Roll Dice"
            }
          )
        ] })
      ] })
    ] }),
    gameStatus === "gameover" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content", style: { textAlign: "center", border: gameResult === "win" ? "2px solid gold" : "2px solid #d32f2f" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "4rem", marginBottom: "20px" }, children: gameResult === "win" ? "🏆" : "💀" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { fontSize: "2.5rem", marginBottom: "10px", color: gameResult === "win" ? "gold" : "#ef9a9a" }, children: gameResult === "win" ? "YOU WON!" : "YOU LOST" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#aaa", marginBottom: "30px" }, children: gameResult === "win" ? "Congratulations! Great game." : "Better luck next time." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", onClick: () => {
        setGameStatus("menu");
        setGameResult(null);
        setDice([]);
        setVisualDice([]);
      }, children: "Back to Menu" })
    ] }) }),
    opponentDisconnected && gameStatus !== "gameover" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", style: { background: "rgba(0,0,0,0.5)", zIndex: 2e3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: {
      position: "absolute",
      top: "25%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      border: "2px solid #ff9800",
      background: "#3e2723",
      padding: "30px",
      textAlign: "center",
      boxShadow: "0 0 50px rgba(255, 152, 0, 0.4)",
      minWidth: "300px"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "15px" }, children: "⚠️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { style: { color: "#ffcc80" }, children: "Opponent Disconnected" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#fff", margin: "15px 0", fontSize: "1.2rem" }, children: "Waiting for opponent to reconnect..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loader", style: { margin: "20px auto", borderColor: "#ffcc80", borderTopColor: "transparent" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.9rem", color: "#ffecb3", marginTop: "15px", fontWeight: "bold" }, children: "Auto-win in 15 seconds." })
    ] }) }),
    showResignModal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", style: { zIndex: 3e3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content", style: { textAlign: "center", border: "1px solid #8d6e63" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "15px" }, children: "🏳️" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { marginBottom: "10px" }, children: "Resign Game?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#bdbdbd", marginBottom: "20px", fontSize: "1rem" }, children: "Are you sure you want to return to the menu?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "8px", marginBottom: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#aaa" }, children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No Loss Recorded" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#aaa" }, children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "No XP Changed" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "15px", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", onClick: () => setShowResignModal(false), style: { flex: 1 }, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", style: { background: "#d32f2f", border: "1px solid #b71c1c", flex: 1 }, onClick: () => {
          setShowResignModal(false);
          handleForfeit();
        }, children: "Confirm" })
      ] })
    ] }) }),
    incomingInvite && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", style: { zIndex: 4e3 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content", style: { textAlign: "center", maxWidth: "350px", border: "2px solid #4caf50" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "3rem", marginBottom: "15px" }, children: "🎲" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { marginBottom: "10px" }, children: "Game Invite!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#bdbdbd", marginBottom: "20px" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#fff", fontWeight: "bold" }, children: incomingInvite.fromName }),
        " wants to play a match with you!"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "10px", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-primary", style: { background: "#4caf50", border: "none", flex: 1 }, onClick: () => handleRespondToInvite("accept"), children: "Accept" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", style: { flex: 1 }, onClick: () => handleRespondToInvite("decline"), children: "Decline" })
      ] })
    ] }) }),
    invitingPlayerName && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", style: { zIndex: 4e3, background: "rgba(0,0,0,0.85)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content", style: { textAlign: "center", maxWidth: "350px", border: "1px solid #8d6e63", background: "#2c241b" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loader", style: { margin: "10px auto 20px auto", width: "40px", height: "40px", border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#ffca28" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { marginBottom: "10px", color: "#fff" }, children: "Invite Sent!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#bdbdbd", marginBottom: "20px" }, children: [
        "Waiting for ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#ffca28", fontWeight: "bold" }, children: invitingPlayerName }),
        " to accept your challenge..."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn-secondary", style: { width: "100%" }, onClick: () => {
        setInvitingPlayerName(null);
        setIsInviting(false);
      }, children: "Cancel" })
    ] }) })
  ] });
}
function Point({ index, data, isTop, selected, isValid, onClick, playerColor }) {
  const checkers = [];
  for (let i = 0; i < data.count; i++) {
    checkers.push(/* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `checker ${data.player === 1 ? "white" : "red"}` }, i));
  }
  const isDark = index % 2 !== 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `point ${isTop ? "down" : "up"} ${isDark ? "dark" : "light"} ${selected ? "selected" : ""} ${isValid ? "valid" : ""}`,
      onClick,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "point-triangle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "checker-stack", children: checkers })
      ]
    }
  );
}
function OffTray({ player, count, position, valid, onClick }) {
  const isHuman = player === PLAYER_HUMAN;
  const pieces = Array.from({ length: count });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `off-tray ${position} ${valid ? "valid" : ""}`,
      onClick: valid ? onClick : void 0,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "off-tray-label", children: "OFF" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "off-pieces-row", children: pieces.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `off-piece ${isHuman ? "white" : "red"}`, style: { zIndex: i } }, i)) }),
        count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "off-counter-text", children: count })
      ]
    }
  );
}
const WalletProvider = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = reactExports.useMemo(() => "https://api.devnet.solana.com", []);
  const wallets = reactExports.useMemo(
    () => [new SolflareWalletAdapter()],
    [network]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectionProvider, { endpoint, children: /* @__PURE__ */ jsxRuntimeExports.jsx(WalletProvider$1, { wallets, autoConnect: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx(WalletModalProvider, { children }) }) });
};
window.onerror = function(message, source, lineno, colno, error) {
  console.error("Global Error:", message);
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `<div style="color:red; padding:20px;">
            <h2>Application Error</h2>
            <p>${message}</p>
            <pre>${(error == null ? void 0 : error.stack) || ""}</pre>
        </div>`;
  }
};
try {
  client.createRoot(document.getElementById("root")).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(WalletProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
  );
} catch (e) {
  console.error("Render failed:", e);
  document.getElementById("root").innerHTML = "<h1>Render Failed: " + e.message + "</h1>";
}
