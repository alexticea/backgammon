import './polyfills';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { WalletProvider } from './WalletProvider.jsx'

// Global Buffer fix handled in ./polyfills.js

// Basic error boundary
window.onerror = function (message, source, lineno, colno, error) {
    console.error("Global Error:", message);
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = `<div style="color:red; padding:20px;">
            <h2>Application Error</h2>
            <p>${message}</p>
            <pre>${error?.stack || ''}</pre>
        </div>`;
    }
};

try {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <WalletProvider>
                <App />
            </WalletProvider>
        </React.StrictMode>,
    )
} catch (e) {
    console.error("Render failed:", e);
    document.getElementById('root').innerHTML = "<h1>Render Failed: " + e.message + "</h1>";
}
