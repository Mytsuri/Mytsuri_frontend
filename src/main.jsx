import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import MobileViewportGate from './components/MobileViewportGate/MobileViewportGate.jsx'
import PwaInstallPrompt from './components/PwaInstallPrompt'
import './index.css'
import './styles/layout.css'

if (import.meta.env.PROD) {
  registerSW({ immediate: true })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <BrowserRouter>
        <MobileViewportGate>
          <App />
          <PwaInstallPrompt />
        </MobileViewportGate>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
