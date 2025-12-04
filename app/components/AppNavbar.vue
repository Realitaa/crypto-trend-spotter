<script setup lang="ts">
import { getSupportedCoins } from '~/utils/coins'

const colorMode = useColorMode()
const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
}

const { selected, setCoin } = useSelectedCoin()
const coins = computed(() => [
  {
    id: 'coins',
    label: 'Koin',
    items: getSupportedCoins(setCoin)
  }
])

// time
const utcNow = ref('--:--:--')

const updateTime = () => {
  utcNow.value = new Date().toLocaleString('en-GB', {
    timeZone: 'UTC',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

</script>

<template>
  <UDashboardNavbar :ui="{ right: 'gap-3' }">
    <template #title>
      <NuxtLink to="/" class="font-semibold text-xl hover:opacity-80 transition">
        Crypto Trend Spotter
      </NuxtLink>
    </template>

    <template #right>
      <span class="text-sm cursor-default">Waktu: {{ utcNow }} UTC</span>

      <BinanceStatus />

      <UDashboardSearchButton
        class="bg-transparent ring-default hidden sm:inline-flex"
        :label="selected.label"
        :icon="selected.icon"
      />

      <UButton
        :icon="colorMode.value === 'dark' ? 'tabler:sun' : 'ci:moon'"
        size="xl"
        color="neutral"
        variant="link"
        @click="toggleTheme"
      />

      <UButton 
        icon="mdi:github" 
        size="xl" 
        color="neutral" 
        variant="link"
        to="https://github.com/Realitaa/crypto-trend-spotter" target="_blank" />
    </template>
  </UDashboardNavbar>

  <UDashboardSearch
    :groups="coins"
    :color-mode="false"
    placeholder="Cari Koin yang ingin di analisis..."
  />
</template>
