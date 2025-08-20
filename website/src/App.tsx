
import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Documentation from './pages/Documentation/Documentation'
import ParameterEditorPage from './pages/ParameterEditor/ParameterEditorPage'
import Download from './pages/Download/Download'
import './App.css'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
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
  )
}

export default App
