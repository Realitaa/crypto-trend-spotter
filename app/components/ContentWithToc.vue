<script setup lang="ts">
import type { ParsedContentv2 } from '@nuxt/content'

const props = defineProps<{
  content: ParsedContentv2
}>()

// compute toc
const toc = computed(() => props.content?.body?.toc?.links ?? [])
</script>

<template>
  <div class="grid grid-cols-12 gap-6 px-4 lg:px-8 py-10">

    <!-- Main Content -->
    <main class="col-span-12 lg:col-span-8 xl:col-span-9">
      <ContentRenderer 
        :value="content" 
        class="prose dark:prose-invert max-w-[760px] mx-auto"
      />
    </main>

    <!-- TOC Sidebar (desktop only) -->
    <aside 
      v-if="toc.length"
      class="hidden lg:block col-span-4 xl:col-span-3"
    >
      <div class="sticky top-24">
        <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
          Daftar Isi
        </h3>

        <ul class="space-y-2 text-sm">
          <li 
            v-for="item in toc" 
            :key="item.id"
          >
            <a 
              :href="'#' + item.id"
              class="block text-gray-600 dark:text-gray-300 hover:text-primary-500"
            >
              {{ item.text }}
            </a>

            <!-- children (H3) -->
            <ul 
              v-if="item.children?.length"
              class="ml-3 mt-1 space-y-1 border-l pl-3 border-gray-300 dark:border-gray-700"
            >
              <li 
                v-for="child in item.children"
                :key="child.id"
              >
                <a
                  :href="'#' + child.id"
                  class="block text-gray-500 dark:text-gray-400 hover:text-primary-500"
                >
                  {{ child.text }}
                </a>
              </li>
            </ul>

          </li>
        </ul>

      </div>
    </aside>

  </div>
</template>
