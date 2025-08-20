import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'

// 简化基础路径检测，避免复杂的动态逻辑
const getBasename = () => {
  // 检查是否为生产环境（GitHub Pages）
  const isProduction = window.location.hostname === 'cc11001100.github.io';
  
  if (isProduction) {
    // 生产环境下始终使用基础路径
    return '/gmail-oauth-proxy-server';
  }
  
  // 开发环境下使用空字符串
  return '';
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={getBasename()}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
// Trigger deployment
