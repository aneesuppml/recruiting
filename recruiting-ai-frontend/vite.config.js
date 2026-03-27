import { env } from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In Docker, VITE_DOCKER=true: browser calls same-origin /api/*; Vite proxies to backend:3000.
const docker = env.VITE_DOCKER === 'true'
const proxyTarget = env.VITE_PROXY_TARGET || 'http://backend:3000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    ...(docker && {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    }),
  },
})
