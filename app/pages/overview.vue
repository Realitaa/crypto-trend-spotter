<script setup lang="ts">
definePageMeta({
  layout: 'navigation'
})

const { selected } = useSelectedCoin()

const coinId = computed(() => selected.value?.id || 'bitcoin')
const coinLabel = computed(() => selected.value?.label || 'Bitcoin')

// Chart + Timeframe
const {
  timeframeWritable: timeframe,
  chartData,
  pending: chartPending,
  lastUpdated,
} = usePriceChart(coinId)

// Ticker (harga saat ini)
const { data: ticker, pending: tickerPending, refresh: refreshTicker } = useFetch(
  () => `/api/ticker/${coinId.value}`,
  {
    key: () => `ticker-${coinId.value}`,
    watch: [coinId], 
    server: false,
    default: () => ({ price: 0, change24h: 0 }),
  }
)

const currentPrice = computed(() => ticker.value?.price || 0)
const priceChange = computed(() => ticker.value?.change24h || 0)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

// Mock Data - In a real app, this would come from props or a store
const assetData = ref({
  name: 'Bitcoin',
  symbol: 'BTC',
  price: 67240.55,
  change24h: 2.45, // Percentage
  trend: 'Bullish', // Bullish, Bearish, Sideways
  volatility: 4.2,
  volume: '29.3B',
  description: 'Bitcoin adalah mata uang digital terdesentralisasi yang dibuat pada Januari 2009. Bitcoin menawarkan janji biaya transaksi yang lebih rendah daripada mekanisme pembayaran online tradisional dan dioperasikan oleh otoritas terdesentralisasi, tidak seperti mata uang yang dikelurkan oleh pemerintah.',
  analysis: {
    diffStatus: 'Positif (Akselerasi)',
    diffValue: 145.20,
    convexityStatus: 'Cembung (Convex)',
    convexityScore: 0.88
  }
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
              </div>

                <!-- High Low -->
                <!-- <div class="flex items-center gap-6 text-sm">
                  <div>
                    <p class="text-muted">24h High</p>
                    <p class="font-semibold">$67,900</p>
                  </div>
                  <div>
                    <p class="text-muted">24h Low</p>
                    <p class="font-semibold">$65,800</p>
                  </div>
                </div> -->
              <!-- </div> -->
            </section>

            <!-- Timeframe and chart option Tabs Section -->
            <section class="flex justify-between">
              <UTabs 
                v-model:selected="timeframe"
                :items="[
                  { label: '5M', key: '5m' },
                  { label: '1H', key: '1h' },
                  { label: '1D', key: '1d' },
                  { label: '7D', key: '7d' },
                  { label: '30D', key: '30d' },
                  { label: '1Y', key: '1y' },
                ]"
              />
              <UTabs
                :items="[
                  { label: 'Built-in' },
                  { label: 'Tradingview' },
                ]"
              />
            </section>

            <!-- Chart Section -->
            <section class="h-[60%]">
              <OverviewAreaChart :data="chartData" :height="500" />
            </section>
          </template>
        </section>
        
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Ringkasan Aset</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Tinjauan performa dan metrik teknikal untuk <span class="text-blue-600 dark:text-blue-400 font-medium">{{ assetData.name }}</span>.
              </p>
            </div>
            <div class="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Updated: {{ lastUpdated }}
            </div>
          </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
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
    </div>

    <section class="mb-8">
      <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm dark:shadow-none backdrop-blur-sm">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" class="text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Tentang Aset
        </h3>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm lg:text-base">
          {{ assetData.description }}
        </p>
      </div>
    </section>

    <section>
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
    </section>

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
