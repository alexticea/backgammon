# How to Deploy Your Game Server

To play online on your phones, you need a **Game Server** running on the public internet. Vercel only hosts the game website (Frontend), not the server logic.

### 1. Deploy the Server (Free)
We will use **Render.com** (it's free and easy).

1.  **Push your code to GitHub** (if you haven't already).
2.  Go to [dashboard.render.com](https://dashboard.render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Root Directory**: `server`  <-- IMPORTANT
    *   **Build Command**: `npm install`
    *   **Start Command**: `node index.js`
6.  Click **Create Web Service**.
7.  Wait for it to deploy. Render will give you a unique URL (e.g., `https://backgammon-server.onrender.com`).

### 2. Connect Your Game
1.  Open `index.html` on your computer.
2.  Find line **85**:
    ```javascript
    const SERVER_URL = isLocal ? 'http://localhost:3001' : 'https://YOUR-RENDER-URL.onrender.com';
    ```
3.  Replace the second link with **your new Render URL**.
4.  Save and **push to GitHub**.

### 3. Play!
Now, when you open your Vercel website on your phones, they will connect to your Render server and match you up!
