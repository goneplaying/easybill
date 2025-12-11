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
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'radix-ui': [
              '@radix-ui/react-accordion',
              '@radix-ui/react-checkbox',
              '@radix-ui/react-context-menu',
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-label',
              '@radix-ui/react-popover',
              '@radix-ui/react-select',
              '@radix-ui/react-separator',
              '@radix-ui/react-slot',
              '@radix-ui/react-tabs',
              '@radix-ui/react-tooltip',
            ],
            'table-vendor': ['@tanstack/react-table'],
            'icons': ['lucide-react'],
            'utils': ['date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
})
