import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PointProvider } from './utils/PointContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PointProvider>
    <App />
    </PointProvider>
  </StrictMode>,
)
