
import { Box, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDarkMode);
    }
  }, [prefersDarkMode]);

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const currentTheme = isDarkMode ? darkTheme : lightTheme;

  // 路由配置
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
