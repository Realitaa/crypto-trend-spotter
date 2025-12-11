<script setup lang="ts">
  definePageMeta({ layout: 'navigation' })
  
  // Global state
  const { selected } = useSelectedCoin()
  const { timeframe } = useTimeframe()
  const { showModal, closeModal, goToGuide, startTourAgain } = useOnboarding('trend-detection', '/guide/pdetection')
  
  // Reactive coin & tf
  const coinId = computed(() => selected.value?.id || 'bitcoin')
  const coinLabel = computed(() => selected.value?.label || 'Bitcoin')

  watch(coinLabel, (label) => {
    useSeoMeta({
      title: `Deteksi Tren ${label}`
    })
  }, { immediate: true })
  
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

  const summaryText = computed(() => {
  if (!trend.value) return ''

  const dir = trend.value.direction
  const slope = trend.value.trendSlope
  const strength = trend.value.trendStrength
  const strengthLabel = trend.value.strengthLabel
  const momentum = trend.value.momentum
  const convex = trend.value.convexity.current
  const inflect = trend.value.convexity.inflectionPoints

  // Arah tren (deskripsi)
  let directionText = ''
  if (dir === 'Bullish') {
    directionText = 'tren harga menunjukkan kecenderungan naik secara bertahap'
  } else if (dir === 'Bearish') {
    directionText = 'tren harga bergerak turun secara konsisten'
  } else {
    directionText = 'pergerakan harga cenderung mendatar tanpa dominasi arah tertentu'
  }

  // Momentum (deskripsi)
  let momentumText = ''
  if (momentum === 'Increasing') {
    momentumText = 'momentum mulai menguat'
  } else if (momentum === 'Decreasing') {
    momentumText = 'momentum pasar melemah'
  } else {
    momentumText = 'momentum berada pada zona stabil'
  }

  // Convexity (deskripsi)
  let convexText = ''
  if (convex === 'Convex') {
    convexText = 'menandakan percepatan bullish'
  } else if (convex === 'Concave') {
    convexText = 'mengindikasikan pelemahan momentum'
  } else {
    convexText = 'menunjukkan kondisi netral yang rawan reversal'
  }

  // Inflection point
  const hasInflection = inflect.length > 0
  const recentInflection =
    hasInflection && inflect[inflect.length - 1] > trend.value.points.length * 0.7

  return `
    Berdasarkan perhitungan garis tren dan analisis kecekungan, kondisi pasar saat ini berada dalam fase
    ${dir.toLowerCase()}, di mana ${directionText}. Kemiringan tren sebesar ${slope.toFixed(2)}%/hari
    menghasilkan nilai trend strength ${strength}/100, yang dikategorikan sebagai ${strengthLabel.toLowerCase()}.

    Momentum saat ini berada pada status "${momentum}", yang berarti ${momentumText}.
    Sementara itu, bentuk kelengkungan grafik (${convex.toLowerCase()}) ${convexText}.
    ${recentInflection
      ? 'Terdapat inflection point baru-baru ini, mengisyaratkan potensi perubahan arah tren.'
      : hasInflection
      ? 'Beberapa inflection point terdeteksi di sepanjang data, namun belum menunjukkan perubahan arah yang signifikan.'
      : 'Tidak ditemukan inflection point yang menandakan perubahan tren besar dalam waktu dekat.'}
  `
})

  
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
        <div class="flex gap-2 mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Deteksi Tren — {{ coinLabel }}</h1>
          <UButton icon="ix:question" size="md" color="neutral" variant="ghost" @click="startTourAgain" />
        </div>

        <!-- INFORMATION CONTAINER -->
        <div class="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-8">
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ringkasan Analisis</h2>
            <p class="text-gray-600 dark:text-slate-300 leading-relaxed" v-if="!isHydrated || pending">Analisis belum tersedia, menunggu data dari server.</p>
            <p class="text-gray-600 dark:text-slate-300 leading-relaxed" v-else>{{ summaryText }}</p>
          </div>
        </div>  

        <!-- LOADING -->
        <template v-if="pending">
          <div class="space-y-6">
            <USkeleton class="h-10 w-64" />
            <USkeleton class="h-96 w-full rounded-xl" />
            <div class="grid grid-cols-3 gap-4">
              <USkeleton v-for="i in 3" :key="i" class="h-32" />
            </div>
          </div>
        </template>

        <!-- CONTENT -->
        <template v-else-if="trend">
            <!-- Main Chart -->
            <div class="bg-white dark:bg-slate-900/50 backdrop-blur-sm border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden mb-8 shadow-lg dark:shadow-2xl">
              <div v-if="!isHydrated" class="h-96 flex items-center justify-center">
                <USkeleton class="h-full w-full rounded-none" />
              </div>
              <div v-else ref="mainChartEl" class="w-full h-[500px]" />
            </div>
  
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  
              <!-- Arah Tren -->
              <div class="bg-gray-50 dark:bg-gradient-to-br from-slate-800 to-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
                <div class="text-sm text-gray-500 dark:text-slate-400 mb-2">Arah Tren</div>
                <div class="flex items-center gap-3">
                  <div class="text-4xl font-bold"
                    :class="trend.direction === 'Bullish' ? 'text-emerald-500 dark:text-emerald-400' : trend.direction === 'Bearish' ? 'text-red-500 dark:text-red-400' : 'text-yellow-500 dark:text-yellow-400'">
                    {{ trend.direction }}
                  </div>
                  <UBadge :color="trend.strengthLabel === 'STRONG' ? 'green' : trend.strengthLabel === 'MODERATE' ? 'yellow' : 'red'"
                          size="xl" variant="solid">
                    {{ trend.strengthLabel }}
                  </UBadge>
                </div>
                <div class="text-sm text-gray-500 dark:text-slate-500 mt-2">
                  Kemiringan garis tren {{ trend.trendSlope > 0 ? 'positif' : 'negatif' }} secara konsisten
                </div>
              </div>
  
              <!-- Trend Strength -->
              <div class="bg-gray-50 dark:bg-gradient-to-br from-slate-800 to-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
                <div class="text-sm text-gray-500 dark:text-slate-400 mb-2">Trend Strength</div>
                <div class="text-5xl font-bold font-mono text-indigo-500 dark:text-indigo-400">
                  {{ trend.trendStrength }}<span class="text-2xl opacity-80">/100</span>
                </div>
                <UProgress :value="trend.trendStrength" size="xl" class="mt-4" />
              </div>
  
              <!-- Momentum Status -->
              <div class="bg-gray-50 dark:bg-gradient-to-br from-slate-800 to-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl p-6">
                <div class="text-sm text-gray-500 dark:text-slate-400 mb-2">Momentum Status</div>
                <div class="flex items-center gap-3">
                  <div class="text-4xl font-bold"
                    :class="trend.momentum === 'Increasing' ? 'text-emerald-500 dark:text-emerald-400' : trend.momentum === 'Decreasing' ? 'text-red-500 dark:text-red-400' : 'text-yellow-500 dark:text-yellow-400'">
                    {{ trend.momentum }}
                  </div>
                  <UIcon :name="trend.momentum === 'Increasing' ? 'i-heroicons-arrow-trending-up' :
                                trend.momentum === 'Decreasing' ? 'i-heroicons-arrow-trending-down' :
                                'i-heroicons-minus'" class="w-10 h-10" />
                </div>
                <div class="text-sm text-gray-500 dark:text-slate-500 mt-2">
                  {{ trend.convexity.current === 'Convex' ? 'Momentum beli masih dominan' :
                     trend.convexity.current === 'Concave' ? 'Momentum mulai melemah' : 'Momentum stabil' }}
                </div>
              </div>
  
            </div>
          </template>
        
        <div class="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mt-8">
          <!-- 3. Penjelasan Teoritis Ringkas -->
          <div>
            <h3 class="text-sm font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Penjelasan Teoritis (Singkat)
            </h3>
            <p class="text-gray-600 dark:text-slate-300 text-sm leading-relaxed mt-1">
              Grafik di atas menampilkan fitted trendline hasil linear regression, regression channel, serta marker inflection
              untuk memvisualisasikan dinamika tren dengan lebih akurat. Penjelasan teori dapat dibaca pada halaman:
            </p>

            <ul class="mt-2 text-gray-500 dark:text-slate-400 text-sm list-disc ml-6 space-y-1">
              <li>Halaman <ULink to="/documentation/05-uji-kecekungan">Uji Kecekungan / Turunan Kedua</ULink></li>
              <li>Halaman <ULink to="/documentation/06-polynomial-fit">Polynomial Regression (Smoothing)</ULink></li>
              <li>Halaman <ULink to="/documentation/09-interpretasi-grafik">Interpretasi Grafik</ULink></li>
            </ul>
          </div>

        </div>

        <!-- Disclaimer -->
        <UserDisclaimer />
      </div>

      <OnboardingModal
    :open="showModal"
    title="Panduan Singkat – Deteksi Tren"
    @close="closeModal"
    @go-to-guide="goToGuide"
  >
    <div class="space-y-5 text-base leading-relaxed">

      <p class="text-gray-800 dark:text-gray-200">
        Halaman ini menjawab pertanyaan paling penting:<br>
        <strong class="text-black dark:text-white">“Sekarang harga sedang naik, turun, atau sideways?”</strong>
      </p>

      <div class="bg-gray-100 dark:bg-gray-800/70 rounded-xl p-5 space-y-4 border border-gray-300 dark:border-gray-700">
        <div class="flex items-start gap-4">
          <div class="w-11 h-11 rounded-full bg-green-500/15 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-lg shrink-0">
            ↑
          </div>
          <div>
            <strong class="text-gray-900 dark:text-white">Garis merah naik → Tren NAIK</strong>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Harga cenderung terus naik</p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-11 h-11 rounded-full bg-red-500/15 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-lg shrink-0">
            ↓
          </div>
          <div>
            <strong class="text-gray-900 dark:text-white">Garis merah turun → Tren TURUN</strong>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Harga cenderung terus jatuh</p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-11 h-11 rounded-full bg-yellow-500/15 dark:bg-yellow-500/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold text-lg shrink-0">
            →
          </div>
          <div>
            <strong class="text-gray-900 dark:text-white">Garis merah datar → SIDEWAYS</strong>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Harga bolak-balik, belum ada arah jelas</p>
          </div>
        </div>
      </div>

      <p class="text-gray-800 dark:text-gray-200">
        Kamu cukup lihat tiga hal ini:<br>
        • <strong class="text-black dark:text-white">Arah garis merah</strong> (naik/turun/datar)<br>
        • <strong class="text-black dark:text-white">Trend Strength</strong> (angka 0–100, semakin tinggi = semakin kuat)<br>
        • <strong class="text-black dark:text-white">Momentum Status</strong> (Increasing = makin kencang, Decreasing = melemah)
      </p>

      <p class="text-gray-800 dark:text-gray-200">
        Kamu bisa zoom in/zoom out grafik untuk melihat chart yang lebih panjang
      </p>

      <p class="text-sm italic text-gray-600 dark:text-gray-400">
        Untuk panduan lebih lengkap, anda bisa klik <b>Baca Panduan</b>.
      </p>

    </div>
  </OnboardingModal>
    </template>
  </UDashboardPanel>
</template>