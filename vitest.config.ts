import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import vue from "@vitejs/plugin-vue"
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './'),

    }
  },
  test: {
    // single project mode (simplest & usually enough)
    include: [
      'tests/unit/**/*.{test,spec}.ts',
      'tests/nuxt/**/*.{test,spec}.ts'
    ],
    exclude: ['**/node_modules/**', '**/dist/**'],

    environment: 'happy-dom',          // or 'node' if you want
    environmentOptions: {
      nuxt: {
        rootDir: fileURLToPath(new URL('.', import.meta.url)),
        // domEnvironment: 'happy-dom'  ← not needed here
      }
    },

    // If you really need separate environments per folder:
    // use setupFiles or different --project flags instead
  }
})
