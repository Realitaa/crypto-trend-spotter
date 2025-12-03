<script setup>
definePageMeta({
  layout: false,
})

const colorMode = useColorMode()
</script>

<template>
  <div class="min-h-screen w-full bg-white relative">
    <div class="absolute inset-0 z-0">

    <!-- Light mode background -->
    <div
      v-if="colorMode.value == 'light'"
      class="absolute inset-0 z-0"
      :style="{
        backgroundImage: `
          linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
          radial-gradient(circle 500px at 20% 80%, rgba(139,92,246,0.3), transparent),
          radial-gradient(circle 500px at 80% 20%, rgba(59,130,246,0.3), transparent)
        `,
        backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%'
      }"
    ></div>

    <!-- Dark mode background -->
    <div
      v-else
      class="absolute inset-0 z-0"
      :style="{
        background: '#0f172a',
        backgroundImage: `
          linear-gradient(to right, rgba(148,163,184,0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148,163,184,0.2) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }"
    ></div>

    </div>

    <div
      class="relative flex flex-col text-center h-screen items-center justify-center z-10"
    >
      <div>
        <h1
          class="text-3xl sm:text-5xl lg:text-6xl text-gray-800 font-semibold dark:text-slate-100"
        >
          Crypto Trend Spotter
        </h1>
        <p class="text-gray-800 text-base sm:text-md lg:text-xl mt-5 dark:text-slate-200">
          Implementasi Diferensiasi Numerik & Uji kecekungan untuk <br />
          Deteksi Tren Pasar Aset Kripto
        </p>
      </div>
      <p
        class="mt-8 text-gray-700 text-sm sm:text-base lg:text-md max-w-200 m-5 dark:text-slate-300"
      >
        Crypto Trend Spotter menganalisis pergerakan harga kripto secara
        matematis untuk mengetahui apakah pasar sedang naik, turun, atau
        berpotensi berbalik arah. Semua dihitung otomatis menggunakan turunan
        numerik dan pola kecekungan agar Anda mendapatkan insight yang lebih
        presisi.
      </p>
      <div class="flex space-x-6 mt-6">
        <UButton
          trailing-icon="i-lucide-arrow-right"
          size="xl"
          color="secondary"
          to="/overview"
          >Mulai Analisis</UButton
        >
        <UButton
          trailing-icon="el:group"
          size="xl"
          color="neutral"
          variant="outline"
          to="/about"
          >Tentang Kami</UButton
        >
      </div>
    </div>
  </div>
</template>