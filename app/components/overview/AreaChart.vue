<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import type { IChartApi, ISeriesApi} from 'lightweight-charts';
import { createChart, ColorType, AreaSeries } from 'lightweight-charts'

const props = defineProps<{
  data: { time: string; value: number }[]
  height?: number
}>()

const chartContainer = ref<HTMLDivElement>()
let chart: IChartApi | null = null
let areaSeries: ISeriesApi<'Area'> | null = null

const initChart = () => {
  if (!chartContainer.value) return

  // Bersihkan chart lama jika ada
  if (chart) {
    chart.remove()
  }

  chart = createChart(chartContainer.value, {
    layout: {
      background: { type: ColorType.Solid, color: '#0f0f1a' },
      textColor: '#d1d4dc',
      fontSize: 12,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    grid: {
      vertLines: { visible: false },
      horzLines: { color: '#1e1e2e', style: 1 },
    },
    width: chartContainer.value.clientWidth,
    height: props.height || 400,
    handleScroll: false,
    handleScale: false,
    rightPriceScale: {
      borderVisible: false,
    },
    timeScale: {
      borderVisible: false,
      timeVisible: true,
      secondsVisible: false,
    },
    crosshair: {
      mode: 1, // Normal
      vertLine: { width: 1, color: '#6c757d', style: 1 },
      horzLine: { width: 1, color: '#6c757d', style: 1 },
    },
  })

  // PERBAIKAN: Gunakan addSeries dengan AreaSeries type (API v5.0+)
  areaSeries = chart.addSeries(AreaSeries, {
    topColor: 'rgba(147, 51, 234, 0.4)',
    bottomColor: 'rgba(147, 51, 234, 0.0)',
    lineColor: '#9333ea',
    lineWidth: 3,
    priceLineVisible: false,
    lastValueVisible: false,
  })

  if (props.data && props.data.length > 0) {
    areaSeries.setData(props.data)
  }

  // Auto scale
  chart.timeScale().fitContent()
}

onMounted(() => {
  initChart()

  // Resize handler
  const handleResize = () => {
    if (chart && chartContainer.value) {
      chart.applyOptions({ width: chartContainer.value.clientWidth })
    }
  }
  window.addEventListener('resize', handleResize)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    if (chart) {
      chart.remove()
      chart = null
    }
  })
})

watch(() => props.data, (newData) => {
  if (areaSeries && newData && newData.length > 0) {
    areaSeries.setData(newData)
    chart?.timeScale().fitContent()
  }
}, { deep: true })
</script>

<template>
  <div class="lightweight-chart">
    <div ref="chartContainer" class="chart-container" />
  </div>
</template>

<style scoped>
.lightweight-chart {
  width: 100%;
  border-radius: 12px;
  background: #0f0f1a;
  padding: 20px;
  box-sizing: border-box;
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>