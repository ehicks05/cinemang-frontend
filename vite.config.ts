import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const path = require('path');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
