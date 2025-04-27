import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // API 路径代理
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // 静态资源路径代理
      '/static': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
