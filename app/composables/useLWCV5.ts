// composables/useLWCV5.ts
import { ref, onBeforeUnmount } from 'vue'

export function useLWCV5(containerRef: any, defaultOptions: any = {}) {
  const api = ref<any>(null)

  async function init(override: any = {}) {
    if (!containerRef.value) {
      console.warn('Chart init skipped — containerRef is NULL')
      return null
    }

    const {
      createChart,
      LineSeries,
      AreaSeries,
      HistogramSeries,
      BarSeries,
      BaselineSeries,
      CandlestickSeries,
    } = await import('lightweight-charts')

    // Destroy previous chart if exists
    api.value?.remove?.()

    const finalOptions = {
      layout: {
        background: { color: 'transparent' },
        textColor: '#cbd5e1',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      ...defaultOptions,
      ...override,
    }

    api.value = createChart(containerRef.value, finalOptions)

    return {
      addLineSeries: (opts: any = {}) => api.value.addSeries(LineSeries, opts),
      addAreaSeries: (opts: any = {}) => api.value.addSeries(AreaSeries, opts),
      addHistogramSeries: (opts: any = {}) => api.value.addSeries(HistogramSeries, opts),
      addBarSeries: (opts: any = {}) => api.value.addSeries(BarSeries, opts),
      addBaselineSeries: (opts: any = {}) => api.value.addSeries(BaselineSeries, opts),
      addCandlestickSeries: (opts: any = {}) => api.value.addSeries(CandlestickSeries, opts),

      timeScale: () => api.value.timeScale(),
      priceScale: (id: string = 'right') => api.value.priceScale(id),
      remove: () => api.value?.remove?.(),
    }
  }

  onBeforeUnmount(() => {
    api.value?.remove?.()
  })

  return {
    api,
    init,
  }
}
