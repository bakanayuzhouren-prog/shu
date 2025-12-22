
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // mode (development/production) に応じて .env を読み込む
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // .env に書いた API_KEY を process.env.API_KEY としてアプリに渡す
      'process.env.API_KEY': JSON.stringify(env.API_KEY || "")
    }
  };
});
