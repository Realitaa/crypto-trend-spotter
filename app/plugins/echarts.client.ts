// app/plugins/echarts.client.ts
import { defineNuxtPlugin } from '#app'
import VueECharts from 'vue-echarts'
import * as echarts from 'echarts/core'

// charts
import { LineChart, BarChart } from 'echarts/charts'

// components
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  AxisPointerComponent,
  DatasetComponent,
  VisualMapComponent
} from 'echarts/components'

// renderer
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  ToolboxComponent,
  AxisPointerComponent,
  DatasetComponent,
  VisualMapComponent,
  CanvasRenderer
])

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VChart', VueECharts)
  // also expose echarts if needed
  return {
    provide: {
      echarts
    }
  }
})
