import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import express from 'express';
import type { Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Debug logging
  console.log('Loaded environment variables:', {
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL,
    VITE_APP_URL: env.VITE_APP_URL,
    // Don't log the service key for security
    HAS_SERVICE_KEY: !!env.VITE_SUPABASE_SERVICE_ROLE_KEY
  });
  
  // Make env variables available in process.env
  process.env = { ...process.env, ...env };
  
  return {
    plugins: [
      react(),
      {
        name: 'api',
        configureServer(server) {
          const app = express();
          app.use(express.json());
          
          // Add environment variables to the request
          app.use((req, res, next) => {
            console.log('Adding env variables to request:', {
              hasUrl: !!env.VITE_SUPABASE_URL,
              hasKey: !!env.VITE_SUPABASE_SERVICE_ROLE_KEY,
              hasAppUrl: !!env.VITE_APP_URL
            });
            
            (req as any).supabaseUrl = env.VITE_SUPABASE_URL;
            (req as any).supabaseKey = env.VITE_SUPABASE_SERVICE_ROLE_KEY;
            (req as any).appUrl = env.VITE_APP_URL;
            next();
          });
          
          // Forgot password endpoint
          app.post('/api/auth/forgot-password', async (req, res) => {
            try {
              console.log('Request env variables:', {
                hasUrl: !!(req as any).supabaseUrl,
                hasKey: !!(req as any).supabaseKey,
                hasAppUrl: !!(req as any).appUrl
              });
              
              const { POST } = await import('./src/api/auth/forgot-password');
              await POST(req, res);
            } catch (error) {
              console.error('API error:', error);
              res.status(500).json({ 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : String(error)
              });
            }
          });

          // Reset password endpoint
          app.post('/api/auth/reset-password', async (req, res) => {
            try {
              const { POST } = await import('./src/api/auth/reset-password');
              await POST(req, res);
            } catch (error) {
              console.error('API error:', error);
              res.status(500).json({ 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : String(error)
              });
            }
          });

          // Verify token endpoint
          app.post('/api/auth/verify-reset-token', async (req, res) => {
            try {
              const { POST } = await import('./src/api/auth/verify-reset-token');
              await POST(req, res);
            } catch (error) {
              console.error('API error:', error);
              res.status(500).json({ 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : String(error)
              });
            }
          });

          // Mount all routes to server middleware
          server.middlewares.use(app);
        },
      },
    ],
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
        },
      },
      manifest: true,
      sourcemap: false,
    },
    // Expose env variables to your app
    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_SERVICE_ROLE_KEY': JSON.stringify(env.VITE_SUPABASE_SERVICE_ROLE_KEY),
      'process.env.VITE_APP_URL': JSON.stringify(env.VITE_APP_URL),
    },
    server: {
      port: 3000,
      strictPort: true,
      host: true,
    },
  };
});
