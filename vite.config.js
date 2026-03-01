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
        minify: false, // Keep it readable for scanners
        cssCodeSplit: false,
        rollupOptions: {
            output: {
                // Force a single JS file to avoid "Zip contains many JS files" flags
                manualChunks: undefined,
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
