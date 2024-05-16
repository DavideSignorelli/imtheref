import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//scp -r ./dist/* root@85.235.142.225:/var/www/imtheref/
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // with options: http://localhost:5173/api/bar-> http://localhost:3000/bar
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true,
      },
    },
    host: true
  },
  plugins: [react()],
})