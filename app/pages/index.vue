<script setup>
// Data dummy (nanti bisa diganti API)
const trends = [
  { name: "BTC", price: "$97,200", change: "+2.4%" },
  { name: "ETH", price: "$3,450", change: "-0.8%" },
  { name: "SOL", price: "$145", change: "+5.2%" },
  { name: "BNB", price: "$610", change: "+1.1%" },
];

const currentIndex = ref(0);
let intervalId = null;

// Logic untuk mengganti index setiap 3 detik
onMounted(() => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % trends.length;
  }, 3000);
});

// Bersihkan interval saat komponen dihancurkan (penting untuk performa)
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="min-h-screen w-full bg-white relative">
    <div
      class="absolute inset-0 z-0"
      :style="{
        backgroundImage: `
          linear-gradient(to right, rgba(229,231,235,0.8) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(229,231,235,0.8) 1px, transparent 1px),
          radial-gradient(circle 500px at 20% 80%, rgba(139,92,246,0.3), transparent),
          radial-gradient(circle 500px at 80% 20%, rgba(59,130,246,0.3), transparent)
        `,
        backgroundSize: '48px 48px, 48px 48px, 100% 100%, 100% 100%',
      }"
    ></div>

    <div
      class="relative flex flex-col text-center h-screen items-center justify-center z-10"
    >
      <div class="mt-12">
        <h1
          class="text-3xl sm:text-5xl lg:text-6xl text-gray-800 font-semibold"
        >
          Crypto Trend Spotter
        </h1>
        <p class="text-gray-800 text-base sm:text-md lg:text-xl mt-5">
          Implementasi Diferensiasi Numerik & Uji kecekungan untuk <br />
          Deteksi Tren Pasar Aset Kripto
        </p>
      </div>
      <p class="mt-8 text-gray-700 text-sm sm:text-base lg:text-md max-w-200 m-5">
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
          >Mulai Analisis</UButton
        >
        <UButton
          trailing-icon="el:group"
          size="xl"
          color="neutral"
          variant="outline"
          >Tentang Kami</UButton
        >
      </div>
      <div class="flex mt-22 gap-6 items-center justify-center font-sans">
        <div
          class="h-12 px-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm flex items-center transition-colors hover:border-gray-300"
        >
          <img
            src="https://statuspal.io/uploads/status_pages/favicon/original/5463-b73WUiEq_400x400.png?v=63918037891"
            alt="CoinGecko"
            class="h-5 w-5 mr-3 rounded-full grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
          />

          <span class="text-xs font-medium text-gray-500 hidden sm:block">
            Powered by CoinGecko
          </span>

          <UButton
            icon="mdi:circle-medium"
            active
            color="neutral"
            variant="outline"
            active-color="primary"
            active-variant="link"
          >
            Online
          </UButton>
        </div>

        <div
          class="relative h-12 w-64 overflow-hidden bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm flex items-center justify-center transition-colors hover:border-gray-300"
        >
          <Transition name="slide-up" mode="out-in">
            <div
              :key="currentIndex"
              class="absolute flex items-center space-x-3 w-full justify-center px-4"
            >
              <span class="font-bold font-jakarta text-gray-800">
                {{ trends[currentIndex].name }}
              </span>
              <span class="font-mono text-gray-600 text-sm">
                {{ trends[currentIndex].price }}
              </span>
              <span
                class="text-[10px] font-bold px-1.5 py-0.5 rounded border"
                :class="
                  trends[currentIndex].change.startsWith('+')
                    ? 'bg-green-50 text-green-600 border-green-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                "
              >
                {{ trends[currentIndex].change }}
              </span>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CSS Transisi Vertikal 
  Tailwind v4 support CSS standar, ini cara paling bersih untuk Vue Transition
*/

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s ease-in-out;
}

/* Kondisi awal elemen yang MASUK (berada di bawah) */
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

/* Kondisi akhir elemen yang KELUAR (pergi ke atas) */
.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
