<script setup>
definePageMeta({
  layout: 'navigation'
})

const lastUpdated = ref('Just now')

// Graph Display Toggles
const graphSettings = ref({
  showRaw: true,
  showSmoothed: false,
  showFitted: true,
  showRegions: true
})

// Mock Analysis Data
const analysis = ref({
  convexityScore: 0.88,
  curvatureDirection: 'Convex', // Convex, Concave, Transition
  stabilityIndex: 72, // 0-100
  secondDerivValue: 42.5, // Current f''(x) value
  insight: {
    summary: 'Analisis menunjukkan dominasi pola Cembung (Convex) pada tren saat ini. Kurva harga membentuk lengkungan ke atas yang mengindikasikan percepatan momentum pembeli.',
    reversalRisk: false,
    volatility: 'Stable'
  }
})

// --- Computed Logic ---

const directionColor = computed(() => {
  if (analysis.value.curvatureDirection === 'Convex') return 'text-emerald-600 dark:text-emerald-400'
  if (analysis.value.curvatureDirection === 'Concave') return 'text-rose-600 dark:text-rose-400'
  return 'text-yellow-600 dark:text-yellow-400'
})

const badgeColor = computed(() => {
   if (analysis.value.curvatureDirection === 'Convex') return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
   if (analysis.value.curvatureDirection === 'Concave') return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
   return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20'
})

// Helper to determine gradient for stability bar
const stabilityColor = computed(() => {
  if (analysis.value.stabilityIndex > 70) return 'bg-blue-500'
  if (analysis.value.stabilityIndex > 40) return 'bg-yellow-500'
  return 'bg-rose-500'
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
    <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Uji Kekonveksan</h1>
    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
      Analisis kelengkungan kurva harga untuk menentukan apakah tren bersifat cembung atau cekung.
    </p>
  </div>
  <div class="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
    Updated: {{ lastUpdated }}
  </div>
</header>

<section class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm backdrop-blur-sm mb-8">
  <div class="flex flex-wrap items-center justify-between mb-6 gap-4">
    <div>
      <h3 class="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        Grafik Kekonveksan
        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">POLY FIT</span>
      </h3>
    </div>
    
    <div class="flex gap-2 text-xs">
      <button @click="graphSettings.showRaw = !graphSettings.showRaw" 
        :class="graphSettings.showRaw ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30' : 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-transparent opacity-60'"
        class="px-3 py-1 rounded-full border transition-all">
        Raw Price
      </button>
      <button @click="graphSettings.showFitted = !graphSettings.showFitted" 
        :class="graphSettings.showFitted ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-200 dark:border-purple-500/30' : 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-transparent opacity-60'"
        class="px-3 py-1 rounded-full border transition-all">
        Fitted Curve
      </button>
      <button @click="graphSettings.showRegions = !graphSettings.showRegions" 
        :class="graphSettings.showRegions ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' : 'text-slate-500 bg-slate-100 dark:bg-slate-800 border-transparent opacity-60'"
        class="px-3 py-1 rounded-full border transition-all">
        Highlight Regions
      </button>
    </div>
  </div>

  <div class="relative w-full h-[300px] bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 overflow-hidden group cursor-crosshair">
    
    <div v-if="graphSettings.showRegions" class="absolute inset-0 flex opacity-10 pointer-events-none">
      <div class="w-[40%] h-full bg-emerald-500"></div> <div class="w-[20%] h-full bg-slate-500"></div>   <div class="w-[40%] h-full bg-rose-500"></div>    </div>

    <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
       <defs>
         <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
           <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5" class="text-slate-200 dark:text-slate-800"/>
         </pattern>
       </defs>
       <rect width="100" height="100" fill="url(#grid)" />

       <path v-if="graphSettings.showRaw" 
         d="M0 90 L5 85 L10 88 L15 80 L20 75 L25 78 L30 65 L35 60 L40 62 L45 50 L50 48 L55 40 L60 35 L65 38 L70 30 L75 32 L80 25 L85 28 L90 20 L95 15 L100 18" 
         fill="none" 
         class="stroke-blue-400 opacity-40" 
         stroke-width="1"
         vector-effect="non-scaling-stroke" />

       <path v-if="graphSettings.showFitted" 
         d="M0 90 Q 30 85, 50 50 T 100 15" 
         fill="none" 
         class="stroke-purple-500 dark:stroke-purple-400 drop-shadow-md" 
         stroke-width="3" 
         vector-effect="non-scaling-stroke" />
    </svg>

    <div class="absolute top-10 left-1/2 bg-white dark:bg-slate-800 p-3 rounded-lg shadow-xl border border-slate-100 dark:border-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
      <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Data Point</div>
      <div class="text-sm font-bold text-slate-900 dark:text-white">Price: $68,240</div>
      <div class="text-xs text-purple-500">f''(x): +42.5 (Convex)</div>
    </div>
  </div>
  
  <p class="text-xs text-slate-400 mt-4 italic">
    *Grafik ini membandingkan data mentah dengan kurva regresi polinomial untuk menilai kelengkungan fungsi $f(x)$.
  </p>
</section>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  
  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm hover:border-purple-400/30 transition-all">
    <h4 class="text-xs font-bold text-slate-500 uppercase mb-2">Convexity Score</h4>
    <div class="flex items-baseline gap-2 mb-2">
      <span class="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{{ analysis.convexityScore }}</span>
    </div>
    <div class="mb-3">
      <span class="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/10">
        Positive Curvature
      </span>
    </div>
    <p class="text-xs text-slate-500">
      Nilai positif menunjukkan kecenderungan cembung (kurva terbuka ke atas).
    </p>
  </div>

  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm hover:border-emerald-400/30 transition-all">
    <h4 class="text-xs font-bold text-slate-500 uppercase mb-2">Arah Kelengkungan</h4>
    <div class="mb-2">
      <span :class="`text-2xl font-bold ${directionColor}`">
        {{ analysis.curvatureDirection }}
      </span>
    </div>
    <div class="mb-4">
       <span :class="`text-xs font-medium px-2 py-1 rounded border ${badgeColor}`">
         Dominan
       </span>
    </div>
    <p class="text-xs text-slate-500">
      Kelengkungan positif menggambarkan percepatan kenaikan harga (accelerating trend).
    </p>
  </div>

  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm hover:border-blue-400/30 transition-all">
    <h4 class="text-xs font-bold text-slate-500 uppercase mb-2">Stability Index</h4>
    <div class="flex justify-between items-end mb-2">
      <span class="text-3xl font-bold text-slate-900 dark:text-white">{{ analysis.stabilityIndex }}<span class="text-lg text-slate-400">/100</span></span>
    </div>
    
    <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-3 overflow-hidden">
      <div :class="`h-2.5 rounded-full ${stabilityColor}`" :style="`width: ${analysis.stabilityIndex}%`"></div>
    </div>
    
    <p class="text-xs text-slate-500">
      Mengukur konsistensi kelengkungan selama interval pengamatan.
    </p>
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  
  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h4 class="font-semibold text-slate-900 dark:text-white">Grafik Turunan Kedua ($f''$)</h4>
      <span class="text-xs text-slate-500">Acceleration Metric</span>
    </div>
    
    <div class="relative h-32 w-full">
      <div class="absolute top-1/2 left-0 right-0 border-t border-dashed border-slate-400 dark:border-slate-500 z-0"></div>
      <div class="absolute top-1/2 right-0 -mt-5 text-[10px] text-slate-400 bg-white dark:bg-slate-800 px-1">Threshold 0</div>

      <svg class="w-full h-full absolute inset-0 z-10" preserveAspectRatio="none" viewBox="0 0 100 50">
        <defs>
          <linearGradient id="grad2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0.5"/> <stop offset="100%" stop-color="#f43f5e" stop-opacity="0.5"/> </linearGradient>
        </defs>
        <path d="M0 25 Q 20 5, 40 25 T 80 25 T 100 10" 
          fill="none" 
          stroke="url(#grad2)" 
          stroke-width="2" 
          vector-effect="non-scaling-stroke"
        />
         <path d="M0 25 Q 20 5, 40 25 T 80 25 T 100 10 V 25 H 0 Z" fill="url(#grad2)" opacity="0.2" stroke="none" />
      </svg>
    </div>
    <div class="flex justify-between mt-2 text-[10px] text-slate-400">
      <span>Concave ($f'' < 0$)</span>
      <span>Convex ($f'' > 0$)</span>
    </div>
  </div>

  <div class="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm flex flex-col justify-between">
     <div class="flex items-center justify-between mb-4">
      <h4 class="font-semibold text-slate-900 dark:text-white">Convexity Heatmap</h4>
      <span class="text-xs text-slate-500">Time Distribution</span>
    </div>

    <div class="w-full h-16 flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <div class="flex-1 bg-emerald-500/80 hover:bg-emerald-500 transition-colors group relative cursor-pointer">
         <span class="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-1 rounded whitespace-nowrap">00:00 - 04:00 (Convex)</span>
      </div>
      <div class="flex-1 bg-emerald-500/90 hover:bg-emerald-500 transition-colors"></div>
      <div class="flex-1 bg-emerald-500/70 hover:bg-emerald-500 transition-colors"></div>
      <div class="flex-1 bg-slate-400/50 hover:bg-slate-400 transition-colors" title="Flat"></div>
      <div class="flex-1 bg-rose-500/80 hover:bg-rose-500 transition-colors group relative cursor-pointer">
        <span class="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-1 rounded whitespace-nowrap">12:00 - 16:00 (Concave)</span>
      </div>
      <div class="flex-1 bg-rose-500/60 hover:bg-rose-500 transition-colors"></div>
      <div class="flex-1 bg-slate-400/50 hover:bg-slate-400 transition-colors"></div>
      <div class="flex-1 bg-emerald-500/80 hover:bg-emerald-500 transition-colors"></div>
    </div>

    <div class="flex gap-4 mt-4 justify-center">
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-sm bg-emerald-500"></div>
        <span class="text-xs text-slate-500">Convex Zone</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-sm bg-rose-500"></div>
        <span class="text-xs text-slate-500">Concave Zone</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-sm bg-slate-400"></div>
        <span class="text-xs text-slate-500">Flat</span>
      </div>
    </div>
  </div>
</div>

<section class="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
  <div class="flex items-start gap-4">
    <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
    </div>
    <div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">Interpretasi Hasil</h3>
      <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
        {{ analysis.insight.summary }} 
        Posisi grafik turunan kedua yang berada konsisten di area positif (>0) mengkonfirmasi sifat cembung ini.
        Namun, perhatikan area transisi pada heatmap; jika warna berubah menjadi merah, itu menandakan potensi <span class="font-semibold text-rose-500">Inflection Point</span> (titik belok) dimana tren mungkin berbalik arah.
      </p>
      
      <div class="flex flex-wrap gap-2 mt-4">
        <span class="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
          Stable Trend
        </span>
         <span class="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 dark:bg-slate-400/10 dark:text-slate-400 dark:ring-slate-400/20">
          No Divergence
        </span>
      </div>
    </div>
  </div>
</section>

</div>
        </template>

    </UDashboardPanel>
</template> 