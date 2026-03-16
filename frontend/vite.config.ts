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
  base: process.env.BASE_PATH,
  // For local development replace {{__data_app_slug__}} with the your actual data app slug value
  // base: process.env.BASE_PATH || "/dataapps/b5d3f33d-db29-4ef9-b686-3b62b1736856",
});
