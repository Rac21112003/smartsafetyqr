// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // ← change from 5173 to 3000
    headers: {
      'Cache-Control': 'no-store'  // ← force no caching
    }
  }
})