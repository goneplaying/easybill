import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    base: "/easybill/",
    server: {
      port: 80,
      host: true,
      allowedHosts: ["jae-unsubsidized-mindlessly.ngrok-free.dev"]
    },
    plugins: [react(), tailwindcss()],
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Vendor chunks
            if (id.includes('node_modules')) {
              // React core (separate from react-dom)
              if (id.includes('react/') && !id.includes('react-dom')) {
                return 'react-core';
              }
              // React DOM
              if (id.includes('react-dom')) {
                return 'react-dom';
              }
              // React Router
              if (id.includes('react-router')) {
                return 'react-router';
              }
              // Radix UI components
              if (id.includes('@radix-ui')) {
                return 'radix-ui';
              }
              // Table library
              if (id.includes('@tanstack/react-table')) {
                return 'table-vendor';
              }
              // Icons
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              // Utility libraries
              if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
                return 'utils';
              }
              // Charts library
              if (id.includes('recharts')) {
                return 'charts';
              }
              // Sonner (toast notifications)
              if (id.includes('sonner')) {
                return 'sonner';
              }
              // Other node_modules
              return 'vendor';
            }
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
})
