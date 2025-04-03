// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/MonitorProcessos/', // 👈 isso é ESSENCIAL
  plugins: [react()],
})

