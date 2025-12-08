<script setup lang="ts">
    const { data, pending } = await useFetch('/api/feedback/stats', {
    key: 'feedback-stats'
    })
</script>

<template>
  <div v-if="pending">Memuat rating...</div>

  <div v-else>
    Website ini telah mendapat
    <strong>rating {{ data.average }}</strong>
    dari <strong>{{ data.count }} ulasan</strong>
    (<NuxtLink to="/rating" class="underline cursor-pointer text-blue-400 dark:text-green-600">lihat ulasan</NuxtLink>).
  </div>
</template>
    