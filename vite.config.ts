import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev and preview build configuration
export default defineConfig({
  plugins: [react()],
  base: '/date-selector/',
})
