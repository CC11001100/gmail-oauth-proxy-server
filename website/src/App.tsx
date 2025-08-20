
import { Routes, Route } from 'react-router-dom'
import { Box, useMediaQuery } from '@mui/material'
import { useState, useEffect } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Documentation from './pages/Documentation/Documentation'
import ParameterEditorPage from './pages/ParameterEditor/ParameterEditorPage'
import Download from './pages/Download/Download'
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

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/parameter-editor" element={<ParameterEditorPage />} />
            <Route path="/download" element={<Download />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  )
}

export default App
