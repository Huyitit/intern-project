import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Matches any request starting with /api
      '/api': {
        target: 'https://intern-project-2l2q.onrender.com', // Your backend server address
        changeOrigin: true,             // Changes the origin header to match the target
        secure: false,                  // Set to false if using self-signed SSL certs
      },
    }
  }}
)
