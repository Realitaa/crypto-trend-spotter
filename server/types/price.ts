/**
 * Titik harga standar (universal)
 * time → UNIX (detik)
 * value → harga
 */
export interface PricePoint {
  time: number
  value: number
}

/**
 * Struktur harga setelah diproses
 */
export interface NormalizedPriceData {
  coin: string
  timeframe: string
  points: PricePoint[]
  source: 'coingecko' | 'binance'
  cached: boolean
}
  