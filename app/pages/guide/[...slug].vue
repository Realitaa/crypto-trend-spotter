<script setup lang="ts">
definePageMeta({ layout: 'navigation' })

const route = useRoute()
const slug = route.params.slug as string[] | undefined
const path = slug && slug.length > 0 
  ? `/guide/${slug.join('/')}` 
  : '/guide/poverview'

const { data: docs } = await useAsyncData(`doc-${path}`, () => 
  queryCollection('guide').path(path).first()
)

const { data: surround } = await useAsyncData(
  `${path}-surround`,
  () => queryCollectionItemSurroundings('guide', path, {
    fields: ['description']
  })
)

useSeoMeta({
  title: docs.value?.title ?? 'guide',
  description: docs.value?.description
})

if (!docs.value) throw createError({ statusCode: 404, message: 'Page not found' })
</script>

<template>
  <UDashboardPanel 
    :ui="{
      body: 'w-full max-w-none px-0'
    }"
  >
    <template #header>
      <AppNavbar />
    </template>

    <template #body>
      <ContentWithToc v-if="docs" :content="docs" />

      <!-- Surrounding links (Prev / Next) -->
      <div v-if="surround?.filter(Boolean).length" class="px-6 lg:px-8 pb-10">
        <USeparator class="my-10" />
        <UContentSurround :surround="surround" />
      </div>

      <div v-else class="p-8 text-center text-gray-500">
        Guide not found
      </div>
    </template>
  </UDashboardPanel>
</template>