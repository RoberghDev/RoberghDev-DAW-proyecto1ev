import { resolve } from 'node:path';
import { globSync } from 'node:fs';
import { defineConfig } from 'vite';

const pages = Object.fromEntries(
  globSync('*.html').map((file) => [file.slice(0, -5), resolve(import.meta.dirname, file)])
);

export default defineConfig({
  build: {
    rollupOptions: {
      input: pages
    }
  }
});
