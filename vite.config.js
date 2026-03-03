import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            globals: {
                Buffer: true,
                global: true,
                process: true,
            },
        })
    ],
    build: {
        outDir: 'www',
        minify: false, // Human-readable JS avoids "packed payload" heuristic flags
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('react') || id.includes('react-dom')) {
                        return 'react-core';
                    }
                    if (id.includes('@solana') || id.includes('tweetnacl') || id.includes('bs58')) {
                        return 'solana-web3';
                    }
                    if (id.includes('node_modules')) {
                        return 'vendor-libs';
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
        'process.env': {} // Some deps expect this
    }
})
