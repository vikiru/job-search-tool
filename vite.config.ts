import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import babel from '@rolldown/plugin-babel';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      importProtection: {
        client: {
          specifiers: ['drizzle-orm', 'drizzle-orm/**', 'pg', '@google/genai', 'pdf-parse'],
          files: ['**/server/db/**'],
        },
      },
    }),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
});
