import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Vite automatically exposes VITE_* variables to import.meta.env at build time
    // We also support GEMINI_API_KEY for backward compatibility (local dev)
    const apiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || '';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Support process.env for compatibility (fallback)
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
        // Note: Vite automatically handles import.meta.env.VITE_* variables
        // No need to define them manually - they're injected at build time
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
