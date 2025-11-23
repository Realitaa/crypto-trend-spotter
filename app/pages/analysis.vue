<script setup>
definePageMeta({
  layout: 'navigation'
})

const loading = ref(false)
const selectedTimeframe = ref('24H')
const timeframes = ['1H', '24H', '7D', '30D', '90D', '1Y']

// User Parameters
const params = ref({
  method: 'Central', // Forward, Backward, Central
  interval: 1, // Delta t
  enableSmoothing: false,
  maLength: 5
})

// Mock Result Data (In a real app, this comes from an API/Calculation)
const results = ref({
  deriv1: {
    value: 125.40,
    trend: 'up', // up, down
    label: 'Percepatan Positif',
    history: [10, 25, 40, 30, 60, 90, 110, 125] // Mock data for chart
  },
  deriv2: {
    value: -82.10,
    trend: 'down',
    label: 'Momentum Melemah',
    history: [5, 10, 15, 5, -10, -40, -60, -82] // Mock data for chart
  },
  trend: {
    status: 'Bullish', // Bullish, Bearish, Sideways
    confidence: 78,
    desc: 'Tren naik masih dominan namun mulai kehilangan tenaga (deceleration).'
  },
  insight: 'Turunan pertama menunjukkan kenaikan harga yang konsisten positif, namun turunan kedua yang bernilai negatif mengindikasikan bahwa laju kenaikan ini mulai melambat (concave down). Waspadai potensi reversal jika turunan pertama menembus angka nol.'
})

// --- Computed Styles ---

// Helper for colors based on value polarity
const getPolarityColor = (val) => {
  if (val > 0) return 'text-emerald-600 dark:text-emerald-400'
  if (val < 0) return 'text-rose-600 dark:text-rose-400'
  return 'text-slate-500 dark:text-slate-400'
}

const trendBadgeColor = computed(() => {
  if (results.value.trend.status === 'Bullish') return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
  if (results.value.trend.status === 'Bearish') return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
  return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
})

// --- Actions ---

const recalculate = () => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    // Logic to update results would go here
  }, 1000)
}
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
                <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Analisis Diferensial</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Visualisasi perubahan harga dan hasil diferensiasi numerik untuk aset yang dipilih.
                </p>
                </div>
                <div class="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Updated: just now
                </div>
            </header>
        
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                <div class="lg:col-span-2 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm backdrop-blur-sm flex flex-col">
                <div class="flex flex-wrap items-center justify-between mb-6 gap-4">
                    <h3 class="font-semibold text-slate-900 dark:text-white">Grafik Harga (Historical Price)</h3>
                    
                    <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button 
                        v-for="tf in timeframes" 
                        :key="tf"
                        :class="[
                        'px-3 py-1 text-xs font-medium rounded-md transition-all',
                        selectedTimeframe === tf 
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        ]"
                        @click="selectedTimeframe = tf"
                    >
                        {{ tf }}
                    </button>
                    </div>
                </div>
        
                <div class="flex-1 min-h-[250px] w-full bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 relative overflow-hidden group">
                    <svg class="absolute inset-0 w-full h-full text-blue-500 stroke-current opacity-80" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0 80 Q 20 90, 40 60 T 70 40 T 100 20" fill="none" stroke-width="2" vector-effect="non-scaling-stroke"/>
                    <defs>
                        <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stop-color="currentColor" stop-opacity="0.2"/>
                        <stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
                        </linearGradient>
                    </defs>
                    <path d="M0 80 Q 20 90, 40 60 T 70 40 T 100 20 V 100 H 0 Z" fill="url(#grad)" stroke="none" />
                    </svg>
                    
                    <div class="absolute top-1/4 left-2/3 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Price: $67,120
                    </div>
                </div>
                
                <p class="text-xs text-slate-400 mt-4">
                    *Grafik ini digunakan sebagai basis data $f(x)$ untuk perhitungan turunan.
                </p>
                </div>
        
                <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm backdrop-blur-sm h-fit">
                <h3 class="font-semibold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    Parameter Analisis
                </h3>
        
                <div class="space-y-4">
                    <div class="space-y-1.5">
                    <label class="text-xs font-medium text-slate-500 uppercase">Metode Diferensiasi</label>
                    <select v-model="params.method" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
                        <option value="Forward">Forward Difference</option>
                        <option value="Backward">Backward Difference</option>
                        <option value="Central">Central Difference (Recommended)</option>
                    </select>
                    </div>
        
                    <div class="space-y-1.5">
                    <label class="text-xs font-medium text-slate-500 uppercase">Interval Sampling (Δt)</label>
                    <div class="relative">
                        <input v-model="params.interval" type="number" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg p-2.5 pr-10 focus:ring-2 focus:ring-blue-500 outline-none" min="1" />
                        <span class="absolute right-3 top-2.5 text-xs text-slate-400">min</span>
                    </div>
                    </div>
        
                    <div class="flex items-center justify-between py-2">
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Smoothing (MA)</span>
                    <button 
                        :class="params.enableSmoothing ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'"
                        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
                        @click="params.enableSmoothing = !params.enableSmoothing"
                    >
                        <span 
                        :class="params.enableSmoothing ? 'translate-x-6' : 'translate-x-1'"
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        />
                    </button>
                    </div>
        
                    <div v-if="params.enableSmoothing" class="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label class="text-xs font-medium text-slate-500 uppercase">MA Length</label>
                    <input v-model="params.maLength" type="number" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
        
                    <button 
                    :disabled="loading" 
                    class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                    @click="recalculate"
                    >
                    <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span v-else>Recalculate Analysis</span>
                    </button>
                </div>
                </div>
            </div>
        
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm hover:border-blue-400/30 transition-colors">
                <div class="flex justify-between mb-4">
                    <h4 class="text-sm font-bold text-slate-500 uppercase">Turunan 1 (Velocity)</h4>
                    <div class="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                    </div>
                </div>
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{{ results.deriv1.value > 0 ? '+' : ''}}{{ results.deriv1.value }}</span>
                    <span :class="`text-sm font-medium px-2 py-0.5 rounded ${getPolarityColor(results.deriv1.value)} bg-opacity-10 bg-current`">
                    {{ results.deriv1.value > 0 ? 'Naik' : 'Turun' }}
                    </span>
                </div>
                <p :class="`text-sm font-medium ${getPolarityColor(results.deriv1.value)}`">
                    {{ results.deriv1.label }}
                </p>
                </div>
        
                <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm hover:border-purple-400/30 transition-colors">
                <div class="flex justify-between mb-4">
                    <h4 class="text-sm font-bold text-slate-500 uppercase">Turunan 2 (Acceleration)</h4>
                    <div class="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"></path><path d="M18 20V4"></path><path d="M6 20v-4"></path></svg>
                    </div>
                </div>
                <div class="flex items-center gap-3 mb-2">
                    <span class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{{ results.deriv2.value }}</span>
                </div>
                <p :class="`text-sm font-medium ${getPolarityColor(results.deriv2.value)}`">
                    {{ results.deriv2.label }}
                </p>
                <p class="text-xs text-slate-500 mt-1">Mengukur kelengkungan kurva harga.</p>
                </div>
        
                <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm hover:border-emerald-400/30 transition-colors">
                <div class="flex justify-between mb-4">
                    <h4 class="text-sm font-bold text-slate-500 uppercase">Kesimpulan Tren</h4>
                    <div class="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
                    </div>
                </div>
                <div class="mb-3">
                    <span :class="`inline-block px-3 py-1 rounded-md text-lg font-bold border ${trendBadgeColor}`">
                    {{ results.trend.status }}
                    </span>
                </div>
                
                <div class="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                    <div 
                    class="h-full rounded-full transition-all duration-500"
                    :class="results.trend.status === 'Bullish' ? 'bg-emerald-500' : 'bg-rose-500'"
                    :style="`width: ${results.trend.confidence}%`"
                    ></div>
                </div>
                <div class="flex justify-between text-xs text-slate-500">
                    <span>Confidence</span>
                    <span>{{ results.trend.confidence }}%</span>
                </div>
                </div>
            </div>
        
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="font-semibold text-slate-900 dark:text-white">Grafik Turunan Pertama (f')</h4>
                    <span class="text-xs text-slate-500">Rate of Change</span>
                </div>
                <div class="h-40 w-full relative">
                    <div class="absolute top-1/2 w-full h-px bg-slate-300 dark:bg-slate-600 border-t border-dashed"></div>
                    <svg class="w-full h-full stroke-blue-500 fill-none" stroke-width="2" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <path d="M0 25 L 10 20 L 20 15 L 30 25 L 40 10 L 50 5 L 60 15 L 70 20 L 80 10 L 90 5 L 100 0" vector-effect="non-scaling-stroke"/>
                    </svg>
                </div>
                </div>
        
                <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="font-semibold text-slate-900 dark:text-white">Grafik Turunan Kedua (f'')</h4>
                    <span class="text-xs text-slate-500">Acceleration</span>
                </div>
                <div class="h-40 w-full relative">
                    <div class="absolute top-1/2 w-full h-px bg-slate-300 dark:bg-slate-600 border-t border-dashed"></div>
                    <svg class="w-full h-full stroke-purple-500 fill-none" stroke-width="2" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <path d="M0 25 L 10 30 L 20 35 L 30 25 L 40 40 L 50 45 L 60 30 L 70 20 L 80 35 L 90 45 L 100 50" vector-effect="non-scaling-stroke"/>
                    </svg>
                </div>
                </div>
            </div>
        
            <div class="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 lg:p-8 shadow-sm">
                <h3 class="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                Interpretasi Hasil
                </h3>
                <div class="prose dark:prose-invert max-w-none">
                <p class="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {{ results.insight }}
                </p>
                </div>
                
                <div class="flex gap-2 mt-4">
                <span class="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 text-xs rounded border border-yellow-200 dark:border-yellow-500/30">Divergence Detected</span>
                <span class="px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-600">High Volatility</span>
                </div>
            </div>
        
            </div>
        </template>

    </UDashboardPanel>
</template>