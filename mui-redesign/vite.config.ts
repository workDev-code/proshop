import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'node:path';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // In demo build, inline all assets into a single index.html (file:// friendly)
    ...(mode === 'demo' ? [viteSingleFile()] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: false,
    assetsInlineLimit: mode === 'demo' ? 100_000_000 : 4096,
    rollupOptions: {
      output: {
        manualChunks:
          mode === 'demo'
            ? undefined
            : {
                react: ['react', 'react-dom', 'react-router-dom'],
                mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
                forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
              },
      },
    },
  },
  base: './',
}));
