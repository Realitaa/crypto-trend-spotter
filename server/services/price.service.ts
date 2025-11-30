import { getCache, setCache } from '../utils/redis'
import { fetchCoinGeckoChart } from './coingecko.service'
import { fetchBinanceKlines, normalizeBinanceKlines } from './binance.service'
import type { NormalizedPriceData, PricePoint } from '../types/price'

const TIMEFRAME_CONFIG: Record<string, { binance: string; days: number | 'max'; ttl: number }> = {
  '5m':  { binance: '5m',   days: 1,    ttl: 90 },
  '1h':  { binance: '1h',   days: 90,   ttl: 600 },
  '1d':  { binance: '1d',   days: 365,  ttl: 3600 },
  '7d':  { binance: '1d',   days: 180,  ttl: 14400 },
  '30d': { binance: '1d',   days: 365,  ttl: 43200 },
  '1y':  { binance: '1d',   days: 365,  ttl: 86400 },
}

/**
 * Sumber prioritas:
 * - Binance (default)
 * - CoinGecko (fallback)
 */
export async function getPriceData(
  coin: string,
  tf: string
): Promise<NormalizedPriceData> {

  const cfg = TIMEFRAME_CONFIG[tf]
  if (!cfg) throw new Error('Invalid timeframe')

  const redisKey = `price:${coin}:${tf}`

  // CACHE FIRST
  const cached = await getCache<PricePoint[]>(redisKey)
  if (cached) {
    return {
      coin,
      timeframe: tf,
      points: cached,
      source: 'binance',
      cached: true,
    }
  }

  let points: PricePoint[] = []

  try {
    // 1) coba Binance
    const klines = await fetchBinanceKlines(coin.toUpperCase() + 'USDT', cfg.binance)
    points = normalizeBinanceKlines(klines)
  } catch {
    // 2) fallback ke CoinGecko
    const cg = await fetchCoinGeckoChart(coin, cfg.days)
    points = cg.prices.map(([ts, price]) => ({
      time: Math.floor(ts / 1000),
      value: Number(price.toFixed(8)),
    }))
  }

  await setCache(redisKey, points, cfg.ttl)

  return {
    coin,
    timeframe: tf,
    points,
    source: 'binance',
    cached: false,
  }
}
