import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/gmail-oauth-proxy-server/',
  // 端口配置 - 严禁修改端口，必须使用57622端口
  server: {
    port: 57622,
    strictPort: true, // 如果端口被占用则报错而不是尝试其他端口
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
