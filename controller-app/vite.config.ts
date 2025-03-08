import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist-controller',
  },
  server: {
    port: 5774,
    strictPort: true,
  },
  css: {
    postcss: './postcss.config.cjs',
  }
})
