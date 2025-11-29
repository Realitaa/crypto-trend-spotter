<!-- components/content/Katex.vue -->
<script setup lang="ts">
import katex from 'katex'

const props = defineProps<{
  expr: string
  display?: boolean  // alias block
}>()

const html = computed(() => katex.renderToString(props.expr, {
  displayMode: !!props.display,
  throwOnError: false,
}))
</script>

<template>
  <span
    v-if="!display"
    class="katex-inline align-middle"
    v-html="html"
  />
  <div
    v-else
    class="katex-block text-center my-6 text-lg"
    v-html="html"
  />
</template>

<style scoped>
.katex-inline { vertical-align: middle; }
</style>