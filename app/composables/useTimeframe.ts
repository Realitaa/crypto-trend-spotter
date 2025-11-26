import { onMounted } from 'vue'

export const useTimeframe = () => {
  const items = [
    { label: '5M', value: '5m' },
    { label: '1H', value: '1h' },
    { label: '1D', value: '1d' }, // default
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '1Y', value: '1y' },
  ]

  const timeframe = useState<'5m' | '1h' | '1d' | '7d' | '30d' | '1y'>('chart-timeframe', () => '1d')

  const setTimeframe = (tf: typeof timeframe.value) => {
    timeframe.value = tf
    if (process.client) {
      localStorage.setItem('chart-timeframe', tf)
    }
  }

  // Sync localStorage setelah hydration
  if (process.client) {
    onMounted(() => {
      const savedTf = localStorage.getItem('chart-timeframe')
      if (savedTf && items.some(item => item.value === savedTf)) {
        setTimeframe(savedTf as any)
      } else {
        setTimeframe('1d')
      }
    })
  }

  return {
    timeframe, // mutable — no readonly!
    setTimeframe,
    items,
  }
}