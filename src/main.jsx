console.log("EZHSK Framework: Bootstrapping...");
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error("Could not find root element with id 'root'");
  console.log("Root element found, rendering React...");
  
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (err) {
  console.error("Fatal Application Error:", err);
  document.body.innerHTML = `
    <div style="padding: 24px; font-family: sans-serif; color: #ef4444; background: #fee2e2; margin: 20px; border-radius: 8px; border: 1px solid #fecaca;">
      <h1 style="margin-top: 0; font-size: 20px;">Lỗi ứng dụng (Application Error)</h1>
      <p style="font-size: 14px; color: #991b1b;">Vui lòng chụp ảnh màn hình này và gửi lại để được hỗ trợ.</p>
      <pre style="background: white; padding: 12px; border-radius: 4px; overflow: auto; border: 1px solid #fca5a5; font-size: 12px;">${err.stack || err.message || err}</pre>
    </div>
  `;
}
