<script setup lang="ts">
const props = defineProps<{
  velocity: number
  acceleration: number
  trend: 'Bullish' | 'Bearish' | 'Sideways'
  confidence: number
  insight: string
}>()

// Utility: keep formatting consistent
function formatPct(n: number) {
  return Number(n).toFixed(4)
}

// Trend badge class
const trendClass = computed(() => {
  if (props.trend === 'Bullish')
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300/50'
  if (props.trend === 'Bearish')
    return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-300/50'
  return 'bg-slate-100 text-slate-700 dark:bg-slate-700/20 dark:text-slate-300 border border-slate-300/50'
})

// Number color class
function polarityClass(n: number) {
  if (n > 0) return 'text-emerald-500'
  if (n < 0) return 'text-rose-500'
  return 'text-slate-500'
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

    <!-- Velocity -->
    <div class="bg-white dark:bg-slate-800/40 border border-slate-200 
                dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
      <h4 class="text-xs font-semibold text-slate-500 uppercase">Turunan 1 (Velocity)</h4>

      <div class="mt-3 flex items-center gap-3">
        <span class="text-3xl font-bold" :class="polarityClass(velocity)">
          {{ velocity >= 0 ? '+' : '' }}{{ formatPct(velocity) }}%
        </span>
      </div>

      <p :class="['text-sm font-medium mt-1', polarityClass(velocity)]">
        {{ velocity >= 0 ? 'Laju Harga Naik' : 'Laju Harga Turun' }}
      </p>
    </div>

    <!-- Acceleration -->
    <div class="bg-white dark:bg-slate-800/40 border border-slate-200 
                dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
      <h4 class="text-xs font-semibold text-slate-500 uppercase">Turunan 2 (Acceleration)</h4>

      <div class="mt-3 flex items-center gap-3">
        <span class="text-3xl font-bold" :class="polarityClass(acceleration)">
          {{ acceleration >= 0 ? '+' : '' }}{{ formatPct(acceleration) }}%
        </span>
      </div>

      <p :class="['text-sm font-medium mt-1', polarityClass(acceleration)]">
        {{ acceleration >= 0 ? 'Momentum Menguat' : 'Momentum Melemah' }}
      </p>
      <p class="text-xs text-slate-500 mt-1">Mengukur percepatan tren harga.</p>
    </div>

    <!-- Trend Summary -->
    <div class="bg-white dark:bg-slate-800/40 border border-slate-200 
                dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
      <h4 class="text-xs font-semibold text-slate-500 uppercase">Kesimpulan Tren</h4>

      <div class="mt-3">
        <span class="inline-block px-3 py-1 rounded-md text-lg font-bold"
              :class="trendClass">
          {{ trend }}
        </span>
      </div>

      <!-- Meter -->
      <div class="w-full bg-slate-100 dark:bg-slate-700/40 h-2 rounded-full overflow-hidden mt-3">
        <div class="h-full rounded-full transition-all duration-500"
             :class="trend === 'Bullish' ? 'bg-emerald-500' : (trend === 'Bearish' ? 'bg-rose-500' : 'bg-slate-400')"
             :style="`width:${confidence}%`">
        </div>
      </div>

      <div class="flex justify-between text-xs text-slate-500 mt-1">
        <span>Confidence</span>
        <span>{{ confidence }}%</span>
      </div>

      <p class="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
        {{ insight }}
      </p>
    </div>

  </div>
</template>
