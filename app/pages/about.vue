<script setup lang="ts">
definePageMeta({ layout: 'navigation' })

const { data: about } = await useAsyncData(`about`, () => 
  queryCollection('about').path('/about/').first()
)

useSeoMeta({
  title: about.value?.title ?? 'Tentang Crypto Trend Spotter',
  description: about.value?.description
})

if (!about.value) throw createError({ statusCode: 404, message: 'Page not found' })
</script>

<template>
    <UDashboardPanel :ui="{ body: 'w-full max-w-none px-0' }">
      <template #header>
        <AppNavbar />
      </template>
  
      <template #body>
        <ContentWithToc v-if="about" :content="about" />
        <div v-else class="p-8 text-center text-gray-500">
          About not found
        </div>
      </template>
    </UDashboardPanel>
  </template>
  