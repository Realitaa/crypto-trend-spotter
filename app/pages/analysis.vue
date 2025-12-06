<script setup lang="ts">
definePageMeta({
  layout: 'navigation'
})

import { ref, onMounted, watch, computed } from 'vue'
import { useSelectedCoin, useTimeframe } from '#imports'
import { useDifferentialAnalysis } from '~/composables/useDifferentialAnalysis'

// ============================
// GLOBAL STATES
// ============================
const { selected } = useSelectedCoin()
const { timeframe, items } = useTimeframe()

const coinId = computed(() => selected.value?.id || 'bitcoin')
const coinLabel = computed(() => selected.value?.label || 'Bitcoin')

// ============================
// PRICE FETCHING
// ============================
const { data: ticker, pending: tickerPending } = useFetch(
  () => `/api/ticker/${coinId.value}`,
  { key: () => `ticker-${coinId.value}`, server: false, watch: [coinId] }
)

const currentPrice = computed(() => ticker.value?.price || 0)
const change24h = computed(() => ticker.value?.change24h || 0)

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)

// ============================
// HYDRATION
// ============================
const isHydrated = ref(false)
onMounted(() => setTimeout(() => (isHydrated.value = true), 300))

// ============================
// DIFFERENTIAL ENGINE
// ============================
const {
  rawPrice,
  smoothedPrice,
  velocitySeries,
  accelerationSeries,
  summary,
  compute
} = useDifferentialAnalysis()

// ============================
// ANALYSIS PARAMETERS
// ============================
const params = ref({
  method: 'Central',
  enableSmoothing: false,
  maLength: 5
})

// ============================
// FETCH PRICE DATA (SERVER)
// ============================
const loading = ref(false)

async function fetchData() {
  loading.value = true
  try {
    const data = await $fetch(`/api/price/${coinId.value}/${timeframe.value}`)

    compute(data, {
      method: params.value.method,
      enableSmoothing: params.value.enableSmoothing,
      smoothingLength: params.value.maLength
    })
  } catch (e) {
    console.error("Fetch error:", e)
  } finally {
    loading.value = false
  }
}

// refetch when TF or coin changes
watch([coinId, timeframe], () => fetchData())
onMounted(() => fetchData())

// ============================
// RECALCULATE (LOCAL ONLY)
// ============================
function handleRecalculate() {
  if (!rawPrice.value.length) return

  compute(rawPrice.value, {
    method: params.value.method,
    enableSmoothing: params.value.enableSmoothing,
    smoothingLength: params.value.maLength
  })
}

// auto recompute when params change
watch(
  params,
  () => handleRecalculate(),
  { deep: true }
)
</script>

<template>
  <UDashboardPanel :ui="{ body: 'w-full max-w-none px-0' }">

    <!-- HEADER -->
    <template #header>
      <AppNavbar />
    </template>

    <!-- BODY -->
    <template #body>
      <div class="w-full p-6 lg:p-8 text-slate-800 dark:text-slate-200">

        <!-- SKELETON BEFORE HYDRATION -->
        <template v-if="!isHydrated">
          <USkeleton class="h-10 w-64" />
          <USkeleton class="h-10 w-56 mt-2" />
          <USkeleton class="h-64 w-full mt-6" />
          <USkeleton class="h-64 w-full mt-6" />
        </template>

        <!-- CONTENT AFTER HYDRATION -->
        <template v-else>

          <!-- TITLE + LABEL -->
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-2xl font-bold">Analisis Diferensial</h1>
              <p class="text-sm text-muted">
                Perhitungan turunan 1 & 2 untuk 
                <span class="font-semibold text-primary">{{ coinLabel }}</span>.
              </p>
            </div>
          </div>

          <!-- CURRENT PRICE -->
          <section class="mb-8">
            <p class="text-sm text-slate-500">Harga Saat Ini</p>

            <div class="flex items-center gap-3 mt-1">
              <span class="text-4xl font-bold">
                <template v-if="tickerPending">
                  <USkeleton class="h-12 w-48 inline-block" />
                </template>
                <template v-else>
                  {{ formatCurrency(currentPrice) }}
                </template>
              </span>

              <UBadge 
                :color="change24h >= 0 ? 'success' : 'error'" 
                variant="soft" size="lg">
                {{ change24h > 0 ? '+' : '' }}{{ change24h }}%
              </UBadge>
            </div>
          </section>

          <!-- PARAMETERS PANEL -->
          <AnalysisParametersPanel 
            v-model="params"
            @recalculate="handleRecalculate"
          />

          <!-- SUMMARY CARDS -->
          <AnalysisSummaryCards
            :velocity="summary.velocity"
            :acceleration="summary.acceleration"
            :trend="summary.trend"
            :confidence="summary.confidence"
            :insight="summary.insight"
          />

          <!-- PRICE CHART -->
          <section class="mt-6">
            <h3 class="text-lg font-semibold mb-2">Grafik Harga</h3>

            <AnalysisPriceChartE
              :data="rawPrice"
              :smoothed="smoothedPrice"
              :enable-smoothing="params.enableSmoothing"
              :is-hydrated="isHydrated"
            />
          </section>

          <!-- DERIVATIVE CHART -->
          <section class="mt-8">
            <h3 class="text-lg font-semibold mb-2">Turunan 1 & 2</h3>

            <AnalysisDerivativesChartE
              :velocity="velocitySeries"
              :acceleration="accelerationSeries"
              :is-hydrated="isHydrated"
            />
          </section>

        </template>
      </div>
    </template>

  </UDashboardPanel>
</template>
