/// <reference types="vitest" />

import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// Generar alias dinámicamente para todas las carpetas en src
const srcPath = path.resolve(__dirname, 'src')
const alias = {}
fs.readdirSync(srcPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .forEach(dirent => {
    alias[`@${dirent.name}`] = path.join(srcPath, dirent.name)
  })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy()
  ],
  resolve: {
    alias
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})
