<script setup lang="ts">
  definePageMeta({ layout: 'navigation' })
  
  // Global state
  const { selected } = useSelectedCoin()
  const { timeframe } = useTimeframe()
  
  // Reactive coin & tf
  const coinId = computed(() => selected.value?.id || 'bitcoin')
  const coinLabel = computed(() => selected.value?.label || 'Bitcoin')
  
  // Route-based timeframe fallback
  const route = useRoute()
  const tf = computed(() => (route.params.tf as string) || timeframe.value || '4h')
  
  // Hydration guard — CRITICAL untuk Lightweight Charts
  const isHydrated = ref(false)
  onMounted(() => setTimeout(() => (isHydrated.value = true), 200))
  
  // Theme
  const colorMode = useColorMode()
  const isDark = computed(() => colorMode.value === 'dark')
  
  const cssVar = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  
  const chartColors = computed(() => ({
    bg: cssVar('--chart-bg'),
    text: cssVar('--chart-text'),
    grid: cssVar('--chart-grid'),
    bullish: isDark.value ? '#10b981' : '#059669',
    bearish: isDark.value ? '#ef4444' : '#dc2626',
    neutral: isDark.value ? '#64748b' : '#475569',
    channel: isDark.value ? '#6366f1' : '#4f46e5',
    inflection: isDark.value ? '#f59e0b' : '#d97706',
  }))
  
  // Fetch data dari endpoint baru
  const { data, pending, error } = useFetch(() => `/api/trend/${coinId.value}/${tf.value}`, {
    key: () => `trend-${coinId.value}-${tf.value}`,
    watch: [coinId, tf],
    server: false,
  })
  
  const trend = computed(() => data.value)
  
  // Chart refs
  const mainChartEl = ref<HTMLElement | null>(null)
  const chart = useLightweightChartV5(mainChartEl, { height: 500 })
  
  // Watch & render chart hanya setelah hydration + data ready
  watch([isHydrated, trend, isDark], async ([hydrated, t]) => {
    if (!hydrated || !t || pending.value) return
    await nextTick()
  
    const api = await chart.init({
      layout: {
        background: { color: chartColors.value.bg },
        textColor: chartColors.value.text,
      },
      grid: {
        vertLines: { color: chartColors.value.grid },
        horzLines: { color: chartColors.value.grid },
      },
      crosshair: {
        mode: 1, // Normal
        vertLine: { width: 1, color: '#64748b', style: 2 },
        horzLine: { width: 1, color: '#64748b', style: 2 },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    })
  
    // 1. Raw Price
    const priceSeries = api.addCandlestickSeries({
      upColor: chartColors.value.bullish,
      downColor: chartColors.value.bearish,
      borderVisible: false,
      wickUpColor: chartColors.value.bullish,
      wickDownColor: chartColors.value.bearish,
    })
  
    // Kita pakai close price sebagai line (bukan candle) agar lebih clean
    const priceLine = api.addLineSeries({
      color: isDark.value ? '#e2e8f0' : '#1e293b',
      lineWidth: 2,
      priceLineVisible: false,
    })
  
    // 2. Trendline
    const trendline = api.addLineSeries({
      color: t.direction === 'Bullish' ? '#10b981' : '#ef4444',
      lineWidth: 3,
      priceLineVisible: false,
    })
  
    // 3. Regression Channel
    const upperBand = api.addLineSeries({
      color: chartColors.value.channel,
      lineWidth: 1,
      lineStyle: 2, // dashed
    })
    const lowerBand = api.addLineSeries({
      color: chartColors.value.channel,
      lineWidth: 1,
      lineStyle: 2,
    })
  
    // 4. Inflection markers
    const inflectionSeries = api.addLineSeries({
      color: 'transparent',
      lineWidth: 0,
      priceLineVisible: false,
      lastValueVisible: false,
    })
  
    // Prepare data
    const priceData = t.points.map(p => ({
      time: p.time,
      value: p.price,
    }))
  
    const trendlineData = t.points.map(p => ({
      time: p.time,
      value: p.fitted,
    }))
  
    const upperData = t.points.map(p => ({
      time: p.time,
      value: p.upper,
    }))
  
    const lowerData = t.points.map(p => ({
      time: p.time,
      value: p.lower,
    }))
  
    const inflectionData = t.points
      .filter(p => p.isInflection)
      .map(p => ({
        time: p.time,
        value: p.price,
        color: chartColors.value.inflection,
      }))
  
    // Set data
    priceLine.setData(priceData)
    trendline.setData(trendlineData)
    upperBand.setData(upperData)
    lowerBand.setData(lowerData)
  
    // Inflection markers
    inflectionSeries.setData([])
    inflectionData.forEach(point => {
      inflectionSeries.setMarkers([
        ...inflectionSeries.markers(),
        {
          time: point.time,
          position: 'aboveBar',
          color: point.color,
          shape: 'circle',
          size: 1.4,
        },
        {
          time: point.time,
          position: 'belowBar',
          color: point.color,
          shape: 'circle',
          size: 1.4,
        },
      ])
    })
  
    // Auto scale
    api.timeScale().fitContent()
  }, { immediate: false })
  
  // Cleanup
  onBeforeUnmount(() => {
    chart?.remove?.()
  })
  </script>
  
  <template>
    <UDashboardPanel :ui="{ body: 'w-full max-w-none px-0' }">
      <template #header>
        <AppNavbar />
      </template>
  
      <template #body>
        <div class="p-6 lg:p-8">
  
          <!-- Loading State -->
          <template v-if="pending">
            <div class="space-y-6">
              <USkeleton class="h-10 w-64" />
              <USkeleton class="h-96 w-full rounded-xl" />
              <div class="grid grid-cols-3 gap-4">
                <USkeleton v-for="i in 3" :key="i" class="h-32" />
              </div>
            </div>
          </template>
  
          <!-- Error State -->
          <template v-else-if="error">
            <UAlert color="red" title="Gagal memuat data tren" :description="error.message" />
          </template>
  
          <!-- Main Content -->
          <template v-else-if="trend">
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-white mb-2">
                Deteksi Tren — {{ coinLabel }}
              </h1>
              <p class="text-slate-400">
                Timeframe: <span class="font-mono font-bold">{{ tf.toUpperCase() }}</span>
                • Update: {{ new Date().toLocaleTimeString('id-ID') }} WIB
              </p>
            </div>
  
            <!-- Main Chart -->
            <div class="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden mb-8 shadow-2xl">
              <div v-if="!isHydrated" class="h-96 flex items-center justify-center">
                <USkeleton class="h-full w-full rounded-none" />
              </div>
              <div v-else ref="mainChartEl" class="w-full h-[500px]" />
            </div>
  
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  
              <!-- Arah Tren -->
              <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6">
                <div class="text-sm text-slate-400 mb-2">Arah Tren</div>
                <div class="flex items-center gap-3">
                  <div class="text-4xl font-bold"
                    :class="trend.direction === 'Bullish' ? 'text-emerald-400' : trend.direction === 'Bearish' ? 'text-red-400' : 'text-yellow-400'">
                    {{ trend.direction }}
                  </div>
                  <UBadge :color="trend.strengthLabel === 'STRONG' ? 'green' : trend.strengthLabel === 'MODERATE' ? 'yellow' : 'red'"
                          size="xl" variant="solid">
                    {{ trend.strengthLabel }}
                  </UBadge>
                </div>
                <div class="text-sm text-slate-500 mt-2">
                  Kemiringan garis tren {{ trend.trendSlope > 0 ? 'positif' : 'negatif' }} secara konsisten
                </div>
              </div>
  
              <!-- Trend Strength -->
              <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6">
                <div class="text-sm text-slate-400 mb-2">Trend Strength</div>
                <div class="text-5xl font-bold font-mono text-indigo-400">
                  {{ trend.trendStrength }}<span class="text-2xl">/100</span>
                </div>
                <UProgress :value="trend.trendStrength" size="xl" class="mt-4" />
              </div>
  
              <!-- Momentum Status -->
              <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6">
                <div class="text-sm text-slate-400 mb-2">Momentum Status</div>
                <div class="flex items-center gap-3">
                  <div class="text-4xl font-bold"
                    :class="trend.momentum === 'Increasing' ? 'text-emerald-400' : trend.momentum === 'Decreasing' ? 'text-red-400' : 'text-yellow-400'">
                    {{ trend.momentum }}
                  </div>
                  <UIcon :name="trend.momentum === 'Increasing' ? 'i-heroicons-arrow-trending-up' :
                                trend.momentum === 'Decreasing' ? 'i-heroicons-arrow-trending-down' :
                                'i-heroicons-minus'" class="w-10 h-10" />
                </div>
                <div class="text-sm text-slate-500 mt-2">
                  {{ trend.convexity.current === 'Convex' ? 'Momentum beli masih dominan' :
                     trend.convexity.current === 'Concave' ? 'Momentum mulai melemah' : 'Momentum stabil' }}
                </div>
              </div>
  
            </div>
          </template>
        </div>
      </template>
    </UDashboardPanel>
  </template>