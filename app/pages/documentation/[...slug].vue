<!-- pages/documentation/[...slug].vue -->
<script setup lang="ts">
definePageMeta({ layout: 'navigation' })

const route = useRoute()
const slug = route.params.slug as string[] | undefined
const path = slug && slug.length > 0 
  ? `/documentation/${slug.join('/')}` 
  : '/documentation'

const { data: docs } = await useAsyncData(`doc-${path}`, () => 
  queryCollection('documentation').path(path).first()
)

useSeoMeta({
  title: docs.value?.title ?? 'Documentation',
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
      <ContentRenderer v-if="docs" :value="docs" />
      <div v-else class="p-8 text-center text-gray-500">
        Documentation not found
      </div>
    </template>
  </UDashboardPanel>
</template>