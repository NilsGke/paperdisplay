import { defineConfig, loadEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on mode (local or production)
  const env = loadEnv(mode, "../");

  const port = parseInt(
    mode === "development" ? env.VITE_DEV_PORT : env.VITE_PORT
  );
  const useProdBackend = env.VITE_USE_PROD_BACKEND === "true"; // Read flag for production backend usage

  if (useProdBackend)
    console.log("\x1b[35mUSING PRODUCTION BACKEND (RASPBERRYPI)\x1b[0m");
  else console.log("\x1b[33mUSING LOCAL BACKEND\x1b[0m");

  const cfg = {
    plugins: [react()],
    envDir: "../", // Pointing to the parent directory for the env files
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: port,
      proxy: {
        "/api": {
          target: useProdBackend
            ? env.VITE_API_URL
            : `http://${env.VITE_HOST}:${env.VITE_API_PORT}`,
          changeOrigin: true, // For local development, changes the origin to match the target
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  } satisfies UserConfig;
  console.log(cfg.server.proxy);
  return cfg;
});
