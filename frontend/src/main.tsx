import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

console.log("React is attempting to mount to #root...");
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("CRITICAL: #root element not found!");
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log("React mounted App.");
}
