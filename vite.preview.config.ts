import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages preview build configuration
export default defineConfig({
  plugins: [react()],
  base: '/date-selector/',
  build: {
    outDir: 'preview',
    emptyOutDir: true,
  },
})
