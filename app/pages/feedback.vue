<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({ layout: 'navigation' })

const toast = useToast()

interface Schema {
  rating: number
  category: string
  message: string
  email?: string
}

const state = reactive<Schema>({
  rating: 0,
  category: 'Umum',
  message: '',
  email: ''
})

const categories = ref([
  'Umum',
  'UI/UX',
  'Performa',
  'Bug/Error',
  'Konten',
  'Fitur Baru',
  'Lainnya'
])

const isLoading = ref(false)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!state.rating) return

  isLoading.value = true
  await new Promise((resolve) => setTimeout(resolve, 1200))

  toast.add({
    title: 'Terima kasih!',
    description: 'Masukan Anda telah kami terima.',
    icon: 'i-heroicons-check-circle',
    color: 'primary'
  })

  state.rating = 0
  state.message = ''
  state.email = ''
  isLoading.value = false
}
</script>

<template>
  <UDashboardPanel :ui="{ body: 'px-0' }">
    <template #header><AppNavbar /></template>

    <template #body>
      <UContainer class="flex items-center justify-center min-h-[80vh] py-10">
        <UCard class="w-full max-w-[550px] shadow-lg dark:shadow-none ring-1 ring-gray-200 dark:ring-gray-800">

          <template #header>
            <div class="text-center space-y-2">
              <div class="inline-flex items-center justify-center p-3 mb-2 bg-primary-50 dark:bg-primary-900/20 rounded-full">
                <UIcon name="i-heroicons-chat-bubble-left-right" class="w-8 h-8 text-primary-500" />
              </div>

              <h2 class="text-2xl font-bold">Beri Kami Umpan Balik</h2>

              <p class="text-sm text-gray-500 dark:text-gray-400">
                Masukan Anda membantu kami meningkatkan layanan.
              </p>
            </div>
          </template>

          <UForm :state="state" class="flex flex-col space-y-5" @submit="onSubmit">

            <h3 class="text-md font-bold text-center">Seberapa puas Anda?</h3>

            <!-- Rating -->
            <UFormGroup name="rating" class="text-center">
              <div class="flex items-center justify-center gap-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  class="p-1 rounded-full transition-transform hover:scale-110"
                  type="button"
                  @click="state.rating = star"
                >
                  <UIcon
                    :name="star <= state.rating ? 'i-heroicons-star-solid' : 'i-lucide-star'"
                    class="w-8 h-8"
                    :class="star <= state.rating ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-600'"
                  />
                </button>
              </div>

              <!-- <p v-if="state.rating === 0" class="mt-1 text-xs text-red-500">
                Wajib memberikan rating bintang.
              </p> -->
            </UFormGroup>

            <!-- Grid: kategori + textarea -->
              <UFormGroup name="category" label="Kategori" class="sm:col-span-1">
                <USelect
                    v-model="state.category"
                    class="w-full"
                    :items="categories"
                    icon="i-heroicons-tag"
                    size="md"
                />
              </UFormGroup>

              <UFormGroup name="message" label="Pesan Anda" class="sm:col-span-2">
                <UTextarea
                  v-model="state.message"
                  class="w-full"
                  placeholder="Ceritakan pengalaman Anda…"
                  rows="5"
                  autoresize
                />
              </UFormGroup>

            <!-- Email -->
            <UFormGroup name="email" label="Email (Opsional)" hint="Kami mungkin menghubungi Anda.">
              <UInput v-model="state.email" class="w-full" icon="i-heroicons-envelope" placeholder="nama@email.com (opsional)" />
            </UFormGroup>

            <!-- Button -->
            <UButton color="primary" block size="lg" :loading="isLoading">
              Kirim Umpan Balik
              <template #trailing><UIcon name="i-heroicons-paper-airplane" /></template>
            </UButton>
          </UForm>

          <template #footer>
            <p class="text-xs text-center text-gray-400 dark:text-gray-500 pt-1">
              Dengan mengirimkan, Anda setuju masukan ini digunakan untuk perbaikan internal.
            </p>
          </template>

        </UCard>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
