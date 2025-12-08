<script setup lang="ts">
import katex from "katex";
import { computed } from "vue";

const props = defineProps({
  inline: { type: Boolean, default: false }
});

// ambil isi dari slot (raw text, tidak diproses Markdown)
const slots = useSlots();

const expr = computed(() => {
  const raw = slots.default?.()
    ?.map(n => (typeof n.children === "string" ? n.children : ""))
    ?.join("") ?? "";

  return raw.trim();
});

const html = computed(() =>
  katex.renderToString(expr.value, {
    displayMode: !props.inline,
    throwOnError: false,
  })
);
</script>

<template>
  <span v-if="inline" class="katex-inline" v-html="html"></span>
  <div v-else class="katex-block" v-html="html"></div>
</template>

<style scoped>
.katex-inline {
  display: inline-block;
  vertical-align: middle;
}
.katex-block {
  text-align: center;
  margin: 1.5rem 0;
  font-size: 1.2rem;
}
</style>
