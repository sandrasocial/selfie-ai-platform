import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@components': path.resolve(__dirname, './client/src/components'),
      '@pages': path.resolve(__dirname, './client/src/pages'),
      '@lib': path.resolve(__dirname, './client/src/lib'),
      '@hooks': path.resolve(__dirname, './client/src/hooks'),
      '@shared': path.resolve(__dirname, './client/src/shared'),
      '@assets': path.resolve(__dirname, './assets')
    }
  },
  root: './client',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  logLevel: 'info'
})