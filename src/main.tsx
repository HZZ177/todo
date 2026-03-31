import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './App.css'
import './panel/panel.css'
import './ball/ball.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
