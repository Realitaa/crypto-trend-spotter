// composables/useFeedback.ts
import { computed } from 'vue'

export function useFeedback() {
  const { data, pending, error } = useFetch('/api/feedback', { key: 'feedback-list' })

  const stats = computed(() => {
    const list = data.value || []
    const total = list.length
    const avg = total === 0 ? 0 : list.reduce((a, b) => a + (b.rating || 0), 0) / total

    const perStar = [5,4,3,2,1].map(s => {
      const count = list.filter(i => i.rating === s).length
      const percent = total ? Math.round((count / total) * 100) : 0
      return {
        star: s,
        count,
        percent,
      }
    })

    // categories: assign colors round-robin from allowed palette
    const palette = ['primary','secondary','success','info','warning','error','neutral']
    const categoriesKeys = Array.from(new Set(list.map(i => i.category || 'Uncategorized')))
    const categories = categoriesKeys.map((cat, idx) => {
      const count = list.filter(i => (i.category || 'Uncategorized') === cat).length
      const percent = total ? Math.round((count / total) * 100) : 0
      return {
        category: cat,
        count,
        percent,
        color: palette[idx % palette.length]
      }
    })

    return {
      average: Number(avg.toFixed(2)),
      count: total,
      perStar,
      categories,
      list
    }
  })

  return { data, stats, pending, error }
}
