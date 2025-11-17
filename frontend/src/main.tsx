import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './lib/theme-provider'
import { LanguageProvider } from './lib/language-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider defaultLanguage="en" storageKey="portfolio-language">
      <ThemeProvider defaultTheme="system" storageKey="portfolio-theme">
        <App />
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>,
)
