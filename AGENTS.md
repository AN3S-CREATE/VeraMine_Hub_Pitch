# AGENTS.md

## Cursor Cloud specific instructions

### What this is
A single front-end product: a **Veralogix investor pitch deck** built as a React component. The component source is committed as `index.html` even though its contents are **React/JSX** (`export default PitchDeck`), not HTML. Do not assume `index.html` is a static web page.

### Dev environment shape (non-obvious)
- A Vite + React + Tailwind v4 dev harness wraps the component. The startup update script runs `npm install` (guarded so it is a no-op if `package.json` is absent).
- `index.html` is the untouched single source of truth for the component. `vite.config.js` contains a small plugin that reads `index.html`, runs an esbuild JSX transform, and exposes it as the virtual module `virtual:pitchdeck`, which `main.jsx` mounts. Edit the component by editing `index.html`.
- Because the real HTML entry cannot also be named `index.html`, the entry is `app.html`. The Vite dev middleware rewrites `/` and `/index.html` to `/app.html`, so just open the server root.
- Tailwind v4 (`@tailwindcss/vite`) is used; `index.css` has explicit `@source "./index.html"` so utility classes inside the JSX source are detected.

### Commands (defined in `package.json`)
- Run (dev): `npm run dev` then open the printed URL (root redirects to the app). Use `npm run dev -- --host` to expose on the network.
- Build: `npm run build` (outputs to `dist/`).
- Lint: `npm run lint` (flat ESLint config; `no-unused-vars` is a warning so lint passes on the as-committed component).
- Tests: none exist in this repo.

### Notes
- The Veralogix logo is hot-linked from `https://iili.io/KUXIzXV.png`; it needs internet access to display but is purely cosmetic.
- Keyboard navigation (ArrowLeft / ArrowRight) and the on-screen Prev/Next buttons + sidebar dots all change slides; the "Speaker Note" button toggles a presenter popup.
