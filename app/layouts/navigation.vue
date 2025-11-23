<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)

const links = [[{
  label: 'Ringkasan',
  icon: 'material-symbols-light:overview',
  to: '/overview',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Analisis Diferensial',
  icon: 'lucide:activity',
  to: '/analysis',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Uji Konveksitas',
  icon: 'ph:bezier-curve',
  to: '/convexity',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Deteksi Trend',
  icon: 'mynaui:trending-up-down-solid',
  to: '/trend',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Dokumentasi',
  icon: 'mdi:book-open-blank-variant-outline',
  to: '/documentation',
  onSelect: () => {
    open.value = false
  }
},
], [{
  label: 'Umpan Balik',
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/Realitaa',
  target: '_blank'
}, {
  label: 'Tentang',
  icon: 'i-lucide-info',
  to: '/about',
}]] satisfies NavigationMenuItem[][]
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
          <UDashboardSearchButton class="ring-default w-full bg-gray-800 sm:hidden" block collapsed="false" label="Bitcoin (Klik untuk Ganti)" icon="logos:bitcoin" />

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

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
