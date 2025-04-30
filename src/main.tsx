import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './i18n';
import './index.css';

// Debug logging
console.log('Environment:', {
  NODE_ENV: import.meta.env.MODE,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not Set',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not Set',
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Set' : 'Not Set'
});

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
    console.log('ErrorBoundary initialized');
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Error caught in boundary:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      console.log('Rendering error state');
      return (
        <div className="min-h-screen bg-background-dark text-white p-8">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-300 mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 rounded-lg hover:bg-primary-600"
          >
            Reload Page
          </button>
        </div>
      );
    }

    console.log('Rendering children in ErrorBoundary');
    return this.props.children;
  }
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

console.log('Application starting...');

try {
  console.log('Looking for root element...');
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  console.log('Root element found, creating root...');

  const root = createRoot(rootElement);
  console.log('Root created, rendering app...');
  
  root.render(
    <StrictMode>
      <ErrorBoundary>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <App />
          </GoogleOAuthProvider>
        ) : (
          <App />
        )}
      </ErrorBoundary>
    </StrictMode>
  );
  console.log('App rendered successfully');
} catch (error) {
  console.error('Error rendering application:', error);
  // Render error state directly to root
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log('Rendering error state to root element');
    rootElement.innerHTML = `
      <div style="min-height: 100vh; background-color: #1A1A1A; color: white; padding: 2rem;">
        <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Failed to load application</h1>
        <p style="color: #999; margin-bottom: 1rem;">${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background-color: #2ECC71; border-radius: 0.5rem; hover: background-color: #27AE60;">
          Reload Page
        </button>
      </div>
    `;
  }
}