import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El portal del personal usa el 5173; este portal del cliente usa el 5174.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
})
