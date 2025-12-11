import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {

      '/api': {
        target: 'https://www.artlion.p-e.kr',
        changeOrigin: true,
        secure: false,
      },
      '/music-api': {
        target: 'https://www.genbox.kro.kr',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/music-api/, '/api'),
      },
      '/video-api': {
        target: 'https://shorts-artlion.duckdns.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/video-api/, '/api'),
        secure: false,
      },
      '/img-api': {
        target: 'http://13.125.57.129:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/img-api/, '/api/v1'),
        secure: false,
      },
    },
  },
})
