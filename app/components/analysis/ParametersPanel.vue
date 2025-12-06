<script setup lang="ts">
import { reactive, watch } from 'vue'

// ------------------------
// Props & Emits
// ------------------------
const props = defineProps<{
  modelValue: {
    method: 'Forward' | 'Backward' | 'Central'
    enableSmoothing: boolean
    maLength: number
  }
}>()

const emit = defineEmits(['update:modelValue', 'recalculate'])

// ------------------------
// Local editable form
// ------------------------
const form = reactive({
  method: props.modelValue.method,
  enableSmoothing: props.modelValue.enableSmoothing,
  maLength: props.modelValue.maLength
})

// Sinkronisasi props → form saat props berubah
watch(
  () => props.modelValue,
  (v) => {
    form.method = v.method
    form.enableSmoothing = v.enableSmoothing
    form.maLength = v.maLength
  },
  { deep: true }
)

// Kirim perubahan ke parent
function applyChanges() {
  emit('update:modelValue', { ...form })
  emit('recalculate')
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800/40 border border-slate-200
              dark:border-slate-700/50 rounded-xl p-6 shadow-sm mb-6">

    <h3 class="font-semibold mb-4 text-slate-700 dark:text-slate-200 flex items-center gap-2">
      <UIcon name="lucide:settings" class="text-blue-500 dark:text-blue-400" />
      Parameter Analisis
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Method -->
      <div>
        <label class="text-xs font-medium text-slate-500 uppercase">Metode Diferensiasi</label>
        <select
          v-model="form.method"
          class="w-full mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border dark:border-slate-700">
          <option value="Forward">Forward Difference</option>
          <option value="Backward">Backward Difference</option>
          <option value="Central">Central Difference (Rekomendasi)</option>
        </select>
      </div>

      <!-- Smoothing toggle -->
      <div>
        <label class="text-xs font-medium text-slate-500 uppercase">Smoothing (SMA)</label>

        <div class="mt-2 flex items-center gap-3">
          <button
            @click="form.enableSmoothing = !form.enableSmoothing"
            class="relative w-12 h-6 rounded-full transition-all"
            :class="form.enableSmoothing ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'">

            <span
              :class="form.enableSmoothing ? 'translate-x-6' : 'translate-x-1'"
              class="absolute top-1 h-4 w-4 rounded-full bg-white transition-transform" />
          </button>

          <span class="text-sm text-slate-600 dark:text-slate-300">
            {{ form.enableSmoothing ? 'Aktif' : 'Nonaktif' }}
          </span>
        </div>

        <!-- MA Length -->
        <div v-if="form.enableSmoothing" class="mt-3 animate-in fade-in slide-in-from-top-2">
          <label class="text-xs font-medium text-slate-500 uppercase">MA Length</label>
          <input
            v-model.number="form.maLength"
            type="number"
            min="1"
            class="w-full mt-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border dark:border-slate-700" />
        </div>
      </div>

      <!-- Apply -->
      <div class="flex items-end">
        <button
          @click="applyChanges"
          class="w-full py-2.5 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all">
          Terapkan & Hitung Ulang
        </button>
      </div>

    </div>
  </div>
</template>
