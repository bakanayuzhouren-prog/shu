import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // mode (development/production) に応じて .env を読み込む
  // Fix: Cast process to any to avoid "Property 'cwd' does not exist on type 'Process'" error
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    base: './', // GitHub Pagesなどのサブディレクトリで動作させるために相対パスを設定
    define: {
      // .env に書いた API_KEY を process.env.API_KEY としてアプリに渡す
      'process.env.API_KEY': JSON.stringify(env.API_KEY || "")
    }
  };
});