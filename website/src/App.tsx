
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
    const hostname = window.location.hostname;
    const currentPath = location.pathname;
    
    // 检测部署环境
    const isGitHubPages = hostname === 'cc11001100.github.io';
    const isCustomDomain = hostname === 'www.cc11001100.com' || hostname === 'cc11001100.com';
    
    if (isGitHubPages) {
      // GitHub Pages环境：需要基础路径
      const basePath = '/gmail-oauth-proxy-server';
      
      if (currentPath === '/') {
        navigate(`${basePath}/`, { replace: true });
        return;
      }
      
      if (!currentPath.startsWith(basePath)) {
        const targetPath = `${basePath}${currentPath}`;
        navigate(targetPath, { replace: true });
        return;
      }
    } else if (isCustomDomain) {
      // 自定义域名环境：不需要基础路径，但需要处理根路径
      if (currentPath === '/') {
        // 在自定义域名下，根路径就是首页，不需要重定向
        return;
      }
      
      // 在自定义域名环境下，不要去掉 /gmail-oauth-proxy-server 前缀
      // 因为这是用户实际访问的路径，应该保持
      // 只有在 GitHub Pages 环境下才需要处理这个前缀
    }
    // 开发环境：不需要特殊处理
  }, [location.pathname, navigate]);

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  // 路由配置 - 使用相对路径，让basename自动处理
  const routes = [
    { path: '/', element: <Home /> },
    { path: '/documentation', element: <Documentation /> },
    { path: '/parameter-editor', element: <ParameterEditorPage /> },
    { path: '/download', element: <Download /> }
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
