import { createRoot } from "react-dom/client";
import App from "./App";
import "./global.css";
import "./index.css";

const showError = (error: any) => {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `<div style="margin: 1rem; padding: 1rem; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: .25rem;">
      <h1 style="font-size: 1.5rem; margin-bottom: .5rem;">Application Error</h1>
      <p>An unexpected error occurred. This is the error message:</p>
      <pre style="white-space: pre-wrap; word-wrap: break-word; background: #f1f1f1; padding: 1rem; border-radius: .25rem;">${error instanceof Error ? error.stack : String(error)}</pre>
    </div>`;
  }
};

window.addEventListener('error', (event) => {
  showError(event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  showError(event.reason || 'Unhandled promise rejection');
});

try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  showError(error);
}
