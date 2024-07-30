import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/': {
        target: 'https://wasalaexpertaqas.azurewebsites.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/$/, ''),
      },
    },
    host: '0.0.0.0', // Permite que el servidor sea accesible desde cualquier red
    port: 8080, // Usar el puerto por defecto
  },
  build: {
    outDir: 'build',
  },
})
