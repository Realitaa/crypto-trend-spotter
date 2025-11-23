<script setup lang="ts">
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}

const coins = computed(() => [{
  id: 'coins',
  label: 'Koin',
  items: [{
    id: 'bitcoin',
    label: 'Bitcoin',
    icon: 'logos:bitcoin'
  }]
}])
</script>

<template>
  <UDashboardNavbar :ui="{ right: 'gap-3' }">
    <template #title>
      <NuxtLink
        to="/"
        class="font-semibold text-xl hover:opacity-80 transition"
      >
        Crypto Trend Spotter
      </NuxtLink>
    </template>
    <template #right>
      <UDashboardSearchButton class="bg-transparent ring-default hidden sm:inline-flex" label="Bitcoin" icon="logos:bitcoin" />
      <UButton
        :icon="colorMode.value === 'dark' ? 'tabler:sun' : 'ci:moon'"
        size="xl"
        color="neutral"
        variant="link"
        @click="toggleTheme"
      />
      <UButton icon="mdi:github" size="xl" color="neutral" variant="link" to="https://github.com/Realitaa/crypto-trend-spotter" target="_blank" />
    </template>
  </UDashboardNavbar>
  <UDashboardSearch :groups="coins" :color-mode="false" placeholder="Cari Koin yang ingin di analisis..." />
</template>
