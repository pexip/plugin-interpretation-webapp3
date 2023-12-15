/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import react from '@vitejs/plugin-react'

import viteConfig from './vite.json'

const role = process.env.ROLE

let config = viteConfig.interpreter

if (role === 'listener') {
  config = viteConfig.listener
}

export default defineConfig({
  base: './',
  build: {
    target: 'esnext'
  },
  publicDir: config.publicDir,
  server: {
    open: config.brandingPath + '/',
    port: config.port,
    proxy: {
      [config.brandingPath]: {
        target: viteConfig.infinityUrl,
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: viteConfig.infinityUrl,
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    mkcert(),
    react()
  ]
})
