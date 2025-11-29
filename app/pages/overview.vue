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
                <p class="text-sm" v-if="chartTab != 'tradingview'">
                  Price data by <a href="https://coingecko.com" target="_blank" class="text-blue-400 dark:text-green-600">CoinGecko</a>
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
                class="w-auto"
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

    <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      <div class="group relative p-5 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none hover:shadow-md hover:border-blue-400/30 dark:hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm">
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Harga Saat Ini</span>
          <span :class="`text-xs px-2 py-0.5 rounded border ${changeColor} font-mono font-medium`">
            {{ assetData.change24h > 0 ? '+' : ''}}{{ assetData.change24h }}%
          </span>
        </div>
        <div class="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {{ formatCurrency(assetData.price) }}
        </div>
      </div>

      <div class="group p-5 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none hover:shadow-md hover:border-blue-400/30 dark:hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm">
        <div class="mb-2">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tren Jangka Pendek</span>
        </div>
        <div class="flex items-end justify-between">
          <div :class="`text-lg font-semibold flex items-center gap-2 ${trendColor}`">
             <svg v-if="assetData.trend === 'Bullish'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            <svg v-else-if="assetData.trend === 'Bearish'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            {{ assetData.trend }}
          </div>
          <div class="h-8 w-20 opacity-50">
             <svg viewBox="0 0 100 40" class="stroke-current" :class="sparklineColor" fill="none" stroke-width="2">
               <path d="M0 30 Q 10 25, 20 35 T 40 20 T 60 10 T 80 25 T 100 5" />
             </svg>
          </div>
        </div>
      </div>

      <div class="group p-5 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none hover:shadow-md hover:border-blue-400/30 dark:hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm">
        <div class="mb-2 flex justify-between">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Volatilitas</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="text-slate-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M4.93 4.93l2.83 2.83"></path><path d="M16.24 16.24l2.83 2.83"></path><path d="M2 12h4"></path><path d="M18 12h4"></path><path d="M4.93 19.07l2.83-2.83"></path><path d="M16.24 7.76l2.83-2.83"></path></svg>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ assetData.volatility }}%</span>
          <span class="text-xs text-slate-500">per 24 jam</span>
        </div>
        <div class="w-full bg-slate-100 dark:bg-slate-700/50 h-1 mt-3 rounded-full overflow-hidden">
          <div class="bg-orange-500 dark:bg-orange-400 h-full rounded-full" style="width: 45%"></div>
        </div>
      </div>

      <div class="group p-5 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none hover:shadow-md hover:border-blue-400/30 dark:hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm">
        <div class="mb-2">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Volume 24 Jam</span>
        </div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          ${{ assetData.volume }}
        </div>
        <div class="flex items-end gap-1 h-6 mt-2 opacity-60">
          <div class="w-1 bg-blue-500 h-3 rounded-t-sm"></div>
          <div class="w-1 bg-blue-500 h-5 rounded-t-sm"></div>
          <div class="w-1 bg-blue-500 h-4 rounded-t-sm"></div>
          <div class="w-1 bg-blue-500 h-full rounded-t-sm"></div>
          <div class="w-1 bg-blue-500 h-2 rounded-t-sm"></div>
          <div class="w-1 bg-blue-400 h-4 rounded-t-sm"></div>
          <div class="w-1 bg-blue-300 h-3 rounded-t-sm"></div>
        </div>
      </div>
    </div> -->

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

    <!-- <section class="mt-8">
      <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm dark:shadow-none backdrop-blur-sm">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-6">Ringkasan Analitik</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="relative pl-4 border-l-2 border-blue-500/30">
            <h4 class="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">Hasil Diferensiasi Numerik</h4>
            <div class="text-xl font-semibold text-slate-900 dark:text-white mb-1">{{ assetData.analysis.diffStatus }}</div>
            <div class="text-xs text-slate-500 font-mono">
              Rate of Change: <span class="text-blue-600 dark:text-blue-400 font-bold">{{ assetData.analysis.diffValue }}</span>
            </div>
          </div>

          <div class="relative pl-4 border-l-2 border-purple-500/30">
            <h4 class="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">Hasil Uji Kekonveksan</h4>
             <div class="text-xl font-semibold text-slate-900 dark:text-white mb-1">{{ assetData.analysis.convexityStatus }}</div>
            <div class="text-xs text-slate-500 font-mono">
              Convexity Score: <span class="text-purple-600 dark:text-purple-400 font-bold">{{ assetData.analysis.convexityScore }}</span>
            </div>
          </div>
        </div>
      </div>
    </section> -->

  </div>  
    </template>

</UDashboardPanel>
</template>

<style scoped>
/* Optional: Add a subtle background glow if the parent doesn't provide it */
/* .card-glow {
  background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 40%);
} 
*/
</style>
