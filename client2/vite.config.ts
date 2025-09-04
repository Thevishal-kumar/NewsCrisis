// In client2/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be proxied
      '/api': {
        target: 'http://localhost:8000', // Your Express server
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Can be false if your backend is not HTTPS
      },
    },
  },
});
