import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.NML_PROMPT_FACT_SYSTEM': JSON.stringify(env.NML_PROMPT_FACT_SYSTEM),
        'process.env.NML_PROMPT_SOURCES_SYSTEM': JSON.stringify(env.NML_PROMPT_SOURCES_SYSTEM),
        'process.env.NML_WHITELIST': JSON.stringify(env.NML_WHITELIST),
        'process.env.NML_BLACKLIST': JSON.stringify(env.NML_BLACKLIST),
        'process.env.NML_GOV_PATTERNS': JSON.stringify(env.NML_GOV_PATTERNS),
        'process.env.NML_HINT_DOMAINS': JSON.stringify(env.NML_HINT_DOMAINS),
        'process.env.NML_SOURCES_MAX': JSON.stringify(env.NML_SOURCES_MAX),
        'process.env.NML_PIX_KEY': JSON.stringify(env.NML_PIX_KEY),
        'process.env.NML_PIX_QR_URL': JSON.stringify(env.NML_PIX_QR_URL)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
