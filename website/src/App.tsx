
import { Box, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Documentation from './pages/Documentation/Documentation'
import ParameterEditorPage from './pages/ParameterEditor/ParameterEditorPage'
import Download from './pages/Download/Download'
import NotFound from './pages/NotFound/NotFound'
import PathCompatibility from './components/PathCompatibility/PathCompatibility'
import SmartRouter from './components/SmartRouter/SmartRouter'
import { lightTheme, darkTheme } from './theme/theme'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import './App.css'

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDarkMode);
    }
  }, [prefersDarkMode]);

  // 动态检测部署环境并处理路径重定向
  useEffect(() => {
    // 检查当前路径
    const currentPath = location.pathname;
    
    // 检查是否在自定义域名环境
    const isCustomDomain = window.location.hostname === 'www.cc11001100.com';
    
    if (isCustomDomain) {
      // 自定义域名环境：不需要重定向，直接显示内容
      // 用户访问任何路径都应该正常显示对应的页面内容
    } else {
      // GitHub Pages环境：需要处理 /gmail-oauth-proxy-server 前缀
      const basePath = '/gmail-oauth-proxy-server';
      
      if (!currentPath.startsWith(basePath)) {
        // 用户访问了不带前缀的路径，重定向到带前缀的路径
        navigate(`${basePath}${currentPath}`, { replace: true });
        return;
      }
    }
  }, [location.pathname, navigate]);

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  // 路由配置 - 支持多种路径格式
  const routes = [
    { path: '/', element: <Home /> },
    { path: '/documentation', element: <Documentation /> },
    { path: '/parameter-editor', element: <ParameterEditorPage /> },
    { path: '/download', element: <Download /> },
    // 为自定义域名添加带前缀的路径支持
    { path: '/gmail-oauth-proxy-server', element: <Home /> },
    { path: '/gmail-oauth-proxy-server/', element: <Home /> },
    { path: '/gmail-oauth-proxy-server/documentation', element: <Documentation /> },
    { path: '/gmail-oauth-proxy-server/parameter-editor', element: <ParameterEditorPage /> },
    { path: '/gmail-oauth-proxy-server/download', element: <Download /> }
  ];

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <PathCompatibility>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <SmartRouter routes={routes} fallback={<NotFound />} />
          </Box>
          <Footer />
        </Box>
      </PathCompatibility>
    </ThemeProvider>
  )
}

export default App
