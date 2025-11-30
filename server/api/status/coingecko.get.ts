import type { CoinGeckoStatusResponse } from '../../types/coingecko'
import type { ApiResponse } from '../../types/api'

export default defineEventHandler(async (): Promise<ApiResponse<any>> => {
  try {
    const res = await $fetch<CoinGeckoStatusResponse>(
      'https://status.coingecko.com/metrics?period=day&lang=en',
      { timeout: 3000 }
    )

    const metric = res.metrics.find(m =>
      m.title?.includes('CoinGecko Public API Response time')
    )

    if (!metric) throw new Error('Metric not found')

    const last = metric.entries.at(-1)

    return {
      ok: true,
      data: {
        responseTime: last?.value ?? null,
        raw: last,
      },
    }
  } catch (err: any) {
    return {
      ok: false,
      error: 'Unable to reach CoinGecko Statuspage',
    }
  }
})
