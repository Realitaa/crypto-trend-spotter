<script setup lang="ts">
  definePageMeta({ layout: 'navigation' })
  
  // Global state
  const { selected } = useSelectedCoin()
  const coinId = computed(() => selected.value?.id || 'bitcoin')
  const coinLabel = computed(() => selected.value?.label || 'Bitcoin')
  
  // UI Controls
  const enableSmoothing = ref(false)
  
  // Hydration guard
  const isHydrated = ref(false)
  onMounted(() => setTimeout(() => (isHydrated.value = true), 150))
  
  // Fetch data
  const { data, pending, refresh } = useFetch(
    () => `/api/differential/${coinId.value}/1d?smoothing=${enableSmoothing.value}`,
    {
      key: () => `diff-${coinId.value}-${enableSmoothing.value}`,
      watch: [coinId, enableSmoothing],
      server: false,
    }
  )
  
  const points = computed(() => data.value?.points || [])
  const latest = computed(() => data.value?.latest || {})
  const metadata = computed(() => data.value?.metadata || {})
  
  // Reactive hovered point (untuk update kartu saat hover)
  const hoveredPoint = ref<any>(null)
  
  // Theme
  const colorMode = useColorMode()
  const isDark = computed(() => colorMode.value === 'dark')
  const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  
  const chartColors = computed(() => ({
    bg: cssVar('--chart-bg') || (isDark.value ? '#0f172a' : '#ffffff'),
    text: cssVar('--chart-text') || (isDark.value ? '#e2e8f0' : '#1e293b'),
    grid: cssVar('--chart-grid') || (isDark.value ? '#334155' : '#e2e8f0'),
  }))
  
  // Chart refs
  const priceChartEl = ref<HTMLElement | null>(null)
  const derivChartEl = ref<HTMLElement | null>(null)
  const priceChart = useLightweightChartV5(priceChartEl, { height: 400 })
  const derivChart = useLightweightChartV5(derivChartEl, { height: 260 })
  
  let priceSeries: any = null
  let smoothedSeries: any = null
  let velocitySeries: any = null
  let accelSeries: any = null
  let priceApi: any = null
  let derivApi: any = null
  
  // Sync crosshair + update hovered point
  const handleCrosshairMoved = (param: any, targetChart: 'price' | 'deriv') => {
    if (!param || !param.time || !points.value.length) {
      hoveredPoint.value = null
      return
    }
  
    const point = points.value.find(p => p.time === param.time)
    if (point) {
      hoveredPoint.value = point
  
      // Sync ke chart lain
      if (targetChart === 'price' && derivApi) {
        derivApi.setCrosshairPosition(null, param.time)
      } else if (targetChart === 'deriv' && priceApi) {
        priceApi.setCrosshairPosition(null, param.time)
      }
    }
  }
  
  // Render charts
  watch([isHydrated, points, isDark], async ([hydrated]) => {
    if (!hydrated || points.value.length === 0) return
    await nextTick()
  
    // PRICE CHART
    priceApi = await priceChart.init({
      layout: { background: { color: chartColors.value.bg }, textColor: chartColors.value.text },
      grid: { vertLines: { color: chartColors.value.grid }, horzLines: { color: chartColors.value.grid } },
      crosshair: { mode: 1 },
      timeScale: { timeVisible: true, secondsVisible: false },
    })
  
    priceSeries = priceApi.addLineSeries({ color: '#3b82f6', lineWidth: 2, title: 'Harga' })
    smoothedSeries = metadata.value.smoothed
      ? priceApi.addLineSeries({ color: '#10b981', lineWidth: 2, lineStyle: 2, title: 'Harga (SMA)' })
      : null
  
    priceSeries.setData(points.value.map(p => ({ time: p.time, value: p.price })))
    if (smoothedSeries) smoothedSeries.setData(points.value.map(p => ({ time: p.time, value: p.price })))
  
    priceChart.chart?.subscribeCrosshairMove?.((param: any) => handleCrosshairMoved(param, 'price'))
  
    // DERIVATIVE CHART
    derivApi = await derivChart.init({
      layout: { background: { color: chartColors.value.bg }, textColor: chartColors.value.text },
      grid: { vertLines: { color: chartColors.value.grid }, horzLines: { color: chartColors.value.grid } },
      crosshair: { mode: 1 },
    })
  
    velocitySeries = derivApi.addLineSeries({ color: '#10b981', lineWidth: 2, title: 'Velocity (%)' })
    accelSeries = derivApi.addLineSeries({ color: '#a855f7', lineWidth: 2, lineStyle: 2, title: 'Acceleration (%)' })
  
    velocitySeries.setData(points.value.map(p => ({ time: p.time, value: p.velocity })))
    accelSeries.setData(points.value.map(p => ({ time: p.time, value: p.acceleration })))
  
    derivChart.chart?.subscribeCrosshairMove?.((param: any) => handleCrosshairMoved(param, 'deriv'))
  })
  
  onBeforeUnmount(() => {
    priceChart?.remove?.()
    derivChart?.remove?.()
  })
  
  // Computed untuk kartu (menggunakan hover > latest)
  const display = computed(() => hoveredPoint.value || latest.value)
  
  const momentumText = computed(() => {
    const v = display.value.velocity
    const a = display.value.acceleration
  
    if (v > 0 && a > 0) return { text: 'Momentum Menguat 🚀', color: 'text-emerald-400' }
    if (v > 0 && a < 0) return { text: 'Kenaikan Melambat ⚠️', color: 'text-yellow-400' }
    if (v < 0 && a < 0) return { text: 'Jatuh Semakin Cepat 🔻', color: 'text-rose-400' }
    if (v < 0 && a > 0) return { text: 'Reversal Terdeteksi 🔄', color: 'text-cyan-400' }
    return { text: 'Netral', color: 'text-slate-400' }
  })
  </script>
  
  <template>
    <UDashboardPanel :ui="{ body: 'w-full max-w-none px-0' }">
      <template #header>
        <AppNavbar />
      </template>
  
      <template #body>
        <div class="p-6 lg:p-8">
  
          <!-- Header -->
          <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 class="text-2xl font-bold text-white">Analisis Diferensial — {{ coinLabel }}</h1>
              <p class="text-sm text-slate-400">Velocity & Acceleration dalam % per jam • Hover untuk analisis titik waktu</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-3">
                <span class="text-sm text-slate-400">Smoothing (SMA)</span>
                <button @click="enableSmoothing = !enableSmoothing; refresh()"
                  :class="enableSmoothing ? 'bg-emerald-600' : 'bg-slate-700'"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                  <span :class="enableSmoothing ? 'translate-x-6' : 'translate-x-1'"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                </button>
              </div>
              <div class="text-xs font-medium text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {{ pending ? 'Memuat...' : 'Live' }}
              </div>
            </div>
          </header>
  
          <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <!-- CHARTS (Kiri - 70%) -->
            <div class="xl:col-span-8 space-y-8">
              <!-- Price Chart -->
              <div class="bg-slate-900/60 border border-slate-700 rounded-xl p-6">
                <h2 class="text-lg font-semibold text-white mb-4">
                  Grafik Harga {{ metadata.smoothed ? '& Harga (SMA)' : '' }}
                </h2>
                <div v-if="!isHydrated" class="h-96"><USkeleton class="h-full w-full" /></div>
                <div ref="priceChartEl" class="w-full h-96"></div>
              </div>
  
              <!-- Derivative Chart -->
              <div class="bg-slate-900/60 border border-slate-700 rounded-xl p-6">
                <h2 class="text-lg font-semibold text-white mb-4">Turunan Pertama & Kedua (Velocity + Acceleration)</h2>
                <div v-if="!isHydrated" class="h-64"><USkeleton class="h-full w-full" /></div>
                <div ref="derivChartEl" class="w-full h-64"></div>
              </div>
            </div>
  
            <!-- CARDS (Kanan - 30%) -->
            <div class="xl:col-span-4 space-y-6">
              <template v-if="pending">
                <USkeleton class="h-32 w-full" v-for="i in 4" :key="i" />
              </template>
              <template v-else>
                <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur">
                  <h4 class="text-xs uppercase text-slate-400 mb-2">Velocity (f')</h4>
                  <div class="text-3xl font-bold" :class="display.velocity >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                    {{ display.velocity >= 0 ? '+' : '' }}{{ (display.velocity ?? 0).toFixed(4) }}%/jam
                  </div>
                  <p class="text-sm text-slate-400 mt-1">{{ display.velocity >= 0 ? 'Harga sedang naik' : 'Harga sedang turun' }}</p>
                </div>
  
                <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur">
                  <h4 class="text-xs uppercase text-slate-400 mb-2">Acceleration (f'')</h4>
                  <div class="text-3xl font-bold" :class="display.acceleration >= 0 ? 'text-emerald-400' : 'text-rose-400'">
                    {{ display.acceleration >= 0 ? '+' : '' }}{{ (display.acceleration ?? 0).toFixed(4) }}%/jam²
                  </div>
                </div>
  
                <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur">
                  <h4 class="text-xs uppercase text-slate-400 mb-2">Momentum Saat Ini</h4>
                  <div class="text-2xl font-bold" :class="momentumText.color">
                    {{ momentumText.text }}
                  </div>
                  <p class="text-xs text-slate-400 mt-2">Berdasarkan kombinasi velocity & acceleration</p>
                </div>
  
                <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-6 backdrop-blur">
                  <h4 class="text-xs uppercase text-slate-400 mb-2">Confidence Level</h4>
                  <div class="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500"
                      :class="display.velocity > 0 ? 'bg-emerald-500' : 'bg-rose-500'"
                      :style="{ width: Math.min(Math.abs(display.acceleration ?? 0) * 50, 100) + '%' }" />
                  </div>
                  <div class="text-right text-sm mt-2 font-medium text-slate-300">
                    {{ Math.min(Math.abs(display.acceleration ?? 0) * 50, 100).toFixed(0) }}%
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </UDashboardPanel>
  </template>