import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // No build de pré-renderização (SSR) as dependências são externas: sem chunks manuais.
    rollupOptions: isSsrBuild
      ? {}
      : {
          // Duas páginas: o site (index.html) e a Área do cliente (entrar.html, sem GSAP nem seções).
          input: {
            main: resolve(__dirname, 'index.html'),
            entrar: resolve(__dirname, 'entrar.html'),
          },
          output: {
            // Por pacote, não por nome de import: com a lista, o auxiliar CommonJS do React caía no
            // chunk de animação, e a Área do cliente (sem GSAP) baixava os 53 KB dele.
            manualChunks(id) {
              if (!id.includes('/node_modules/')) return undefined;
              if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
              if (/\/node_modules\/(gsap|@gsap|lenis)\//.test(id)) return 'motion';
              return undefined;
            },
          },
        },
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
  preview: {
    port: Number(process.env.PORT) || 4173,
  },
}));
