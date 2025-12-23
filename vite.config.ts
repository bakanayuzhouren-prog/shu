import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // .env も読みつつ、Vercelの process.env も確実に使う
  const fileEnv = loadEnv(mode, process.cwd(), "");
  const API_KEY = process.env.API_KEY || fileEnv.API_KEY || "";

  return {
    plugins: [react()],
    // Vercelなら基本これが無難（相対パスが原因の真っ白回避）
    base: "/",
    define: {
      "process.env.API_KEY": JSON.stringify(API_KEY),
    },
  };
});

