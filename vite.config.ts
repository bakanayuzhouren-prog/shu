import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // .env も読むが、Vercelでは process.env が本体
  const fileEnv = loadEnv(mode, process.cwd(), "");
  const API_KEY = process.env.API_KEY ?? fileEnv.API_KEY ?? "";

  return {
    plugins: [react()],
    base: "/",
    define: {
      "process.env.API_KEY": JSON.stringify(API_KEY),
    },
  };
});
