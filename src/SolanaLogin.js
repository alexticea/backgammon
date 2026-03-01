import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { PublicKey } from '@solana/web3.js';

let sessionState = null;

const loadSession = () => {
    try {
        const saved = localStorage.getItem('dapp_session_secret');
        if (saved) {
            const secretKey = bs58.decode(saved);
            const keyPair = nacl.box.keyPair.fromSecretKey(secretKey);
            sessionState = { dappKeyPair: keyPair };
            return sessionState;
        }
    } catch (e) { }
    return null;
}

export const initSession = () => {
    const keyPair = nacl.box.keyPair();
    sessionState = { dappKeyPair: keyPair };
    localStorage.setItem('dapp_session_secret', bs58.encode(keyPair.secretKey));
    return sessionState;
};

const encryptPayload = (payload, sharedSecret) => {
    const nonce = nacl.randomBytes(24);
    const payloadJson = JSON.stringify(payload);
    const payloadBytes = new TextEncoder().encode(payloadJson);
    const encrypted = nacl.box.after(payloadBytes, nonce, sharedSecret);
    return [nonce, encrypted];
};

const decryptPayload = (data, nonce, sharedSecret) => {
    const dataBytes = bs58.decode(data);
    const nonceBytes = bs58.decode(nonce);
    const decrypted = nacl.box.open.after(dataBytes, nonceBytes, sharedSecret);
    if (!decrypted) throw new Error('Decryption failed');
    return JSON.parse(new TextDecoder().decode(decrypted));
};

export const buildConnectUrl = () => {
    if (!sessionState) initSession();
    const { dappKeyPair } = sessionState;

    const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
        cluster: 'mainnet-beta',
        app_url: 'https://backgammon-beige.vercel.app',
        redirect_link: 'backgammon://connect',
    });

    // Using solflare:// forces Android to handle it externally instead of webview
    return `solflare://ul/v1/connect?${params.toString()}`;
};

export const handleConnectCallback = (urlStr) => {
    if (!sessionState) loadSession();
    if (!sessionState) {
        throw new Error("No session state found.");
    }

    try {
        // Remove hash fragments
        let qs = urlStr.includes('?') ? urlStr.split('?')[1].split('#')[0] : null;
        if (!qs) throw new Error(`Invalid URL format: no query params in ${urlStr}`);
        const searchParams = new URLSearchParams(qs);
        const queryParams = Object.fromEntries(searchParams.entries());

        if (!queryParams) throw new Error("No queryParams parsed");

        if (queryParams.errorCode) {
            throw new Error(`Solflare Error: ${queryParams.errorMessage}`);
        }

        // Clean out whitespace or weird URL artifacts
        const phantomPublicKeyStr = (queryParams.phantom_encryption_public_key || queryParams.solflare_encryption_public_key)?.trim() || "";
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
