import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // Dev only: forward Open Sky calls to the local C proxy (see ../proxy).
    proxy: { "/data": "http://127.0.0.1:8080" },
  },
})
