import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve'
  
  // 支持环境变量配置base路径
  const basePath = process.env.VITE_BASE_PATH || (isDev ? '/' : '/gmail-oauth-proxy-server/')
  
  return {
    plugins: [react()],
    base: basePath,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
