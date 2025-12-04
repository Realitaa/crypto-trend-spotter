import { useTimeframe } from './useTimeframe'

export const usePriceChart = (coinId: Ref<string> | string) => {
  const { timeframe } = useTimeframe()
  const coin = computed(() => typeof coinId === 'string' ? coinId : coinId.value)

  const { data, pending, error, refresh } = useFetch(
    () => `/api/price/${coin.value}/${timeframe.value}`,
    {
      key: () => `price-${coin.value}-${timeframe.value}`,
      watch: [coin, timeframe],
      server: false,
      default: () => [],
    }
  )

  const chartData = computed(() => data.value || [])

  const lastUpdated = computed(() => {
    if (!data.value?.length) return 'Loading...'
    const last = data.value[data.value.length - 1]
    return new Date(last.time * 1000).toLocaleString('en-GB', {
      timeZone: 'UTC',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short',
    })
  })

  return { chartData, pending, error, refresh, lastUpdated }
}