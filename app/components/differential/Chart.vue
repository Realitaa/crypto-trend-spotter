<script setup lang="ts">
    import {
      createChart,
      LineSeries
    } from 'lightweight-charts'
    
    const props = defineProps<{
      prices: { time: number; value: number }[]
      velocity: number[]
      acceleration: number[]
      hydrated: boolean
    }>()
    
    const chartContainer = ref<HTMLElement | null>(null)
    let chart: any
    let priceSeries: any
    let velocitySeries: any
    let accelerationSeries: any
    
    // format time to Lightweight { time: unix } format
    function formatPriceData() {
      return props.prices.map((p, i) => ({
        time: p.time,
        value: p.value
      }))
    }
    
    function formatVelocityData() {
      return props.prices.map((p, i) => ({
        time: p.time,
        value: props.velocity[i] ?? 0
      }))
    }
    
    function formatAccelerationData() {
      return props.prices.map((p, i) => ({
        time: p.time,
        value: props.acceleration[i] ?? 0
      }))
    }
    
    function renderChart() {
      if (!props.hydrated) return
      if (!chartContainer.value) return
    
      // destroy old chart if exists
      if (chart) {
        chart.remove()
        chart = null
      }
    
      chart = createChart(chartContainer.value, {
        autoSize: true,
        layout: {
          background: { color: 'transparent' },
          textColor: '#94a3b8',
        },
        grid: {
          vertLines: { color: '#334155' },
          horzLines: { color: '#334155' }
        }
      })
    
      // --- price series
      priceSeries = chart.addSeries(LineSeries, {
        color: '#3b82f6',
        lineWidth: 2
      })
      priceSeries.setData(formatPriceData())
    
      // --- velocity series
      velocitySeries = chart.addSeries(LineSeries, {
        color: '#10b981',
        lineWidth: 1
      })
      velocitySeries.setData(formatVelocityData())
    
      // --- acceleration series
      accelerationSeries = chart.addSeries(LineSeries, {
        color: '#a855f7',
        lineWidth: 1,
        lineStyle: 1 // dashed
      })
      accelerationSeries.setData(formatAccelerationData())
    }
    
    // Watch for updates
    watch(() => [props.prices, props.velocity, props.acceleration], () => {
      if (props.hydrated) renderChart()
    })
    
    onMounted(() => {
      if (props.hydrated) {
        setTimeout(renderChart, 50)
      }
    })
    
    onUnmounted(() => {
      if (chart) chart.remove()
    })
    </script>
    
    <template>
      <div class="w-full h-[400px] md:h-[500px]" ref="chartContainer">
      </div>
    </template>
    