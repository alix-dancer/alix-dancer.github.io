import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
    base:
        mode === 'production'
            ? 'https://www.alix.dance/'
            : '/',
}));
