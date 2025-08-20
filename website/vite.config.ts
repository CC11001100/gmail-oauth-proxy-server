import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'
  
  // 支持环境变量配置base路径
  // 可以通过环境变量 VITE_BASE_PATH 来设置
  // 如果没有设置，则根据部署环境自动判断
  const basePath = process.env.VITE_BASE_PATH || (isDev ? '/' : '/gmail-oauth-proxy-server/')
  
  return {
    plugins: [react()],
    base: basePath,
    build: {
      outDir: 'dist'
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    // 定义环境变量
    define: {
      __BASE_PATH__: JSON.stringify(basePath),
      __IS_DEV__: JSON.stringify(isDev),
    }
  }
})
