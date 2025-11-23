<script setup>
definePageMeta({
  layout: 'navigation'
})

const lastUpdated = ref('Just now')
const selectedTimeframe = ref('4H')
const timeframes = ['1H', '4H', '24H', '7D', '30D', '90D', '1Y']

// Chart Toggles
const chartControls = ref({
  showTrendline: true,
  showMA: false,
  showSupportResistance: true
})

// Mock Analysis Data
const analysis = ref({
  trendDirection: 'Bullish', // Bullish, Bearish, Sideways
  trendStrength: 78, // 0-100
  momentum: 'Increasing', // Increasing, Weakening, Reversal
  currentPrice: 68420.50,
  maData: {
    status: 'Golden Cross', // Golden Cross, Death Cross, Neutral
    lastCrossover: '4 hours ago',
    confidence: 'High',
    shortMA: 68100,
    longMA: 66500
  },
  heatmap: {
    up: 60,
    down: 25,
    flat: 15
  },
  patterns: [
    { name: 'Uptrend Channel', type: 'bullish' },
    { name: 'Higher Lows', type: 'bullish' },
    { name: 'Volume Breakout', type: 'neutral' }
  ],
  insight: 'Garis tren utama menunjukkan kemiringan positif yang stabil sebesar 15°. Indikator Moving Average baru saja membentuk "Golden Cross", memperkuat sinyal beli. Namun, perhatikan area resistensi di $69k; momentum mungkin mengalami konsolidasi sementara sebelum penembusan.'
})

// --- Computed Styling ---

const trendColor = computed(() => {
  if (analysis.value.trendDirection === 'Bullish') return 'text-emerald-600 dark:text-emerald-400'
  if (analysis.value.trendDirection === 'Bearish') return 'text-rose-600 dark:text-rose-400'
  return 'text-blue-600 dark:text-blue-400'
})

const trendBg = computed(() => {
  if (analysis.value.trendDirection === 'Bullish') return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
  if (analysis.value.trendDirection === 'Bearish') return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
  return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
})

// For Momentum Icon
const momentumIcon = computed(() => {
  if (analysis.value.momentum === 'Increasing') return 'up'
  if (analysis.value.momentum === 'Weakening') return 'zigzag'
  return 'down'
})
</script>

<template>
  <UDashboardPanel 
    :ui="{
        body: 'w-full max-w-none px-0'
        }">

        <template #header>
            <AppNavbar />
        </template>

        <template #body>
          <div class="w-full p-6 lg:p-8 text-slate-800 dark:text-slate-200 transition-colors duration-300">

<header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
  <div>
    <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Deteksi Trend</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
      Analisis garis tren, pola pergerakan harga, dan indikator momentum.
    </p>
  </div>
  <div class="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
    <span class="relative flex h-2 w-2">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
      <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
    </span>
    Updated: {{ lastUpdated }}
  </div>
</header>

<section class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm backdrop-blur-sm mb-8">
  
  <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
    <h3 class="font-semibold text-slate-900 dark:text-white">Grafik Deteksi Trend</h3>
    
    <div class="flex flex-wrap items-center gap-3">
      <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
        <button 
          v-for="tf in timeframes" 
          :key="tf"
          @click="selectedTimeframe = tf"
          :class="[
            'px-3 py-1 text-xs font-medium rounded-md transition-all',
            selectedTimeframe === tf 
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          ]"
        >
          {{ tf }}
        </button>
      </div>

      <div class="flex gap-2">
        <button 
          @click="chartControls.showTrendline = !chartControls.showTrendline"
          :class="chartControls.showTrendline ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'"
          class="p-1.5 rounded-md transition-colors" title="Toggle Trendline">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="23" y1="6" x2="13.5" y2="15.5"></line><polyline points="16 6 23 6 23 13"></polyline><line x1="1" y1="18" x2="8.5" y2="10.5"></line></svg>
        </button>
        <button 
          @click="chartControls.showSupportResistance = !chartControls.showSupportResistance"
          :class="chartControls.showSupportResistance ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'"
          class="p-1.5 rounded-md transition-colors" title="Toggle Support/Resistance">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
        </button>
      </div>
    </div>
  </div>

  <div class="relative w-full h-[350px] bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 overflow-hidden group">
    <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
       <defs>
         <pattern id="gridTrend" width="10" height="10" patternUnits="userSpaceOnUse">
           <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5" class="text-slate-200 dark:text-slate-800"/>
         </pattern>
       </defs>
       <rect width="100" height="100" fill="url(#gridTrend)" />

       <path v-if="chartControls.showSupportResistance"
         d="M0 85 L 100 25 L 100 45 L 0 105 Z" 
         class="fill-slate-200 dark:fill-slate-800/80 opacity-50" />
       
       <path d="M0 90 L 10 82 L 20 88 L 30 70 L 40 75 L 50 60 L 60 55 L 70 65 L 80 40 L 90 35 L 100 30" 
         fill="none" stroke="currentColor" stroke-width="1.5" 
         class="text-slate-400 dark:text-slate-500" vector-effect="non-scaling-stroke" />

       <line v-if="chartControls.showTrendline"
         x1="0" y1="88" x2="100" y2="32" 
         class="stroke-blue-500 dark:stroke-blue-400 drop-shadow-md" 
         stroke-width="2" stroke-dasharray="4,2" vector-effect="non-scaling-stroke" />

       <circle cx="50" cy="60" r="1.5" class="fill-rose-500" /> <circle cx="70" cy="65" r="1.5" class="fill-emerald-500" /> </svg>

    <div class="absolute bottom-4 right-4 text-xs text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded shadow border border-slate-200 dark:border-slate-700">
      Trend Slope: +0.85
    </div>
  </div>
  
  <p class="text-xs text-slate-400 mt-4 flex items-center gap-2">
    <span class="w-3 h-0.5 bg-blue-500 inline-block"></span> Trendline
    <span class="w-3 h-3 bg-slate-300 dark:bg-slate-700 inline-block ml-2 opacity-50"></span> Regression Channel
    <span class="ml-auto italic">Grafik menggunakan regresi linear untuk estimasi arah.</span>
  </p>
</section>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  
  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm hover:border-blue-500/30 transition-all">
    <h4 class="text-xs font-bold text-slate-500 uppercase mb-3">Arah Tren</h4>
    <div class="flex items-center gap-3 mb-2">
      <div :class="`text-2xl font-bold ${trendColor}`">
        {{ analysis.trendDirection }}
      </div>
      <span :class="`px-2 py-0.5 rounded text-[10px] font-bold border ${trendBg}`">
        STRONG
      </span>
    </div>
    <p class="text-xs text-slate-500">
      Kemiringan garis tren positif secara konsisten dalam 24 jam terakhir.
    </p>
  </div>

  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm hover:border-purple-500/30 transition-all">
    <h4 class="text-xs font-bold text-slate-500 uppercase mb-3">Trend Strength</h4>
    <div class="flex items-end gap-2 mb-2">
      <span class="text-3xl font-bold text-slate-900 dark:text-white">{{ analysis.trendStrength }}</span>
      <span class="text-sm text-slate-400 mb-1">/ 100</span>
    </div>
    <div class="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
      <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full" :style="`width: ${analysis.trendStrength}%`"></div>
    </div>
    <p class="text-xs text-slate-500">
      Mengukur konsistensi slope dan volume yang mendukung arah harga.
    </p>
  </div>

  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm hover:border-emerald-500/30 transition-all">
    <h4 class="text-xs font-bold text-slate-500 uppercase mb-3">Momentum Status</h4>
    <div class="flex items-center gap-2 mb-2">
      <span class="text-xl font-bold text-slate-900 dark:text-white">{{ analysis.momentum }}</span>
      <svg v-if="momentumIcon === 'up'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
      <svg v-else-if="momentumIcon === 'zigzag'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
    </div>
    <p class="text-xs text-slate-500">
      Momentum beli masih dominan meskipun volume sedikit menurun.
    </p>
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  
  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
    <h4 class="font-semibold text-slate-900 dark:text-white mb-4">Perbandingan Moving Average</h4>
    <div class="h-40 w-full relative">
      <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
         <path d="M0 45 Q 20 40, 50 20 T 100 10" fill="none" stroke="#10b981" stroke-width="1.5" vector-effect="non-scaling-stroke"/>
         <path d="M0 40 Q 30 35, 60 25 T 100 15" fill="none" stroke="#eab308" stroke-width="1.5" vector-effect="non-scaling-stroke"/>
         <path d="M0 35 Q 40 30, 70 30 T 100 25" fill="none" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="2,2" vector-effect="non-scaling-stroke"/>
         
         <circle cx="85" cy="18" r="2" class="fill-white stroke-emerald-500" stroke-width="1" />
      </svg>
    </div>
    <div class="flex gap-4 mt-2 justify-center text-[10px] text-slate-500">
      <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-emerald-500"></span> MA-7</span>
      <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-yellow-500"></span> MA-25</span>
      <span class="flex items-center gap-1"><span class="w-2 h-0.5 bg-blue-500 border-dashed border-t"></span> MA-99</span>
    </div>
  </div>

  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm flex flex-col justify-center">
    <div class="mb-4">
      <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">MA Signal Detected</span>
      <div class="mt-2 flex items-center gap-2">
        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 text-sm font-bold rounded-full border border-yellow-200 dark:border-yellow-500/30 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          {{ analysis.maData.status }}
        </span>
        <span class="text-xs text-slate-400">{{ analysis.maData.lastCrossover }}</span>
      </div>
    </div>
    
    <div class="space-y-3">
      <div class="flex justify-between text-sm">
        <span class="text-slate-500">Short MA (7)</span>
        <span class="font-mono font-medium text-slate-900 dark:text-white">${{ analysis.maData.shortMA }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-slate-500">Long MA (25)</span>
        <span class="font-mono font-medium text-slate-900 dark:text-white">${{ analysis.maData.longMA }}</span>
      </div>
      <div class="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
      <div class="flex justify-between text-sm">
        <span class="text-slate-500">Signal Confidence</span>
        <span class="text-emerald-500 font-bold">{{ analysis.maData.confidence }}</span>
      </div>
    </div>
  </div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  
  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
    <h4 class="font-semibold text-slate-900 dark:text-white mb-4">Trend Heatmap (Distribution)</h4>
    
    <div class="flex w-full h-8 rounded-lg overflow-hidden mb-3">
      <div class="bg-emerald-500 hover:bg-emerald-400 transition-colors cursor-help" :style="`width: ${analysis.heatmap.up}%`" title="Uptrend Duration"></div>
      <div class="bg-slate-400 hover:bg-slate-300 transition-colors cursor-help" :style="`width: ${analysis.heatmap.flat}%`" title="Sideways Duration"></div>
      <div class="bg-rose-500 hover:bg-rose-400 transition-colors cursor-help" :style="`width: ${analysis.heatmap.down}%`" title="Downtrend Duration"></div>
    </div>

    <div class="flex justify-between text-xs text-slate-500">
      <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-emerald-500"></div> Uptrend ({{ analysis.heatmap.up }}%)</div>
      <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-slate-400"></div> Sideways ({{ analysis.heatmap.flat }}%)</div>
      <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full bg-rose-500"></div> Downtrend ({{ analysis.heatmap.down }}%)</div>
    </div>
  </div>

  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
    <h4 class="font-semibold text-slate-900 dark:text-white mb-4">Pattern Recognition</h4>
    <div class="flex flex-wrap gap-2">
      <div v-for="(pat, idx) in analysis.patterns" :key="idx"
        :class="[
          'px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-2',
          pat.type === 'bullish' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
          pat.type === 'bearish' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' :
          'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
        ]"
      >
        <svg v-if="pat.type === 'bullish'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
        <svg v-else-if="pat.type === 'bearish'" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect></svg>
        {{ pat.name }}
      </div>
    </div>
    <p class="text-xs text-slate-400 mt-3">
      *Pola dideteksi secara otomatis berdasarkan formasi candle terakhir.
    </p>
  </div>

</div>

<section class="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 lg:p-8 shadow-sm">
  <div class="flex items-start gap-4">
    <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
    </div>
    <div class="flex-1">
      <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Interpretasi Hasil</h3>
      <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
        {{ analysis.insight }}
      </p>
      
      <div class="flex flex-wrap gap-2 mt-4">
        <span class="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/30">
          Strong Trend
        </span>
        <span class="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/30">
          Check Volume
        </span>
      </div>
    </div>
  </div>
</section>

</div>
        </template>

    </UDashboardPanel>
</template> 