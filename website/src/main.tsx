import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'

// 简化basename逻辑 - 只在开发环境需要设置
const getBasename = () => {
  const hostname = window.location.hostname;
  
  // 开发环境：不需要基础路径
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return '';
  }
  
  // 生产环境：由于Vite的base配置已经处理了静态资源路径，
  // 这里不需要再设置basename，避免双重路径
  return '';
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={getBasename()}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
