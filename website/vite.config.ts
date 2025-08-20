import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'
  
  // 支持环境变量配置base路径
  // 可以通过环境变量 VITE_BASE_PATH 来设置
  // 如果没有设置，则根据部署环境自动判断
  const basePath = process.env.VITE_BASE_PATH || (isDev ? '/' : '/gmail-oauth-proxy-server/')
  
  console.log(`🚀 Vite 配置 - 环境: ${isDev ? '开发' : '生产'}, Base路径: ${basePath}`)
  
  return {
    plugins: [react()],
    base: basePath,
    build: {
      outDir: 'dist',
      // 确保资源文件名包含hash，避免缓存问题
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        }
      }
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
