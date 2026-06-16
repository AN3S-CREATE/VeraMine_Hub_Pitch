import { defineConfig } from 'vite';
import { transformSync } from 'esbuild';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// The committed app source lives in `index.html`, but its contents are actually
// a React/JSX module (`export default PitchDeck`). This plugin loads that file
// as a JSX module so the dev environment can render it without modifying the
// original file. It is the single source of truth for the PitchDeck component.
const PITCHDECK_ID = 'virtual:pitchdeck';
const RESOLVED_PITCHDECK_ID = '\0' + PITCHDECK_ID;
const sourcePath = path.resolve(import.meta.dirname, 'index.html');

function pitchdeckSource() {
  return {
    name: 'pitchdeck-source',
    enforce: 'pre',
    resolveId(id) {
      if (id === PITCHDECK_ID) return RESOLVED_PITCHDECK_ID;
    },
    load(id) {
      if (id === RESOLVED_PITCHDECK_ID) {
        const code = fs.readFileSync(sourcePath, 'utf-8');
        const result = transformSync(code, {
          loader: 'jsx',
          jsx: 'automatic',
          sourcefile: 'index.html',
        });
        return result.code;
      }
    },
    configureServer(server) {
      server.watcher.add(sourcePath);
      // The repo's index.html is JSX, so serve the real HTML entry at `/`.
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/' || req.url === '/index.html') {
          req.url = '/app.html';
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [pitchdeckSource(), react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: 'app.html',
    },
  },
});
