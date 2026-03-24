import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.scss'
import { MyRouter } from './MyRouter.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MyRouter />
  </StrictMode>,
)
