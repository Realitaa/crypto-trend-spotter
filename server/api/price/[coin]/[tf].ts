import type { H3Event } from 'h3'
import { SUPPORTED_COINS_MAP } from '~/utils/coins'

const TIMEFRAME_MAP = {
  '5m':  { interval: '1m',  limit: 300 },
  '1h':  { interval: '5m',  limit: 500 },
  '1d':  { interval: '1h',  limit: 720 },
  '7d':  { interval: '4h',  limit: 500 },
  '30d': { interval: '12h', limit: 300 },
  '1y':  { interval: '1d',  limit: 365 },
}

export default cachedEventHandler(
  async (event: H3Event) => {
    const { coin, tf } = event.context.params

    if (!SUPPORTED_COINS_MAP[coin]) {
      throw createError({ statusCode: 404, message: 'Coin not found' })
    }
    if (!TIMEFRAME_MAP[tf]) {
      throw createError({ statusCode: 400, message: 'Invalid timeframe' })
    }

    const suffix = SUPPORTED_COINS_MAP[coin].suffix.toUpperCase()
    const symbol = `${suffix}USDT`

    const { interval, limit } = TIMEFRAME_MAP[tf]

    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`

    const klines = await $fetch<any[]>(url, { headers: { accept: 'application/json' } })

    return klines.map((c) => ({
      time: Math.floor(c[0] / 1000), // open time (seconds)
      value: Number(Number(c[4]).toFixed(8)), // close price
    }))
  },
  {
    maxAge: 60, // refresh tiap 1 menit, DIJAMIN
  }
)
