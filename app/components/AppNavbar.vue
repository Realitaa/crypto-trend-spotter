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
const utcHH = ref('--')
const utcMM = ref('--')
const showColon = ref(true)

const updateTime = () => {
  const now = new Date()

  utcHH.value = now.toLocaleString('en-GB', {
    timeZone: 'UTC',
    hour12: false,
    hour: '2-digit'
  })

  utcMM.value = now.toLocaleString('en-GB', {
    timeZone: 'UTC',
    hour12: false,
    minute: '2-digit'
  })

  // Blink setiap detik
  showColon.value = !showColon.value
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
        <span class="sm:hidden">CTS</span>
        <span class="hidden sm:inline">Crypto Trend Spotter</span>
      </NuxtLink>
    </template>

    <template #right>
      <!-- Desktop: jam:menit:detik -->
      <div class="hidden sm:block text-sm">
        Waktu: {{ utcHH }}:{{ utcMM }}:{{ new Date().getUTCSeconds().toString().padStart(2,'0') }} UTC
      </div>

      <!-- Mobile: hanya jam & menit, titik dua berkedip -->
      <div class="block sm:hidden text-sm">
        {{ utcHH }}<span :style="{ opacity: showColon ? 1 : 0 }">:</span>{{ utcMM }}
      </div>

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
