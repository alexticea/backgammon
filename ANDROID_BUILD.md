# Backgammon Solana - Android Build Guide

This project has been configured with **Capacitor** to run as a native Android app.

## Prerequisites
- **Android Studio** (Must be installed and set up)
- **Node.js** (Already installed)

## How to Build and Run

1. **Update Code**
   Make your changes to `index.html`, `style.css`, etc.

2. **Build Web Assets**
   This command copies your latest files into the `www` folder used by Capacitor.
   ```powershell
   npm run build:mobile
   ```

3. **Sync to Android**
   This pushes the `www` files into the Android project.
   ```powershell
   npx cap sync
   ```

4. **Open in Android Studio**
   ```powershell
   npx cap open android
   ```
   - Once Android Studio opens, wait for Gradle to sync.
   - Connect your Android device or create an Emulator.
   - Click the green **Run (Play)** button.

## Important Configurations

### Server URL
The app is configured to detect if it's running in Capacitor.
- **On Mobile**: It connects to `https://backgammon-usxq.onrender.com` (Production).
- **On Localhost**: It connects to `http://localhost:3001`.

### Wallet Connection
- **Android**: Uses the Solana Mobile Wallet Adapter (Deep linking to Phantom/Solflare apps).
- **Note**: Ensure you have Phantom or Solflare installed on the Android device/emulator.

## Troubleshooting
- **"Network Error"**: Ensure the Render backend is staying awake (free tier spins down).
- **"White Screen on Launch"**: Check Logcat in Android Studio for "WebView" errors.
