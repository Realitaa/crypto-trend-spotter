<script setup lang="ts">
definePageMeta({
  layout: 'navigation'
})
</script>

<template>
  <UDashboardPanel id="home" :ui="{
    body: 'w-full max-w-none px-0'
  }">
    <template #header>
      <AppNavbar />
    </template>

    <template #body>
      <UContainer>
        <Placeholder class="h-32" />
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
