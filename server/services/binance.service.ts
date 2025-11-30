import type { BinanceKlineData } from '../types/binance'

const BASE = 'https://api.binance.com'

export async function fetchBinanceKlines(
  symbol: string,
  interval: string,
  limit = 1000
): Promise<BinanceKlineData[]> {

  const url = `${BASE}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Binance error ${res.status}`)

  const data = await res.json()

  return data.map((d: any) => ({
    openTime: d[0],
    open: d[1],
    high: d[2],
    low: d[3],
    close: d[4],
    volume: d[5],
    closeTime: d[6],
  })) as BinanceKlineData[]
}

/**
 * Normalisasi Binance kline menjadi PricePoint[]
 */
export function normalizeBinanceKlines(data: BinanceKlineData[]) {
  return data.map(d => ({
    time: Math.floor(d.closeTime / 1000),
    value: Number(d.close),
  }))
}
