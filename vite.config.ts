import path from 'node:path'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // El plugin del router tiene que ir antes que el de React
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    // MDX compila antes que React para que los .mdx pasen por Fast Refresh
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm] }) },
    react({ include: /\.(mdx|jsx|tsx)$/ }),
    tailwindcss(),
  ],
  server: {
    // El proyecto vive en el disco de Windows (/mnt/c) y Vite corre en WSL:
    // ahí no llegan los eventos de cambio de archivos, así que se revisan por sondeo
    watch: { usePolling: true, interval: 300 },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
