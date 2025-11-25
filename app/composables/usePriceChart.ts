// composables/usePriceChart.ts ← VERSI FINAL
import { type Ref } from 'vue'

export const usePriceChart = (coinId: Ref<string> | string) => {
  const timeframe = ref<'5m' | '1h' | '1d' | '7d' | '30d' | '1y'>('1d')

  const coin = computed(() => typeof coinId === 'string' ? coinId : coinId.value)

  const { data, pending, error, refresh } = useFetch(() => `/api/price/${coin.value}/${timeframe.value}`, {
    key: () => `price-${coin.value}-${timeframe.value}`,
    watch: [coin, timeframe],
    server: false,
    default: () => [],
  })

  const chartData = computed(() => data.value || [])

  const lastUpdated = computed(() => {
    if (!data.value?.length) return 'Loading...'
    const last = data.value[data.value.length - 1]
    return new Date(last.time * 1000).toLocaleString('id-ID')
  })

  return {
    timeframe: readonly(timeframe),
    timeframeWritable: timeframe,  
    chartData,
    pending,
    error,
    refresh,
    lastUpdated,
  }
}