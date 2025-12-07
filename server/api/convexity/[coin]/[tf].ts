// server/api/convexity/[coin]/[tf].ts
import type { H3Event } from 'h3'
import { getPriceData } from '../../../services/price.service'
import { computeConvexity } from '../../../services/convexity.service'

const DEBUG = true

export default defineEventHandler(async (event: H3Event) => {
  const { coin, tf } = event.context.params

  if (!coin || !tf) {
    throw createError({ statusCode: 400, message: 'Missing coin or timeframe' })
  }

  if (DEBUG) console.log(`[CONVEXITY] Request received: coin=${coin}, tf=${tf}`)

  // 1. Ambil data harga melalui service (sudah caching)
  const priceData = await getPriceData(coin, tf)

  if (!priceData || priceData.length === 0) {
    throw createError({ statusCode: 500, message: 'Failed to fetch price data' })
  }

  const times = priceData.map(p => p.time)
  const prices = priceData.map(p => p.value)

  // 2. Run convexity analysis
  const result = computeConvexity(times, prices, {
    coin,
    timeframe: tf,
    dataSource: 'Binance (cached-service)'
  })

  if (DEBUG) console.log(`[CONVEXITY] Analysis complete: coin=${coin}, tf=${tf}`)

  // 3. Kembalikan hasil final ke frontend
  return result
})
