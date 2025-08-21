import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'

// 动态检测部署环境并设置基础路径
const getBasename = () => {
  const hostname = window.location.hostname;
  
  // GitHub Pages环境
  if (hostname === 'cc11001100.github.io') {
    return '/gmail-oauth-proxy-server';
  }
  
  // 自定义域名环境 - 当前网站部署在子路径下
  if (hostname === 'www.cc11001100.com' || hostname === 'cc11001100.com') {
    // 这个项目总是部署在 /gmail-oauth-proxy-server/ 路径下
    return '/gmail-oauth-proxy-server';
  }
  
  // 开发环境：不需要基础路径
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
