import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import './index.css'
import './i18n'
import App from './App.tsx'
import { lightTheme } from './theme/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/gmail-oauth-proxy-server">
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
