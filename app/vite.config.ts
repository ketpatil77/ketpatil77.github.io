import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Improve mobile load time via code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep React runtime together
          react: ['react', 'react-dom'],
          // Split heavy animation libs
          framer: ['framer-motion'],
          anime: ['animejs'],
          // UI vendor libs
          ui: ['@radix-ui/react-tabs', 'lucide-react'],
        },
      },
    },
    // Raise warning threshold since split chunks are expected
    chunkSizeWarningLimit: 600,
  },
});
