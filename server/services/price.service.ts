import { SUPPORTED_COINS_MAP } from '~/utils/coins'
import { requiredEnv, optionalEnv } from '../utils/env'

const BASE_URL = optionalEnv('NODE_ENV', 'production') === 'production'
  ? requiredEnv('BINANCE_US_BASE_URL')
  : requiredEnv('BINANCE_BASE_URL')

const DEBUG = optionalEnv('NODE_ENV', 'production')

const TIMEFRAME_MAP = {
  '5m':  { interval: '1m',  limit: 300 },
  '1h':  { interval: '5m',  limit: 500 },
  '1d':  { interval: '1h',  limit: 720 },
  '7d':  { interval: '4h',  limit: 500 },
  '30d': { interval: '12h', limit: 300 },
  '1y':  { interval: '1d',  limit: 365 },
}

// ================================
// 🔥 IN-MEMORY CACHE
// ================================
const priceCache = new Map<string, { ts: number, data: any[] }>()

// Fetch langsung dari Binance
async function fetchBinance(symbol: string, tf: string) {
  const { interval, limit } = TIMEFRAME_MAP[tf]

  if (DEBUG) console.log(`[FETCH] Binance: ${symbol} interval=${interval} limit=${limit}`)

  const url = `${BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`

  const klines = await $fetch<any[]>(url)

  return klines.map(k => ({
    time: Math.floor(k[0] / 1000),
    value: Number(Number(k[4]).toFixed(8)),
  }))
}

export async function getPriceData(coin: string, tf: string) {
  const suffix = SUPPORTED_COINS_MAP[coin].suffix.toUpperCase()
  const symbol = `${suffix}USDT`

  const cacheKey = `${coin}:${tf}`

  // 1) Cek cache
  const cached = priceCache.get(cacheKey)
  const now = Date.now()

  if (cached && now - cached.ts < 60_000) {
    if (DEBUG) console.log(`[CACHE HIT] ${cacheKey}`)
    return cached.data
  }

  // 2) MISS → fetch Binance
  if (DEBUG) console.log(`[CACHE MISS] ${cacheKey}`)

  const fresh = await fetchBinance(symbol, tf)

  // 3) Simpan ke cache
  priceCache.set(cacheKey, {
    ts: now,
    data: fresh,
  })

  return fresh
}
