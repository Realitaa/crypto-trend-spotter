<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'

const props = defineProps<{ content: ParsedContent }>()

const tocLinks = computed(() => props.content?.body?.toc?.links ?? [])

// robust handleMove: accepts string or [string]
function handleMove(payload: string | [string]) {
  const id = Array.isArray(payload) ? payload[0] : payload
  if (!id) return

  const target = document.getElementById(id)
  if (!target) return

  // Ambil scroll container konten
  const mainEl = document.querySelector('main')
  const container = mainEl?.closest('[data-slot="body"]') as HTMLElement

  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()

  const offset = 80 // offset navbar

  const top = targetRect.top - containerRect.top + container.scrollTop - offset

  container.scrollTo({
    top,
    behavior: 'smooth'
  })
}
</script>

<template>
  <div class="grid grid-cols-12 gap-6 px-4 lg:px-8 py-10">

    <!-- Main content -->
    <main class="col-span-12 lg:col-span-8 xl:col-span-9">
      <ContentRenderer
        :value="content"
        class="prose dark:prose-invert max-w-[760px] mx-auto"
      />
    </main>

    <!-- TOC -->
    <aside v-if="tocLinks.length" class="hidden lg:block col-span-4 xl:col-span-3">
      <div class="sticky top-24">
        <UContentToc 
          :links="tocLinks" 
          title="Daftar Isi"
          highlight
          @move="handleMove"
        />
      </div>
    </aside>

  </div>
</template>
