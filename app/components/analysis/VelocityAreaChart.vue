<script setup lang="ts">
    import { ref, watch, onMounted, onBeforeUnmount, nextTick, computed } from "vue"
    import { useColorMode } from "#imports"
    
    const props = defineProps<{
      data: { time: number; value: number }[]
      isHydrated: boolean
    }>()
    
    const chartRef = ref<HTMLElement | null>(null)
    let chartInstance = null
    let echarts = null
    let resizeObserver = null
    
    const colorMode = useColorMode()
    const isDark = computed(() => colorMode.value === "dark")
    
    // Format data for ECharts
    const formatted = computed(() =>
      props.data.map(p => [p.time * 1000, p.value])
    )
    
    function option() {
      return {
        backgroundColor: isDark.value ? "#0f172a" : "#ffffff",
        animation: false,
    
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "cross" },
          valueFormatter: v => `${v.toFixed(4)}%`,
        },
    
        xAxis: {
          type: "time",
          axisLabel: { color: isDark.value ? "#cbd5e1" : "#475569" },
          splitLine: { show: false }
        },
    
        yAxis: {
          type: "value",
          axisLabel: { color: isDark.value ? "#cbd5e1" : "#475569" },
          splitLine: { show: true, lineStyle: { color: isDark.value ? "#334155" : "#e2e8f0" }},
          axisLine: { show: false },
          min: value => Math.min(value.min, 0),
          max: value => Math.max(value.max, 0),
          markLine: {
            silent: true,
            data: [{ yAxis: 0 }],
            lineStyle: { color: "#94a3b8", width: 1.5 }
          }
        },
    
        series: [
          {
            type: "line",
            data: formatted.value,
            showSymbol: false,
            lineStyle: { color: isDark.value ? "#4ade80" : "#16a34a", width: 2 },
            areaStyle: {
              color: params =>
                params.value[1] >= 0
                  ? "rgba(74, 222, 128, 0.35)" // hijau
                  : "rgba(248, 113, 113, 0.35)" // merah
            }
          }
        ]
      }
    }
    
    async function mountChart() {
      if (!props.isHydrated) return
      await nextTick()
      if (!chartRef.value) return
    
      if (!echarts) echarts = await import("echarts")
    
      chartInstance = echarts.init(chartRef.value)
      chartInstance.setOption(option())
    
      resizeObserver = new ResizeObserver(() => chartInstance?.resize())
      resizeObserver.observe(chartRef.value)
    }
    
    watch([formatted, isDark], () => {
      if (chartInstance) chartInstance.setOption(option(), true)
    })
    
    onMounted(async () => {
      if (props.isHydrated) await mountChart()
      watch(() => props.isHydrated, async h => h && await mountChart())
    })
    
    onBeforeUnmount(() => {
      resizeObserver?.disconnect()
      chartInstance?.dispose()
    })
    </script>
    
    <template>
      <div class="w-full h-[260px] rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
        <template v-if="!isHydrated">
          <USkeleton class="w-full h-full" />
        </template>
        <template v-else>
          <div ref="chartRef" class="w-full h-full"></div>
        </template>
      </div>
    </template>
    