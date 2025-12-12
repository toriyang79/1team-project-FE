import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'www.artlion.p-e.kr',
      'www.genbox.kro.kr',
      'shorts-artlion.duckdns.org',
      'localhost',
      '.p-e.kr',
      '.kro.kr',
      '.duckdns.org'
    ],
    proxy: {

      '/api': {
        target: 'https://www.artlion.p-e.kr',
        changeOrigin: true,
        secure: false,
        
      },
      '/music-api': {
        target: 'https://www.genbox.kro.kr',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/music-api/, '/api'),
      },
      '/video-api': {
        target: 'https://shorts-artlion.duckdns.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/video-api/, '/api'),
        secure: false,
      },
      '/img-api': {
        target: 'https://www.imagelion.p-e.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-api/, '/api-image/v1'),
        secure: false,
      },
    },
  },
})
