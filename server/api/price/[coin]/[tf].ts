// server/api/price/[coin]/[tf].ts  ← VERSI FINAL & AMAN 100%
import { getCache, setCache } from '~/../server/utils/redis'
import { fetchCoinGecko } from '~/../server/utils/coingecko'

const CONFIG: Record<string, { days: number | 'max'; ttl: number }> = {
  '5m':   { days: 1,     ttl: 90 }, 
  '1h':   { days: 90,    ttl: 600 },  
  '1d':   { days: 365, ttl: 3600 }, 
  '7d':   { days: 180,   ttl: 14400 },
  '30d':  { days: 365,   ttl: 43200 },
  '1y':   { days: 365, ttl: 86400 },
}

export default defineEventHandler(async (event) => {
  const { coin, tf } = getRouterParams(event)
  if (!CONFIG[tf]) throw createError({ statusCode: 400, message: 'Invalid timeframe' })

  const key = `cg:${coin}:${tf}`
  const cached = await getCache<{ time: number; value: number }[]>(key)
  if (cached) return cached

  const cfg = CONFIG[tf]
  const raw = await fetchCoinGecko(coin, cfg.days)

  const data = raw.prices.map(([ts, price]) => ({
    time: Math.floor(ts / 1000) as UTCTimestamp,
    value: Number(price.toFixed(8)),
  }))

  await setCache(key, data, cfg.ttl)
  return data
})