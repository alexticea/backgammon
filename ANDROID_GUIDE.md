# Porting Backgammon Solana to Android

To turn your existing web application into a native Android app, the most efficient path is using **Capacitor**. This allows you to package your current React/HTML/CSS code into an Android APK without rewriting the game logic.

## Prerequisites
1.  **Android Studio**: You must download and install Android Studio on your computer to compile the app.
2.  **Java/JDK**: Required for Android builds.

## Strategy: Capacitor
Capacitor acts as a bridge, running your web app inside a native "WebView" while giving you access to native phone features.

### Step-by-Step Implementation

1.  **Install Capacitor**
    ```bash
    npm install @capacitor/core @capacitor/cli @capacitor/android
    npx cap init BackgammonSolana com.backgammon.solana
    ```

2.  **Build Your Web Project**
    Ensure your project has a build command (e.g., `npm run build`) that outputs to a `dist` or `build` folder.
    *If you are using a single `index.html`, you might need to structure it slightly to ensure assets are loaded via relative paths.*

3.  **Add Android Platform**
    ```bash
    npx cap add android
    ```

4.  **Sync and Open**
    ```bash
    npx cap sync
    npx cap open android
    ```
    This opens Android Studio, where you can hit "Run" to test on a simulator or real device.

## Critical Considerations for Web3 / Solana

### Mobile Wallet Adapter (MWA)
The biggest difference on mobile is **Wallet Connection**.
-   **PC**: Users use Browser Extensions (Phantom, Solflare).
-   **Android**: Extensions do not work in the WebView. You must use **Solana Mobile Wallet Adapter (MWA)**.
    -   This allows your app to "app-switch" to the Phantom/Solflare Android app to sign transactions, then switch back.
    -   You will need to ensure your `@solana/wallet-adapter-react` setup includes the `SolanaMobileWalletAdapter`.

### Deep Linking
Ensure your app correctly handles deep links if the wallet app needs to redirect back to your game after signing.

## Next Steps
1.  Would you like me to **install and configure Capacitor** for this project now?
2.  We would need to verify your `build` process (where does your compiled code go?).
