import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base задаётся при сборке (GitHub Pages в под-папке /repo/): BASE_PATH=/repo/
// локально и в деве — корень '/'
// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0, // keep .hdr / models as real files
    chunkSizeWarningLimit: 1500,
  },
  assetsInclude: ['**/*.hdr', '**/*.glb', '**/*.gltf', '**/*.exr'],
})
