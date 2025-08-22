import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'

// 修复basename逻辑 - 需要在生产环境正确设置basename
const getBasename = () => {
  const hostname = window.location.hostname;
  
  // 开发环境：不需要基础路径
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '';
  }
  
  // 生产环境：需要设置basename来处理路由
  // 注意：这里的basename是给React Router用的，不会与Vite的base冲突
  return '/gmail-oauth-proxy-server';
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={getBasename()}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
