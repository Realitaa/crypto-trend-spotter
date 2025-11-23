// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  css: ['@/assets/css/main.css'],
  colorMode: {
    preference: 'system',
    fallback: 'dark',
    storageKey: 'theme-preference',
    classPrefix: '',
    classSuffix: '',
    dataValue: 'theme'
  }
})
