import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './ball/ball.css'
import { BallApp } from './ball/BallApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BallApp />
  </StrictMode>,
)
