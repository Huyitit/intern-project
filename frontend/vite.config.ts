import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Matches any request starting with /api
      '/api': {
        target: 'http://localhost:3006', // Your backend server address
        changeOrigin: true,             // Changes the origin header to match the target
        secure: false,                  // Set to false if using self-signed SSL certs
      },
    }
  }}
)
