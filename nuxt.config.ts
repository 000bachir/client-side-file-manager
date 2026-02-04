// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  // app : {
  //   pageTransition : {
  //     name : 'page',
  //     mode : 'in-out',
  //     duration : {
  //       enter : 1.1,
  //       leave : 1
  //     }
  //   }
  // },
  devtools: { enabled: true },
  css: ["./app/assets/css/global.css"],
  vite: {
    plugins: [
      tailwindcss()
    ],
  },
  modules: ["@nuxt/ui", '@nuxt/test-utils/module',
  ]
})
