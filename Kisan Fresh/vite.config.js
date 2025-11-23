import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";



export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: "127.0.0.1", // 👈 IMPORTANT: Match backend domain
    port: 5173,        // optional but recommended

    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000", // 👈 use same domain
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
