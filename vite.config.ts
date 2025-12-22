
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Vercelなどの環境変数を読み込む
  // process.cwd() はNode環境で実行されるため安全に使用可能
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: './', // GitHub Pagesなどのサブディレクトリで動作させるために相対パスを設定
    define: {
      // .env や VercelのEnvironment Variables に設定された API_KEY を
      // クライアントサイドの process.env.API_KEY として置換・注入する
      'process.env.API_KEY': JSON.stringify(env.API_KEY || "")
    }
  };
});
