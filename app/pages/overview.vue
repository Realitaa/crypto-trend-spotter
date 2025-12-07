<script setup lang="ts">
definePageMeta({
  layout: 'navigation'
})

const { selected } = useSelectedCoin()
const { timeframe, items } = useTimeframe()

const coinId = computed(() => selected.value?.id || 'bitcoin')
const coinLabel = computed(() => selected.value?.label || 'Bitcoin')
const coinDescription = computed(() => selected.value?.description || 'Tidak ada deskripsi.')
const tradingViewSymbol = computed(() => selected.value?.tvSymbol || 'BINANCE:BTCUSDT')
// Key unik agar TradingView chart re-mount saat coin berubah
const tvChartKey = computed(() => `${selected.value?.id}-${chartTab.value}`)
const { chartData, pending: chartPending, lastUpdated } = usePriceChart(coinId)

const { data: ticker, pending: tickerPending } = useFetch(
  () => `/api/ticker/${coinId.value}`,
  { key: () => `ticker-${coinId.value}`, watch: [coinId], server: false }
)

const currentPrice = computed(() => ticker.value?.price || 0)
const priceChange = computed(() => ticker.value?.change24h || 0)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

// State chart pilihan pengguna
const chartTab = ref<'built-in' | 'tradingview'>('built-in')

// Chart height untuk chart pilihan pengguna
const chartContainerHeight = computed(() => {
  return chartTab.value === 'tradingview' ? 'h-[calc(100vh-12rem)]' : 'h-[60%]'
})

const isHydrated = ref(false)
onMounted(() => {
  setTimeout(() => isHydrated.value = true, 300)
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
      <div class="w-full p-6 lg:p-8 text-slate-800 dark:text-slate-200 transition-colors duration-300">

        <section class="w-full space-y-6">
          <!-- Skeleton pre-hydration -->
          <template v-if="!isHydrated">
            <USkeleton class="h-6 w-40" />
            <USkeleton class="h-10 w-56" />
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <USkeleton class="h-16 w-full" />
              <USkeleton class="h-16 w-full" />
              <USkeleton class="h-16 w-full" />
              <USkeleton class="h-16 w-full" />
            </div>
            <USkeleton class="h-64 w-full mt-6" />
            <USeparator />
          </template>

          <!-- content after hydration -->
          <template v-else>
            <section class="space-y-4 mb-6">

              <!-- Header -->
              <div class="flex flex-wrap items-center justify-between gap-4">  
                <div>
                  <h1 class="text-2xl font-bold">
                    Ringkasan Aset
                  </h1>
                  <p class="text-muted">
                    Tinjauan performa dan metrik teknikal untuk 
                    <span class="text-primary font-medium">{{ coinLabel }}</span>
                  </p>
                </div>

                <!-- Last updated -->
                <UBadge color="neutral" variant="soft" size="lg" class="px-3 py-1.5 gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span class="text-xs">Updated: {{ lastUpdated }}</span>
                </UBadge>
              </div>

              <!-- Price Section -->
              <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                <div>
                  <p class="text-sm text-muted">Harga Saat Ini</p>
                  <div class="flex items-center gap-3">
                    <span class="text-4xl font-bold">
                      <template v-if="tickerPending">
                        <USkeleton class="h-12 w-48 inline-block" />
                      </template>
                      <template v-else>
                        {{ formatCurrency(currentPrice) }}
                      </template>
                    </span>
                    <UBadge 
                      :color="priceChange >= 0 ? 'success' : 'error'" 
                      variant="soft"
                      size="lg"
                    >
                      {{ priceChange > 0 ? '+' : '' }}{{ priceChange }}%
                    </UBadge>
                  </div>
                </div>
              <!-- </div> -->

                <!-- Attribution -->
                <p v-if="chartTab != 'tradingview'" class="text-sm">
                  Price data by <a href="https://binance.com" target="_blank" class="text-blue-400 dark:text-green-600">Binance</a>
                </p>
              </div>
            </section>

            <!-- Timeframe and chart option Tabs Section -->
            <section class="flex justify-between">
              <UTabs 
                v-if="chartTab === 'built-in'"
                v-model="timeframe"
                :items="items"
                class="w-full max-w-md"
              />
              <UTabs
                v-model="chartTab"
                :items="[
                  { label: 'Built-in', value: 'built-in' },
                  { label: 'Tradingview', value: 'tradingview' },
                ]"
                class="w-auto md:ml-auto"
              />
            </section>

            <!-- Chart Section -->
            <section 
              :class="[
                'w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300',
                chartContainerHeight
              ]"
            >
              <div v-if="isHydrated" class="h-full">
                <!-- Built-in chart -->
                <OverviewAreaChart 
                  v-if="chartTab === 'built-in'"
                  :data="chartData" 
                  :height="500" 
                  class="w-full"
                />
                <!-- TradingView Chart component -->
                <Chart
                  v-else
                  :key="tvChartKey"
                  :options="{
                    symbol: tradingViewSymbol,
                    interval: '1D',               // default
                    theme: $colorMode?.value || 'dark',
                    autosize: true,
                    timezone: 'Etc/UTC',
                    locale: 'en',
                    studies: [],                  
                    toolbar_bg: '#0a0e17',
                    enable_publishing: false,
                    allow_symbol_change: true,
                    container_id: 'tv_chart_container'
                  }"
                  class="w-full h-full"
                />
              </div>
              <div v-else class="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <UIcon name="i-svg-spinners-90-ring-with-bg" class="w-12 h-12 text-primary" />
              </div>
            </section>
          </template>
        </section>

    <section class="mt-8">
      <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm dark:shadow-none backdrop-blur-sm">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <UIcon name="lucide:info" class="text-blue-500 dark:text-blue-400" />
          Tentang Aset
        </h3>
        <USkeleton v-if="!isHydrated" class="h-16 w-full" />
        <p v-else class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
          {{ coinDescription }} Sumber data dan selengkapnya di 
          <ULink
            :to="`https://www.coingecko.com/id/coins/${coinId}#about`"
            target="_blank"
            class="text-muted hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            CoinGecko
          </ULink>
          <UIcon name="i-heroicons-arrow-up-right" class="w-3 h-3" />
        </p>
      </div>
    </section>

  </div>  
    </template>

</UDashboardPanel>
</template>

