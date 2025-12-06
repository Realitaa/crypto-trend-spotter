<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from "vue"
import { useColorMode } from "#imports"

const props = defineProps<{
  velocity: { time: number; value: number }[]
  acceleration: { time: number; value: number }[]
  isHydrated: boolean
}>()

const chartRef = ref<HTMLElement | null>(null)
let chartInstance = null
let echarts = null
let resizeObserver = null

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === "dark")

// Format velocity data (bar series)
const velocityData = computed(() =>
  props.velocity.map(p => ({
    value: [p.time * 1000, p.value],
    itemStyle: {
      color:
        p.value >= 0
          ? isDark.value ? "#10b981" : "#059669" // green
          : isDark.value ? "#f87171" : "#dc2626" // red
    }
  }))
)

// Format acceleration data (line)
const accelerationData = computed(() =>
  props.acceleration.map(p => [p.time * 1000, p.value])
)

function generateOption() {
  const axisColor = isDark.value ? "#94a3b8" : "#475569"
  const gridColor = isDark.value ? "#334155" : "#e5e7eb"
  const bgColor = isDark.value ? "#0f172a" : "#ffffff"
  const accelColor = isDark.value ? "#a855f7" : "#7e22ce"

  return {
    backgroundColor: bgColor,
    animation: false,

    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross" },
      valueFormatter: (v) => `${v.toFixed(4)}%`
    },

    axisPointer: {
      link: [{ xAxisIndex: [0] }],
      label: { backgroundColor: "#6b7280" }
    },

    grid: {
      left: 50,
      right: 40,
      top: 30,
      bottom: 30
    },

    xAxis: {
      type: "time",
      axisLabel: { color: axisColor },
      axisLine: { lineStyle: { color: axisColor }},
      splitLine: { show: true, lineStyle: { color: gridColor }},
    },

    yAxis: [
      {
        type: "value",
        name: "Velocity (%)",
        position: "left",
        axisLabel: { color: axisColor },
        axisLine: { lineStyle: { color: axisColor }},
        splitLine: { show: true, lineStyle: { color: gridColor }},
        scale: true
      },
      {
        type: "value",
        name: "Acceleration (%)",
        position: "right",
        axisLabel: { color: axisColor },
        axisLine: { lineStyle: { color: axisColor }},
        splitLine: { show: false },
        scale: true
      }
    ],

    series: [
      {
        type: "bar",
        name: "Velocity",
        data: velocityData.value,
        barWidth: "60%",
        yAxisIndex: 0
      },
      {
        type: "line",
        name: "Acceleration",
        data: accelerationData.value,
        yAxisIndex: 1,
        lineStyle: {
          width: 2,
          type: "dashed",
          color: accelColor
        },
        showSymbol: false
      }
    ]
  }
}

// ====== CROSSHAIR SYNC ======

function syncFromPrice(e) {
  const time = e.detail?.time
  if (!time || !chartInstance) return

  chartInstance.dispatchAction({
    type: "updateAxisPointer",
    currTrigger: "axis",
    xAxisInfo: { value: time }
  })
}

function setupEmitSync(instance) {
  instance.on("updateAxisPointer", (event) => {
    if (!event.axesInfo?.length) return
    const time = event.axesInfo[0].value

    window.dispatchEvent(
      new CustomEvent("analysis-sync", {
        detail: { time }
      })
    )
  })
}

// ====== MOUNT CHART SAFELY ======

async function mountChart() {
  if (!props.isHydrated) return
  await nextTick()
  if (!chartRef.value) return

  if (!echarts) {
    echarts = await import("echarts")
  }

  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(generateOption())

  setupEmitSync(chartInstance)

  resizeObserver = new ResizeObserver(() => {
    chartInstance?.resize()
  })
  resizeObserver.observe(chartRef.value)
}

// ====== WATCHERS ======

watch(
  () => [velocityData.value, accelerationData.value, isDark.value],
  () => {
    if (chartInstance) {
      chartInstance.setOption(generateOption(), true)
    }
  }
)

onMounted(async () => {
  window.addEventListener("analysis-crosshair", syncFromPrice)

  if (props.isHydrated) {
    await mountChart()
  }

  watch(
    () => props.isHydrated,
    async (v) => {
      if (v && !chartInstance) {
        await mountChart()
      }
    }
  )
})

onBeforeUnmount(() => {
  window.removeEventListener("analysis-crosshair", syncFromPrice)
  resizeObserver?.disconnect()
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<template>
  <div class="w-full h-[400px] rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">

    <template v-if="!isHydrated">
      <USkeleton class="w-full h-full" />
    </template>

    <template v-else>
      <div ref="chartRef" class="w-full h-full"></div>
    </template>

  </div>
</template>
