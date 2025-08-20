import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'

// 动态检测当前路径，支持多路径访问
const getBasename = () => {
  const pathname = window.location.pathname;
  if (pathname.startsWith('/gmail-oauth-proxy-server')) {
    return '/gmail-oauth-proxy-server';
  }
  return '/';
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={getBasename()}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
// Trigger deployment
