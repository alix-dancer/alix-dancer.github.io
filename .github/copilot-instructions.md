# Project Guidelines

## Build And Run
- Use pnpm as the package manager.
- Install dependencies with: pnpm install
- Start local dev server with: pnpm dev
- Build production assets with: pnpm build
- Do not assume test or lint scripts exist; none are currently defined.

## Architecture
- This is a single-page Vite site with index.html as the page shell and source code under src/.
- JS entrypoint is src/assets/js/all.js, which imports:
  - src/assets/sass/main.scss
  - src/assets/js/util.js
  - src/assets/js/main.js
  - src/assets/js/email.js
- Keep static vendor assets in public/vendor and load-order-sensitive libraries in index.html.
- SCSS architecture is organized in src/assets/sass by libs, base, components, and layout.

## Conventions
- Preserve the existing jQuery/IIFE style in src/assets/js/main.js and src/assets/js/util.js unless a task explicitly modernizes that area.
- Keep script loading order in index.html stable (vendor globals before the Vite module script) because main.js depends on browser and breakpoints globals.
- When changing styles, prefer existing Sass variables/functions/mixins from src/assets/sass/libs instead of hardcoding values.
- Follow .editorconfig settings for YAML/JSON files (4 spaces, LF, UTF-8, final newline).

## Deployment And Environment Notes
- Vite base URL is environment-sensitive in vite.config.js and hardcoded to https://www.alix.dance/ for production mode. Update carefully if deployment target changes.
- GitHub Pages workflow deploys dist from .github/workflows/deploy.yml.
- Contact form uses EmailJS in src/assets/js/email.js with public-facing identifiers; do not introduce private secrets into client-side code.

## Existing Documentation
- Keep README.md focused on project overview and credits.
- If adding deeper contributor guidance, create docs/*.md files and link them here instead of embedding long instructions.