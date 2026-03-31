import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './panel/panel.css'
import { PanelApp } from './panel/PanelApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PanelApp />
  </StrictMode>,
)
