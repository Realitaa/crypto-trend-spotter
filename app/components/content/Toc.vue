<script setup lang="ts">
interface TocItem {
  id: string
  text: string
  children?: TocItem[]
}

defineProps<{
  toc: TocItem[]
}>()
</script>

<template>
  <!-- Hidden on mobile/tablet -->
  <aside v-if="toc.length" class="hidden lg:block col-span-4 xl:col-span-3">
    <div class="sticky top-24">

      <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
        On this page
      </h3>

      <ul class="space-y-2 text-sm">
        <li v-for="item in toc" :key="item.id">
          <a 
            :href="'#' + item.id"
            class="block text-gray-600 dark:text-gray-300 hover:text-primary-500"
          >
            {{ item.text }}
          </a>

          <!-- H3 children -->
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
</template>
