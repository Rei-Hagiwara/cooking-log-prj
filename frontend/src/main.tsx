import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { Router } from './router';
import { ThemeProvider } from './components/providers/ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="cooking-log-theme">
        <Router />
    </ThemeProvider>
  </StrictMode>,
)
