import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
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
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client'],
          radix: ['radix-ui'],
          motion: ['gsap', 'gsap/ScrollTrigger', 'gsap/SplitText', '@gsap/react', 'lenis'],
        },
      },
    },
  },
  server: {
    port: Number(process.env.PORT) || 3000,
  },
});
