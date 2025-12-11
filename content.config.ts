import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    documentation: defineCollection({
      type: 'page',
      source: 'documentation/**/*.md'
    }),
    about: defineCollection({
      type: 'page',
      source: 'about/index.md'
    }),
    guide: defineCollection({
      type: 'page',
      source: 'guide/**/*.md'
    }),
  }
})
