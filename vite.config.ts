import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths"; // definir path para no tener problemas con docker y la importación de módulos con @/*
import { imagetools } from "vite-imagetools";
import fs from "fs";
import path from "path";
dotenv.config();
// https://vite.dev/config/
// Fetches /sitemap.xml from the backend at build time and writes it to dist/ so it's served from the frontend domain
const sitemapPlugin = () => ({
  name: "sitemap-fetch",
  async closeBundle() {
    const backendUrl = process.env.VITE_BASE_URL?.trim().replace(/\/$/, "");
    if (!backendUrl) return;
    try {
      const res = await fetch(`${backendUrl}/sitemap.xml`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const outDir = path.resolve(__dirname, "dist");
      if (fs.existsSync(outDir)) {
        fs.writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf-8");
        console.log("sitemap.xml generado en dist/");
      }
    } catch (e) {
      console.warn("No se pudo obtener el sitemap del backend:", e);
    }
  },
});

export default defineConfig({
  plugins: [react(), tsconfigPaths(), imagetools(), sitemapPlugin()],
  server: {
    host: process.env.VITE_APP_ENV === "development" ? "0.0.0.0" : "localhost", // Permite acceso desde fuera del contenedor y localhost
    port: Number(process.env.VITE_PORT) || 5173, // Asegurar que usa el puerto correcto
    strictPort: true, // Forzar uso del puerto
    // https: {
    //   key: fs.readFileSync('localhost+2-key.pem'), // Clave privada
    //   cert: fs.readFileSync('localhost+2.pem'),    // Certificado
    // },
    watch:
      process.env.VITE_APP_ENV === "development"
        ? { usePolling: true }
        : undefined, // Asegurar detección de cambios en Docker modo desarrollo
    proxy: {
      "/sitemap.xml": {
        target: process.env.VITE_BASE_URL?.trim().replace(/\/$/, ""),
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
  resolve: {
    alias: {
      "@models": path.resolve(__dirname, "src/models/interfaces"),
    },
  },
  build: {
    minify: "esbuild",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router"],
          "vendor-mui": ["@mui/material", "@emotion/react", "@emotion/styled"],
          "vendor-mui-icons": ["@mui/icons-material"],
          "vendor-mui-datepickers": ["@mui/x-date-pickers"],
          "vendor-pdf": ["@react-pdf/renderer"],
          "vendor-maps": ["@react-google-maps/api"],
          "vendor-charts": ["chart.js", "react-chartjs-2"],
          "vendor-motion": ["framer-motion"],
          "vendor-signalr": ["@microsoft/signalr"],
          "vendor-i18n": ["i18next", "react-i18next", "i18next-http-backend"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-auth": ["@react-oauth/google", "jwt-decode"],
          "vendor-date": ["date-fns", "react-date-range"],
        },
      },
    },
  },
});
