<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from "vue"
import { useColorMode } from "#imports"

const props = defineProps<{
  data: { time: number; value: number }[]
  smoothed: { time: number; value: number }[]
  enableSmoothing: boolean
  isHydrated: boolean
}>()

const chartRef = ref<HTMLElement | null>(null)
let chartInstance = null
let echarts = null
let resizeObserver = null

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === "dark")

// Format data
const formattedData = computed(() => {
  const source = props.enableSmoothing ? props.smoothed : props.data
  return source.map(p => [p.time * 1000, p.value])
})

function generateOption() {
  const lineColor = isDark.value ? "#3b82f6" : "#2563eb"
  const axisColor = isDark.value ? "#94a3b8" : "#64748b"
  const gridColor = isDark.value ? "#334155" : "#e2e8f0"
  const bgColor = isDark.value ? "#0f172a" : "#ffffff"

  return {
    backgroundColor: bgColor,
    animation: false,

    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" }
    },

    xAxis: {
      type: "time",
      axisLine: { lineStyle: { color: axisColor }},
      axisLabel: { color: axisColor },
      splitLine: { show: true, lineStyle: { color: gridColor }},
    },

    yAxis: {
      type: "value",
      axisLine: { lineStyle: { color: axisColor }},
      axisLabel: { color: axisColor },
      splitLine: { show: true, lineStyle: { color: gridColor }},
      scale: true
    },

    series: [
      {
        type: "line",
        data: formattedData.value,
        lineStyle: { width: 2, color: lineColor },
        showSymbol: false
      }
    ]
  }
}

async function mountChart() {
  // 1. pastikan DOM sudah ada
  if (!props.isHydrated) return
  await nextTick()
  if (!chartRef.value) return

  // 2. pastikan echarts sudah ter-load
  if (!echarts) {
    echarts = await import("echarts")
  }

  // 3. buat instance chart
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(generateOption())

  // 4. autoresize
  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize()
  })
  resizeObserver.observe(chartRef.value)
}

watch(
  () => [formattedData.value, isDark.value, props.enableSmoothing],
  () => {
    if (chartInstance) {
      chartInstance.setOption(generateOption(), true)
    }
  }
)

onMounted(async () => {
  if (props.isHydrated) {
    await mountChart()
  }

  watch(
    () => props.isHydrated,
    async (v) => {
      if (v) {
        await mountChart()
      }
    }
  )
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<template>
  <div class="w-full h-[360px] rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
    <template v-if="!isHydrated">
      <USkeleton class="w-full h-full" />
    </template>

    <template v-else>
      <div ref="chartRef" class="w-full h-full"></div>
    </template>
  </div>
</template>
