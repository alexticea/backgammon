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
        outDir: 'www' // Capacitor expects 'www'
    },
    server: {
        port: 3000
    },
    define: {
        'process.env': {} // Some deps expect this
    }
})
