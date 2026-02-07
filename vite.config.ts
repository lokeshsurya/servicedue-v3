import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // Production optimizations
  build: {
    outDir: 'dist',
    sourcemap: mode === 'production' ? false : true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer': ['framer-motion'],
          'form': ['react-hook-form', '@hookform/resolvers', 'zod']
        }
      }
    },
    minify: 'esbuild',
    // Remove console.logs and debugger in production
    ...(mode === 'production' && {
      esbuild: {
        drop: ['console', 'debugger']
      }
    })
  },

  // Define environment variable prefix
  envPrefix: 'VITE_',

  // Server configuration
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
}))
