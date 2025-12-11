<!-- components/OnboardingModal.vue -->
<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title?: string
  guidePath?: string   // Opsional: kalau tidak dikirim pakai default '/guide'
}>()

const emit = defineEmits<{
  close: []
  'go-to-guide': [path: string]
}>()

const closeModal = () => {
  emit('close')
}

const goToGuide = () => {
  // Pakai props.guidePath kalau ada, fallback ke '/guide'
  const path = props.guidePath ?? '/guide'
  emit('go-to-guide', path)
}
</script>

<template>
  <UModal :open="open" :title="title ?? 'Panduan Singkat'" :close="false">
    <template #body>
      <slot />

      <!-- Tombol selalu ada di bawah konten slot -->
      <div class="flex gap-3 mt-6 justify-end">
        <UButton color="primary" variant="outline" @click="closeModal">
          Tutup
        </UButton>
        <UButton
          color="primary"
          variant="solid"
          trailing-icon="i-lucide-arrow-right"
          @click="goToGuide"
        >
          Baca Panduan
        </UButton>
      </div>
    </template>
  </UModal>
</template>