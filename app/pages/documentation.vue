<script setup lang="ts">
definePageMeta({
  layout: 'navigation'
})

const { data: home } = await useAsyncData(() => queryCollection('content').path('/').first())

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
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
        <ContentRenderer v-if="home" :value="home" />
        <div v-else>Home not found</div>
    </template>

</UDashboardPanel>
</template>
