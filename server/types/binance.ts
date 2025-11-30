/**
 * Kline/Candlestick
 */
export interface BinanceKlineData {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
}

/**
 * Response dari WebSocket stream
 */
export interface BinanceWSKlineEvent {
  e: 'kline'
  E: number
  s: string
  k: {
    t: number
    T: number
    s: string
    i: string
    o: string
    c: string
    h: string
    l: string
    v: string
    x: boolean
  }
}

/**
 * Normalisasi WebSocket menjadi PricePoint
 */
export interface BinancePricePoint {
  time: number
  value: number
}
  