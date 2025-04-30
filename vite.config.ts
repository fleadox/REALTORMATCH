import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Debug logging
  console.log('Vite Environment:', {
    mode,
    hasSupabaseUrl: !!env.VITE_SUPABASE_URL,
    hasSupabaseAnonKey: !!env.VITE_SUPABASE_ANON_KEY,
    hasSupabaseServiceKey: !!env.VITE_SUPABASE_SERVICE_KEY,
    envKeys: Object.keys(env).filter(key => key.startsWith('VITE_'))
  });
  
  return {
    plugins: [react()],
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
      // Process env variables
      'process.env': env,
      // Import meta env variables
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_SUPABASE_SERVICE_KEY': JSON.stringify(env.VITE_SUPABASE_SERVICE_KEY),
      'import.meta.env.MODE': JSON.stringify(mode),
      'import.meta.env.DEV': mode === 'development',
      'import.meta.env.PROD': mode === 'production',
      'import.meta.env.SSR': false,
    },
    server: {
      port: 5173,
      strictPort: true,
      host: true,
    },
  };
});
