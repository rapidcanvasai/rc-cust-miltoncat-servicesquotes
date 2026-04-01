import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: {
      "/api": {
        target: "https://app.rapidcanvas.ai",
        secure: false,
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 5000,
  },
  base: process.env.BASE_PATH,
  // For local development replace {{__data_app_slug__}} with the your actual data app slug value
  // base: process.env.BASE_PATH || "/dataapps/199aac68-8568-46c0-803e-b6b89a98ba90",
});
