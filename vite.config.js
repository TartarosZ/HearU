import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://openai-proxy-h5u4.onrender.com',
      '/chat': 'https://openai-proxy-h5u4.onrender.com'
    }
  }
});
