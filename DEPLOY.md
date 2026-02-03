# Deploying to Vercel

## ⚠️ Prerequisites
You need **Node.js** to use the Vercel command line tool.
1.  **Download Node.js**: Go to [nodejs.org](https://nodejs.org) and install the "LTS" version.
2.  **Restart Terminal**: After installing, close and reopen your terminal to apply changes.
3.  **Verify**: Run `node -v` to check if it's installed.

This project is a static web application (`index.html` + `style.css`). You can easily deploy it to Vercel for free.

## Option 1: Using Vercel CLI (Recommended)

1.  Open your terminal in this directory:
    ```bash
    cd c:\Users\Alex\Desktop\table\backgammon-solana
    ```

2.  Run the deployment command:
    ```bash
    npx vercel
    ```

3.  Follow the interactive prompts:
    -   **Set up and deploy?** [Y/n] -> Enter **Y**
    -   **Which scope?** -> Select your account.
    -   **Link to existing project?** [y/N] -> Enter **N**
    -   **Project Name?** -> Press Enter (default `backgammon-solana`).
    -   **In which directory is your code located?** -> Press Enter (default `./`).
    -   **Want to modify these settings?** [y/N] -> Enter **N**.

4.  Wait for the deployment to finish. It will give you a **Production** URL (e.g., `https://backgammon-solana.vercel.app`).

## Option 2: Using Vercel Dashboard (GitHub)

1.  Push this code to a GitHub repository.
2.  Log in to [Vercel](https://vercel.com).
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your GitHub repository.
5.  Vercel will detect it as a static site. Click **Deploy**.

## Configuration

A `vercel.json` file has been added to ensure Vercel handles the static serving correctly.
