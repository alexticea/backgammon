import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react()
    ],
    build: {
        outDir: 'www',
        minify: false, // Human-readable avoids "obfuscated payload" flags
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('react') || id.includes('react-dom')) {
                        return 'rt-core';
                    }
                    if (id.includes('@solana/web3.js')) {
                        return 'sol-w3';
                    }
                    if (id.includes('@solana')) {
                        return 'sol-common';
                    }
                    if (id.includes('tweetnacl') || id.includes('bs58')) {
                        return 'cryp-mod';
                    }
                    if (id.includes('node_modules')) {
                        // Further split node_modules to avoid any single giant file
                        const parts = id.split('node_modules/');
                        const name = parts[parts.length - 1].split('/')[0];
                        if (name.length > 2) return `lib-${name.slice(0, 10)}`;
                        return 'libs-misc';
                    }
                },
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]'
            }
        }
    },
    server: {
        port: 3000
    },
    define: {
        'process.env': {},
        'global': 'window',
    }
})
