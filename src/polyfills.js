import { Buffer } from 'buffer';

// Explicitly polyfill for browser compatibility
if (typeof window !== 'undefined') {
    if (!window.global) {
        window.global = window;
    }

    if (!window.Buffer) {
        window.Buffer = Buffer;
    }

    if (!window.process) {
        window.process = { env: {} };
    }
}
