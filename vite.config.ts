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
          output: {
            manualChunks: {
              react: ['react', 'react-dom', 'react-dom/client'],
              motion: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', '@gsap/react', 'lenis'],
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
