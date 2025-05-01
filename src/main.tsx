import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Environment variable checks
console.log('Environment Variables:');
console.log({
  VITE_API_URL: import.meta.env.VITE_API_URL ? 'Set' : 'Not Set',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);