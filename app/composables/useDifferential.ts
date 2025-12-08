import type { DifferentialResult } from '~/server/services/differential.service'

export function useDifferential(coinId: Ref<string>, timeframe: Ref<string>) {
  const queryKey = computed(() => `diff-${coinId.value}-${timeframe.value}`)

  const { data, pending, refresh } = useFetch<DifferentialResult>(
    () => `/api/differential/${coinId.value}/${timeframe.value}`,
    {
      key: queryKey,
      server: false,        // jangan SSR, hanya client
      watch: [coinId, timeframe],
    }
  )

  return {
    data,
    pending,
    refresh
  }
}
