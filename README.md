# Solana Backgammon

A single-player and local PvP Backgammon game built on Solana.

## Features
- **Wallet Connection**: Login with Phantom or Solflare.
- **Escrow Simulation**: Bet SOL on the match (Devnet).
- **Game Logic**: Simplified Backgammon rules (Movement, Hitting).
- **Premium UI**: Dark mode glassmorphism design.

## How to Run
Since you do not have Node.js installed, this application has been bundled into a single file for convenience.

1. **Open `index.html`** directly in your web browser (Chrome, Edge, Firefox).
2. Ensure you have the **Phantom Wallet** browser extension installed.
3. Switch Phantom to **Devnet** (Settings > Developer Settings > Change Network > Devnet) to simulate betting without real money.

## Project Structure
- `index.html`: Contains all the game logic, UI components, and wallet integration.
- `style.css`: Contains the styling for the application.
- `src/`: (Optional) Source files for reference, but `index.html` is the executable entry point.

## Gameplay
1. Click **Connect Wallet**.
2. Click **Start Game (Bet)** to simulate an escrow deposit.
3. **Roll Dice** and click checkers to move.
4. White moves from Top Right to Bottom Right (counter-clockwise). Red moves opposite.

## Note on Architecture
This app uses a "Serverless" frontend approach compatible with direct file opening. In a production environment, this would be built with Next.js and Anchor (Rust) smart contracts.
