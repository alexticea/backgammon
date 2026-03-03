import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        react()
    ],
    build: {
        outDir: 'www',
        minify: false, // Totally readable code to satisfy scanners
        cssCodeSplit: true,
        rollupOptions: {
            output: {
                // FORCE A SINGLE FILE for the entire logic
                inlineDynamicImports: true,
                entryFileNames: 'assets/app_logic_signed_release.js',
                chunkFileNames: 'assets/app_logic_signed_release.js',
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
