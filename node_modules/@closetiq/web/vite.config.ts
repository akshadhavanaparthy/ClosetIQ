import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:4000',
    changeOrigin: true,
    secure: false,
  },
  '/healthz': {
    target: 'http://127.0.0.1:4000',
    changeOrigin: true,
    secure: false,
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
});
