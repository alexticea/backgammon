# Deploying Backgammon to Solana Devnet

## Prerequisites
To compile and deploy Solana Smart Contracts, you need the following tools installed. On Windows, it is **highly recommended** to use [WSL (Windows Subsystem for Linux)](https://learn.microsoft.com/en-us/windows/wsl/install) (Ubuntu), as Solana tools are native to Linux.

### 1. Install Rust
Run this in your terminal (WSL/Linux):
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. Install Solana CLI
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"
```
restart your terminal, then verify:
```bash
solana --version
```

### 3. Install Anchor (Framework)
```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

---

## Deployment Steps

### 1. Setup Wallet
Create a new file system wallet for deployment:
```bash
solana-keygen new -o id.json
solana config set --keypair ./id.json
solana config set --url devnet
```
Airdrop yourself some Devnet SOL (you need this to pay for deployment):
```bash
solana airdrop 2
```

### 2. Build the Program
Navigate to the program folder:
```bash
cd backgammon-program
anchor build
```

**IMPORTANT:**
After the first build, a new Keypair is generated in `target/deploy/backgammon-keypair.json`.
1. Run `solana address -k target/deploy/backgammon-keypair.json` to get your **Program ID**.
2. Open `programs/backgammon/src/lib.rs` and replace `declare_id!("...")` with this new ID.
3. Open `Anchor.toml` and update `backgammon = "..."` with this new ID.
4. Run `anchor build` again to lock it in.

### 3. Deploy
```bash
anchor deploy --provider.cluster devnet
```

### 4. Get the IDL
The IDL (Interface Description Language) describes how your frontend talks to the contract.
It is located at `target/idl/backgammon.json`.
You will need the content of this file to update the frontend.

---

## Updating the Frontend (`index.html`)

Once deployed, provide me (the AI) with:
1. The **Program ID**.
2. The contents of **backgammon.json**.

I will then update your `index.html` to stop using the "Mock Server" and start using your real "Smart Contract"!
