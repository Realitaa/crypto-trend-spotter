<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)
const { selected } = useSelectedCoin()

const docs = '/documentation'
const links = [[
  {
    label: 'Ringkasan',
    icon: 'material-symbols-light:overview',
    to: '/overview',
  }, 
  {
    label: 'Analisis Diferensial',
    icon: 'lucide:activity',
    to: '/differential',
  }, 
  {
    label: 'Uji Konveksitas',
    icon: 'ph:bezier-curve',
    to: '/convexity',
  }, 
  {
    label: 'Deteksi Trend',
    icon: 'mynaui:trending-up-down-solid',
    to: '/trend',
  }, 
  {
    label: 'Dokumentasi',
    icon: 'mdi:book-open-blank-variant-outline',
    defaultOpen: false,
    children: [
      {
        label: 'Pengantar',
        to: docs,
      }, 
      {
        label: 'Landasan Teori',
        to: `${docs}/landasan-teori`,
      }, 
      {
        label: 'Metodologi Numerik',
        to: `${docs}/metodologi-numerik`,
      },
      {
        label: 'Turunan Pertama',
        to: `${docs}/turunan-pertama`,
      },
      {
        label: 'Uji Kecekungan',
        to: `${docs}/uji-kecekungan`,
      },
      {
        label: 'Polynomial Regression',
        to: `${docs}/polynomial-fit`,
      },
      {
        label: 'Kompleksitas Algoritma',
        to: `${docs}/kompleksitas`,
      },
      {
        label: 'Validasi Matematis',
        to: `${docs}/validasi`,
      },
      {
        label: 'Interpretasi Grafik',
        to: `${docs}/interpretasi-grafik`,
      },
      {
        label: 'Contoh Analisis BTC/USDT',
        to: `${docs}/contoh-btc-usdt`,
      },
      {
        label: 'Diagram Alur Sistem',
        to: `${docs}/diagram-alur-sistem`,
      },
      {
        label: 'Lampiran Grafik',
        to: `${docs}/lampiran-grafik`,
      },
      {
        label: 'Kesimpulan & Rekomendasi',
        to: `${docs}/kesimpulan`,
      },
      {
        label: 'Referensi & Sumber',
        to: `${docs}/sumber`,
      },
    ],
  },
], 
[
  {
    label: 'Umpan Balik',
    icon: 'i-heroicons-chat-bubble-left-right',
    to: '/feedback',
  }, 
  {
    label: 'Tentang',
    icon: 'i-lucide-info',
    to: '/about',
  }
]] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      :min-size="10"
      :default-size="12"
      :max-size="15"
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <UDashboardSidebarCollapse />
        <h1 v-if="!collapsed">Menu</h1>
      </template>

      <template #default="{ collapsed }">

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <div class="mt-auto">
          <UDashboardSearchButton 
            class="ring-default w-full bg-gray-800 sm:hidden" 
            block 
            :collapsed=false 
            :label="selected.label"
            :icon="selected.icon" 
          />

          <UNavigationMenu
            :collapsed="collapsed"
            :items="links[1]"
            orientation="vertical"
            tooltip
            class="mt-3"
          />
        </div>
      </template>

    </UDashboardSidebar>

    <slot />

  </UDashboardGroup>
</template>
