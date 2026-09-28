import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forwards /api requests to the Express server so the frontend doesn't hardcode its URL
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
