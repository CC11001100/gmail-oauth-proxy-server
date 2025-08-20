import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'

// 动态检测部署环境并设置基础路径
const getBasename = () => {
  const hostname = window.location.hostname;
  
  // 检测部署环境
  const isGitHubPages = hostname === 'cc11001100.github.io';
  const isCustomDomain = hostname === 'www.cc11001100.com' || hostname === 'cc11001100.com';
  
  if (isGitHubPages) {
    // GitHub Pages环境：需要基础路径
    return '/gmail-oauth-proxy-server';
  } else if (isCustomDomain) {
    // 自定义域名环境：不需要基础路径
    return '';
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
