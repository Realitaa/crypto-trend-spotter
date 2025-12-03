import { requiredEnv } from '../../utils/env'
import type { ApiResponse } from '../../types/api'

export default defineEventHandler(async (): Promise<ApiResponse<any>> => {
  const BASE_URL = requiredEnv('BINANCE_BASE_URL')
  const url = `${BASE_URL}/api/v3/ping`

  const start = Date.now()

  try {
    // Binance ping returns empty object {} with HTTP 200
    const res = await $fetch.raw(url, { timeout: 3000 })

    const responseTime = Date.now() - start

    // Ambil header rate limit dari Binance
    const usedWeight = res.headers.get('x-mbx-used-weight')
    const usedWeight1m = res.headers.get('x-mbx-used-weight-1m')
    const orderCount1m = res.headers.get('x-mbx-order-count-1m')

    return {
      ok: true,
      data: {
        responseTime, // ms latency from server → Binance API
        success: true,
        rateLimit: {
          usedWeight: usedWeight ? Number(usedWeight) : null,
          usedWeight1m: usedWeight1m ? Number(usedWeight1m) : null,
          orderCount1m: orderCount1m ? Number(orderCount1m) : null
        }
      },
    }
  } catch (err: any) {
    return {
      ok: false,
      error: 'Unable to reach Binance API',
    }
  }
})
