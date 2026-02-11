# Migration to Vite + React + Solana Wallet Adapter

The Backgammon application has been successfully migrated from a monolithic HTML file to a modern Vite + React architecture.

## Changes Made

1.  **Project Structure**:
    *   `index.html`: Now serves as the entry point for the React application.
    *   `src/main.jsx`: Bootstraps the React app and Wallet Providers.
    *   `src/App.jsx`: Contains the refactored game logic (formerly `index.backup.html`).
    *   `src/WalletProvider.jsx`: Configures Solana wallet adapters (Phantom, Solflare, Mobile Wallet Adapter).

2.  **Wallet Integration**:
    *   Removed legacy `window.solflare` and `window.solana` direct usage.
    *   Implemented `@solana/wallet-adapter-react` hooks (`useWallet`, `useConnection`) for robust wallet management.
    *   Added `SolanaMobileWalletAdapter` to support native Android intents (MWA) for Solflare and Phantom mobile apps.

3.  **Build System**:
    *   Configured `vite.config.js` to handle Node.js polyfills (required by `@solana/web3.js`).
    *   Updated `package.json` scripts:
        *   `dev`: Runs local development server (`vite`).
        *   `build`: Builds the production bundle (`vite build`).
        *   `build:mobile`: Builds and syncs with Capacitor (`vite build && npx cap sync`).

## How to Run

### Development
1.  Run `npm install` (if not already done).
2.  Run `npm run dev` to start the local server.

### Mobile Build (Android)
1.  Run `npm run build:mobile`.
2.  Open Android Studio with `npx cap open android`.
3.  Build and Run on your device/emulator.

## Notes

*   **Deep Linking**: The inclusion of `SolanaMobileWalletAdapter` ensures that deep links (solana-pay intents) work natively on Android without custom implementation.
*   **Polyfills**: `src/polyfills.js` and `vite-plugin-node-polyfills` are used to provide Buffer and other Node globals required by Solana libraries in the browser environment.
*   **Wallet Adapters**: We use specific adapters (`@solana/wallet-adapter-phantom`, etc.) instead of the monolithic `wallet-adapter-wallets` package to avoid dependency conflicts and reduce bundle size.

## Troubleshooting

### Black Screen / "Buffer is not defined"
If you encounter a black screen or "Buffer is not defined" error:
1.  Ensure `import './polyfills';` is the **first line** in `src/main.jsx`.
2.  Check `vite.config.js` to ensure `nodePolyfills` is correctly configured with `globals: { Buffer: true }`.

### Mobile Wallet Issues
If the "Connect Wallet" button doesn't trigger the mobile wallet app:
1.  Verify `SolanaMobileWalletAdapter` is included in `src/WalletProvider.jsx`.
2.  Ensure you have built the latest version (`npm run build:mobile`) and synced with Capacitor.
