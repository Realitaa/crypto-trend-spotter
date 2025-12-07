export function useLightweightChartV5(containerRef: any, options: any = {}) {
  const chart = ref<any>(null)
  const series = ref<any[]>([])
  const api = ref<any>(null)

  // Ensure chart builds only on client
  async function init() {
    if (!containerRef.value) return

    // Dynamic import — SSR safe
    const {
      createChart,
      LineSeries,
      AreaSeries,
      HistogramSeries,
      BaselineSeries,
      BarSeries,
      CandlestickSeries,
    } = await import('lightweight-charts')

    // Cleanup old chart
    api.value?.remove?.()

    // Create chart
    api.value = createChart(containerRef.value, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#cbd5e1',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      ...options,
    })

    chart.value = api.value
    series.value = []

    // Series factory
    function addLineSeries(opts: any = {}) {
      const s = api.value.addSeries(LineSeries, opts)
      series.value.push(s)
      return s
    }

    function addAreaSeries(opts: any = {}) {
      const s = api.value.addSeries(AreaSeries, opts)
      series.value.push(s)
      return s
    }

    function addHistogramSeries(opts: any = {}) {
      const s = api.value.addSeries(HistogramSeries, opts)
      series.value.push(s)
      return s
    }

    function addCandlestickSeries(opts: any = {}) {
      const s = api.value.addSeries(CandlestickSeries, opts)
      series.value.push(s)
      return s
    }

    return {
      addLineSeries,
      addAreaSeries,
      addHistogramSeries,
      addCandlestickSeries,
    }
  }

  // Auto init onMounted
  onMounted(async () => {
    await nextTick()
    await init()
  })

  // Remove chart on unmount
  onBeforeUnmount(() => {
    api.value?.remove?.()
  })

  return {
    chart,
    init,
  }
}
