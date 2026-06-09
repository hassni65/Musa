import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/static',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/upload': 'http://localhost:8000',
      '/generate-plan': 'http://localhost:8000',
      '/health': 'http://localhost:8000',
    }
  }
})
