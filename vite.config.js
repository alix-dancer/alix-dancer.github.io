import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
    base:
        mode === 'production'
            ? 'https://www.alix.dance/'
            : '/',
    css: {
        preprocessorOptions: {
            scss: {
                // Silence deprecation warnings from the legacy HTML5 UP Sass lib
                // architecture. The @import → @use/@forward and global-builtin
                // migrations would require extensive refactoring of vendor code.
                silenceDeprecations: ['import', 'global-builtin'],
            },
        },
    },
}));
