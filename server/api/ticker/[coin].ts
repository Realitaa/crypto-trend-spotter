import { SUPPORTED_COINS_MAP } from '~/utils/coins'

export default defineEventHandler(async (event) => {
  const coin = getRouterParams(event).coin.toLowerCase()

  if (!coin || !SUPPORTED_COINS_MAP[coin]) {
    throw createError({ statusCode: 404, message: 'Coin not found' })
  }

  const cacheKey = `ticker:${coin}`
  const cached = await useStorage().getItem(cacheKey)
  if (cached) return cached

  try {
    const url = 'https://api.coingecko.com/api/v3/simple/price'
    const params = new URLSearchParams({
      ids: coin,
      vs_currencies: 'usd',
      include_24hr_change: 'true',
      include_24hr_vol: 'true',
      include_last_updated_at: 'true',
    })

    const res = await fetch(`${url}?${params}`, {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
      },
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`HTTP ${res.status}: ${text}`)
    }

    const data = await res.json()
    const info = data[coin]

    const result = {
      price: info.usd,
      change24h: Number(info.usd_24h_change?.toFixed(2)) || 0,
      volume24h: info.usd_24h_vol || 0,
      lastUpdated: new Date(info.last_updated_at * 1000).toISOString(),
    }

    // Cache 30 detik (cukup untuk realtime feel)
    await useStorage().setItem(cacheKey, result, { ttl: 30 })

    return result
  } catch (error: any) {
    console.error('Ticker error:', error.message)
    return {
      price: 0,
      change24h: 0,
      volume24h: 0,
      lastUpdated: new Date().toISOString(),
      error: 'Failed to fetch',
    }
  }
})