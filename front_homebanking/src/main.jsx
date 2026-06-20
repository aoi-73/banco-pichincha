import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { HBAuthProvider } from './context/HBAuthContext.jsx'
import { UIProvider } from './context/UIContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HBAuthProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </HBAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
