// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:4000/api'
  
  console.log('🔧 Vite Config - Mode:', mode)
  console.log('🔧 Vite Config - API URL:', apiUrl)
  
  return {
    base: '/',
    plugins: [react()],
    build: {
      outDir: 'build',
    },
    server: {
      port: 3000,
      proxy: {
        // Usar variable de entorno para el proxy en desarrollo
        '/api': {
          target: apiUrl.replace('/api', ''), // Remover /api del final para el proxy
          changeOrigin: true,
          secure: true, // true para HTTPS
        },
      }
    },
    // Definir variables de entorno explícitamente
    define: {
      __VITE_API_URL__: JSON.stringify(apiUrl),
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl)
    }
  }
})