<script setup lang="ts">
    const props = defineProps({
      rating: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        default: 5
      },
      size: {
        type: Number,
        default: 24   // default star size
      }
    })
    
    /**
     * 1. Bulatkan rating ke kelipatan 0.5
     */
    const rounded = computed(() => {
      return Math.round(props.rating * 2) / 2
    })
    
    /**
     * 2. Tentukan star list:
     *    contoh output:
     *    ['full', 'full', 'half', 'empty', 'empty']
     */
    const stars = computed(() => {
      const r = rounded.value
      const result = []
    
      for (let i = 1; i <= props.max; i++) {
        if (i <= Math.floor(r)) {
          result.push('full')
        } else if (i === Math.floor(r) + 1 && r % 1 === 0.5) {
          result.push('half')
        } else {
          result.push('empty')
        }
      }
      return result
    })
    </script>
    
    <template>
      <div class="flex items-center gap-1">
        <template v-for="(type, idx) in stars" :key="idx">
    
          <!-- FULL STAR -->
          <UIcon
            v-if="type === 'full'"
            name="tabler:star-filled"
            :style="{ fontSize: size + 'px' }"
            class="text-yellow-400"
          />
    
          <!-- HALF STAR -->
          <UIcon
            v-else-if="type === 'half'"
            name="tabler:star-half-filled"
            :style="{ fontSize: size + 'px' }"
            class="text-yellow-400"
          />
    
          <!-- EMPTY STAR -->
          <UIcon
            v-else
            name="tabler:star-filled"
            :style="{ fontSize: size + 'px' }"
            class="text-gray-400"
          />
    
        </template>
      </div>
    </template>
    