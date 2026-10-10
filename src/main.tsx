// Defensive patch to ensure window.fetch can be monkey-patched by test runners and extensions
(() => {
  try {
    const rawFetch = window.fetch;
    let currentFetch = rawFetch ? rawFetch.bind(window) : undefined;
    const descriptor: PropertyDescriptor = {
      get() {
        return currentFetch;
      },
      set(fn: any) {
        currentFetch = fn;
      },
      configurable: true,
      enumerable: true,
    };

    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', descriptor);
      } catch {
        // ignore
      }
    }

    try {
      Object.defineProperty(window, 'fetch', descriptor);
    } catch {
      // ignore
    }
  } catch {
    // ignore
  }
})();

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
