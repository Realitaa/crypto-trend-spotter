<script setup lang="ts">
  definePageMeta({ layout: 'navigation' })

  // Global state
  const { selected } = useSelectedCoin()
  const { timeframe } = useTimeframe()
  const { showModal, closeModal, goToGuide } = useOnboarding('convexity', '/guide/pconvexity')
  
  // Coin selectors
  const coinId = computed(() => selected.value?.id || 'bitcoin')
  const coinLabel = computed(() => selected.value?.label || 'Bitcoin')

  watch(coinLabel, (label) => {
    useSeoMeta({
      title: `Uji Konveksitas ${label}`
    })
  }, { immediate: true })
  
  // Hydration guard
  const isHydrated = ref(false)
  onMounted(() => setTimeout(() => isHydrated.value = true, 200))
  
  // Theme system
  const colorMode = useColorMode()
  const isDark = computed(() => colorMode.value === 'dark')
  
  // Helper: read CSS vars
  const cssVar = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  
  const chartColors = computed(() => ({
    bg: cssVar('--chart-bg'),
    text: cssVar('--chart-text'),
    grid: cssVar('--chart-grid')
  }))
  
  // Route params
  const route = useRoute()
  const tf = computed(() => route.params.tf || '1d')
  
  // Fetch convexity data
  const { data, pending } = useFetch(
    () => `/api/convexity/${coinId.value}/${tf.value}`,
    {
      key: () => `convexity-${coinId.value}-${tf.value}`,
      watch: [coinId, tf],
      server: false,
    }
  )
  
  const convexity = computed(() => data.value)
  const points = computed(() => convexity.value?.points || [])
  const metrics = computed(() => convexity.value?.metrics || {})
  
  // Chart containers
  const priceChartEl = ref(null)
  const secondChartEl = ref(null)
  const heatmapEl = ref(null)
  
  // Composable charts
  const priceChart = useLightweightChartV5(priceChartEl, { height: 300 })
  const derivativeChart = useLightweightChartV5(secondChartEl, { height: 200 })
  const heatmapChart = useLightweightChartV5(heatmapEl, { height: 140 })

  // Ringkasan
  const summaryText = computed(() => {
  if (!metrics.value) return ''

  const score = metrics.value.score ?? 0
  const norm = metrics.value.normalizedScore ?? 0
  const stability = metrics.value.stability ?? 0
  const dir = metrics.value.direction || 'Flat'

  // Tentukan deskripsi arah kelengkungan
  let directionText = ''
  if (dir === 'Convex') {
    directionText = 'momentum pasar sedang menguat'
  } else if (dir === 'Concave') {
    directionText = 'momentum pasar sedang melemah'
  } else {
    directionText = 'kelengkungan grafik berada pada zona datar dan rawan reversal'
  }

  return `
    Uji konveksitas menunjukkan bahwa kurva harga saat ini berada dalam kondisi ${dir.toLowerCase()} 
    (f'' = ${score.toFixed(4)}), yang berarti ${directionText}. 
    Normalized score sebesar ${norm.toFixed(3)} menempatkan kekuatan kelengkungan pada kategori 
    ${norm < 0.2 ? 'bearish ringan' : norm < 0.5 ? 'netral' : 'bullish menguat'}. 
    Stability index ${stability}/100 menunjukkan bahwa pola kelengkungan ini 
    ${stability >= 70 ? 'cukup konsisten tanpa banyak perubahan arah' 
                      : stability >= 40 ? 'mulai menunjukkan ketidakstabilan' 
                                        : 'sangat fluktuatif dan berisiko reversal'}.
  `
})

  
  watch([isHydrated, points, isDark], async ([hydrated]) => {
    if (!hydrated || points.value.length === 0) return
    await nextTick()
  
    // =============== PRICE CHART ===============
    const priceApi = await priceChart.init({
      layout: {
        background: { color: chartColors.value.bg },
        textColor: chartColors.value.text
      },
      grid: {
        vertLines: { color: chartColors.value.grid },
        horzLines: { color: chartColors.value.grid }
      },
      height: 300
    })
  
    const raw = priceApi.addLineSeries({
      color: isDark.value ? '#64748b' : '#94a3b8',
      lineWidth: 1
    })
  
    const fit = priceApi.addLineSeries({
      color: isDark.value ? '#818cf8' : '#6366f1',
      lineWidth: 2
    })
  
    raw.setData(points.value.map(p => ({ time: p.time, value: p.rawPrice })))
    fit.setData(points.value.map(p => ({ time: p.time, value: p.fittedPrice })))
  
    // =============== SECOND DERIVATIVE CHART ===============
    const derivativeApi = await derivativeChart.init({
      layout: {
        background: { color: chartColors.value.bg },
        textColor: chartColors.value.text
      },
      grid: {
        vertLines: { color: chartColors.value.grid },
        horzLines: { color: chartColors.value.grid }
      },
      height: 200
    })
  
    const sd = derivativeApi.addLineSeries({
      color: isDark.value ? '#34d399' : '#10b981',
      lineWidth: 2
    })
  
    sd.setData(points.value.map(p => ({ time: p.time, value: p.secondDerivative })))
  
    // =============== HEATMAP HISTOGRAM ===============
    const heatmapApi = await heatmapChart.init({
      layout: {
        background: { color: chartColors.value.bg },
        textColor: chartColors.value.text
      },
      grid: { vertLines: { color: 'transparent' }, horzLines: { color: 'transparent' } },
      height: 40
    })
  
    const histogram = heatmapApi.addHistogramSeries({
      priceScaleId: '',
      priceFormat: { type: 'volume' }
    })
  
    histogram.setData(
      points.value.map(p => ({
        time: p.time,
        value: Math.abs(p.secondDerivative),
        color:
          p.secondDerivative >= 0
            ? (isDark.value
                ? `rgba(16, 185, 129, ${0.27 + Math.min(.7, Math.abs(p.secondDerivative)*4)})`
                : `rgba(16, 185, 129, ${0.27 + Math.min(.7, Math.abs(p.secondDerivative)*4)})`)
            : (isDark.value
                ? `rgba(244, 63, 94, ${0.27 + Math.min(.7, Math.abs(p.secondDerivative)*4)})`
                : `rgba(239, 68, 68, ${0.27 + Math.min(.7, Math.abs(p.secondDerivative)*4)})`)
      }))
    )
  })
  
  // Cleanup
  onBeforeUnmount(() => {
    priceChart?.remove?.()
    derivativeChart?.remove?.()
    heatmapChart?.remove?.()
  })
  </script>
  
  <template>
    <UDashboardPanel :ui="{ body: 'w-full max-w-none px-0' }">
      <template #header>
        <AppNavbar />
      </template>
  
      <template #body>
        <div class="p-6 lg:p-8">
          <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Uji Konveksitas — {{ coinLabel }}</h1>

          <!-- INFORMATION CONTAINER -->
          <div class="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mb-8">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ringkasan Analisis</h2>
              <p class="text-gray-600 dark:text-slate-300" v-if="!isHydrated">Analisis belum tersedia, menunggu data dari server.</p>
              <p class="text-gray-600 dark:text-slate-300 leading-relaxed" v-else>{{ summaryText }}</p>
            </div>
          </div>  
  
          <!-- LOADING -->
          <template v-if="!isHydrated">
            <USkeleton class="h-6 w-40" />
            <USkeleton class="h-64 w-full mt-6" />
          </template>
  
          <!-- CONTENT -->
          <template v-else-if="convexity">
            <!-- Metrics -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
  
              <div class="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
                <div class="text-sm text-gray-500 dark:text-slate-400">Convexity Score (f'')</div>
                <div class="text-3xl font-mono font-bold mt-1 text-gray-900 dark:text-white">{{ metrics.score?.toFixed(6) }}</div>
              </div>
  
              <div class="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
                <div class="text-sm text-gray-500 dark:text-slate-400">Normalized Score (0–1)</div>
                <div class="text-3xl font-mono font-bold mt-1 text-gray-900 dark:text-white">{{ metrics.normalizedScore?.toFixed(3) }}</div>
              </div>
  
              <div class="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
                <div class="text-sm text-gray-500 dark:text-slate-400">Stability</div>
                <div class="text-3xl font-mono font-bold mt-1 text-gray-900 dark:text-white">{{ metrics.stability }}/100</div>
              </div>
  
            </div>
  
            <!-- PRICE CHART -->
            <div class="bg-white dark:bg-slate-900/40 p-4 rounded-xl border border-gray-200 dark:border-slate-700 mb-10">
              <h2 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Harga vs Fitted Curve</h2>
              <div v-if="!isHydrated"><USkeleton class="h-64 w-full" /></div>
              <div v-else ref="priceChartEl" class="w-full h-[300px]"></div>
            </div>
  
            <!-- HEATMAP -->
            <div class="bg-white dark:bg-slate-900/40 p-4 rounded-xl border border-gray-200 dark:border-slate-700 mb-10">
              <h2 class="text-lg font-semibold mb-1 text-gray-900 dark:text-white">Convexity Heatmap</h2>
              <div v-if="!isHydrated"><USkeleton class="h-40 w-full" /></div>
              <div v-else ref="heatmapEl" class="w-full h-[140px]"></div>
            </div>
  
            <!-- SECOND DERIVATIVE CHART -->
            <div class="bg-white dark:bg-slate-900/40 p-4 rounded-xl border border-gray-200 dark:border-slate-700 mb-10">
              <h2 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Turunan Kedua f''(x)</h2>
              <div v-if="!isHydrated"><USkeleton class="h-40 w-full" /></div>
              <div v-else ref="secondChartEl" class="w-full h-[200px]"></div>
            </div>
  
          </template>
          
          <div class="bg-white dark:bg-slate-900/60 border border-gray-200 dark:border-slate-700 rounded-xl p-6 mt-8">
            <!-- 3. Penjelasan Teoritis Ringkas -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Penjelasan Teoritis (Singkat)
              </h3>
              <p class="text-gray-600 dark:text-slate-300 text-sm leading-relaxed mt-1">
                Grafik di atas menampilkan fitted curve hasil polynomial regression serta heatmap convexity 
                untuk memperlihatkan distribusi percepatan momentum sepanjang waktu. 
                Penjelasan teori lebih lengkap:
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
          title="Panduan Singkat – Uji Konveksitas"
          @close="closeModal"
          @go-to-guide="goToGuide"
        >
          <div class="space-y-5 text-base leading-relaxed">

            <p class="text-gray-800 dark:text-gray-200">
              Halaman ini menjawab satu pertanyaan penting:<br>
              <strong class="text-black dark:text-white">“Apakah tren harga sedang melambat atau malah semakin kuat?”</strong>
            </p>

            <div class="bg-gray-100 dark:bg-gray-800/70 rounded-xl p-5 space-y-4 border border-gray-300 dark:border-gray-700">
              <div class="flex items-start gap-4">
                <div class="w-11 h-11 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg shrink-0">
                  1
                </div>
                <div>
                  <strong class="text-gray-900 dark:text-white">Jika grafik harga melengkung ke atas →</strong>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Tren naik semakin kuat (bullish makin kencang)
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-11 h-11 rounded-full bg-red-500/15 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-lg shrink-0">
                  2
                </div>
                <div>
                  <strong class="text-gray-900 dark:text-white">Jika grafik harga melengkung ke bawah →</strong>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Tren turun semakin dalam (bearish makin cepat)
                  </p>
                </div>
              </div>
            </div>

            <p class="text-gray-800 dark:text-gray-200">
              Kamu cukup lihat:
              <br>• <strong class="text-black dark:text-white">Warna merah/hijau di Heatmap</strong>
              <br>• <strong class="text-black dark:text-white">Angka Stability (81/100 = sangat stabil)</strong>
              <br>→ langsung tahu apakah tren saat ini bisa dipercaya atau hanya sementara.
            </p>

            <p class="text-gray-800 dark:text-gray-200">
              Kamu bisa zoom in/zoom out grafik untuk melihat chart yang lebih panjang
            </p>

            <p class="text-sm italic text-gray-600 dark:text-gray-400">
              Ingin tahu apa itu “konveksitas”, “fitted curve”, dan “heatmap” secara matematis? Klik <strong class="text-black dark:text-white">Baca Panduan</strong> untuk penjelasan lengkapnya!
            </p>

          </div>
        </OnboardingModal>
      </template>
    </UDashboardPanel>
  </template>
  