import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import { initInstallPrompt } from './push/installPrompt'

// 설치 안내 이벤트는 페이지가 뜨자마자 오므로 화면보다 먼저 받아 둠
initInstallPrompt()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
