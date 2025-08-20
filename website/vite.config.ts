import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/gmail-oauth-proxy-server/',
  // 指定入口文件
  root: '.',
  // 端口配置 - 严禁修改端口，必须使用57622端口
  server: {
    port: 57622,
    strictPort: true, // 如果端口被占用则报错而不是尝试其他端口
    // 添加路径兼容性支持
    fs: {
      allow: ['..']
    },
    // 添加代理配置，支持多路径访问
    proxy: {
      // 支持根路径访问
      '^/$': {
        target: 'http://localhost:57622/gmail-oauth-proxy-server/',
        changeOrigin: true,
        rewrite: (path) => '/gmail-oauth-proxy-server/'
      },
      // 支持其他路径访问
      '^/(?!gmail-oauth-proxy-server)': {
        target: 'http://localhost:57622/gmail-oauth-proxy-server',
        changeOrigin: true,
        rewrite: (path) => `/gmail-oauth-proxy-server${path}`
      }
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 添加路径重写规则
    rollupOptions: {
      input: 'index.html',
      output: {
        // 确保资源路径正确
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return `assets/css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    }
  },
  // 添加路径重写规则，支持多路径访问
  define: {
    __BASE_PATH__: JSON.stringify('/gmail-oauth-proxy-server/'),
    __ROOT_PATH__: JSON.stringify('/'),
    __IS_DEV__: JSON.stringify(true) // 开发环境下始终为true
  },
  // 添加路径别名
  resolve: {
    alias: {
      '@': './src',
      '@components': './src/components',
      '@pages': './src/pages',
      '@utils': './src/utils',
      '@services': './src/services'
    }
  }
})
