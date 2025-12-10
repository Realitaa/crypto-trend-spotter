<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({ layout: 'navigation' })

const toast = useToast()

const schema = z.object({
  rating: z.coerce.number().min(1, 'Minimal 1 bintang.').max(5),
  category: z.string().min(1, 'Kategori tidak boleh kosong.'),
  message: z.string().min(3, 'Pesan wajib diisi.'),
  username: z.string().optional(),
})

const state = reactive({
  rating: 0,
  category: 'Umum',
  message: '',
  username: ''
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

async function onSubmit(event: FormSubmitEvent<z.infer<typeof schema>>) {
  isLoading.value = true

  try {
    await $fetch('/api/feedback/submit', {
        method: 'POST',
        body: event.data
    })

    toast.add({ title: 'Success', description: 'Umpan balik diterima! Terima kasih sudah memberikan umpan balik.' })

    state.rating = 0
    state.message = ''
    state.username = ''

  } catch (err) {
    console.log('ERROR SUBMIT:', err)

    toast.add({
      title: 'Error',
      description: 'Gagal mengirim.',
      color: 'error'
    })
  }

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
                Masukan Anda membantu kami meningkatkan layanan. User Experience Form: <ULink to="https://docs.google.com/forms/d/e/1FAIpQLSdqQo5zpS3yqUJJIdpdJorLsVtbB8EdCV0_mGt1yEiRX0eIbA/viewform?usp=header" target="_blank">Klik Disini</ULink>
              </p>
            </div>
          </template>

          <UForm :schema="schema" :state="state" class="flex flex-col space-y-5" @submit="onSubmit">

            <h3 class="text-md font-bold text-center">Seberapa puas Anda?</h3>

            <UFormField name="rating" class="text-center">
                <div class="flex items-center justify-center gap-2">
                    <button
                    v-for="star in 5"
                    :key="star"
                    class="p-1 rounded-full transition-transform hover:scale-110"
                    type="button"
                    @click="state.rating = Number(star)"
                    >
                    <UIcon
                        :name="star <= state.rating ? 'tabler:star-filled' : 'tabler:star'"
                        class="w-8 h-8"
                        :class="star <= state.rating ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-600'"
                    />
                    </button>
                </div>
                </UFormField>

                <UFormField name="category" label="Kategori">
                    <USelect v-model="state.category" class="w-full" :items="categories" placeholder="Pilih Kategori" />
                </UFormField>

                <UFormField name="message" label="Pesan">
                    <UTextarea v-model="state.message" class="w-full" :rows="5" placeholder="Pengalaman kamu menggunakan Cypto Trading Spotter..." autoresize />
                </UFormField>

                <UFormField name="username" label="Username (Opsional)">
                    <UInput v-model="state.username" class="w-full" icon="material-symbols:person" placeholder="Pengguna" />
                </UFormField>

                <UButton type="submit" block color="primary" :loading="isLoading">
                Kirim Umpan Balik
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
