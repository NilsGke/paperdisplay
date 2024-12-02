import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../");

  console.log(`${env.VITE_HOST}:${env.VITE_PORT}/api`);

  console.log(mode);
  const port = parseInt(
    mode === "development" ? env.VITE_DEV_PORT : env.VITE_PORT
  );

  return {
    plugins: [react()],
    envDir: "../",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: port,
      proxy: {
        "/api": `http://${env.VITE_HOST}:${env.VITE_PORT}`,
      },
    },
  };
});
