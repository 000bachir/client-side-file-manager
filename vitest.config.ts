import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import vue from "@vitejs/plugin-vue"
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL("./app", import.meta.url)),
      '@': fileURLToPath(new URL("./app", import.meta.url))

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
        rootDir: fileURLToPath(new URL('./app', import.meta.url)),
        // domEnvironment: 'happy-dom'  ← not needed here
      }
    },

    // If you really need separate environments per folder:
    // use setupFiles or different --project flags instead
  }
})
