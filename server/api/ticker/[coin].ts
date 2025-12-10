import { SUPPORTED_COINS_MAP } from '~/utils/coins'
import { requiredEnv, optionalEnv } from '../../utils/env'

const BASE_URL = optionalEnv('NODE_ENV', 'production') === 'production'
  ? requiredEnv('BINANCE_US_BASE_URL')
  : requiredEnv('BINANCE_BASE_URL')

export default cachedEventHandler(
  async (event) => {
    const { coin } = event.context.params

    if (!SUPPORTED_COINS_MAP[coin]) {
      throw createError({ statusCode: 404, message: 'Coin not found' })
    }

    const suffix = SUPPORTED_COINS_MAP[coin].suffix.toUpperCase()
    const symbol = `${suffix}USDT`

    const url = `${BASE_URL}/api/v3/ticker/24hr?symbol=${symbol}`

    const info = await $fetch(url)

    return {
      price: Number(Number(info.lastPrice || 0).toFixed(8)),
      change24h: Number(Number(info.priceChangePercent || 0).toFixed(2)),
      volume24h: Number(info.quoteVolume || 0),
      lastUpdated: new Date().toISOString(),
    }
  },
  {
    maxAge: 30, // 30 detik caching
  }
)
