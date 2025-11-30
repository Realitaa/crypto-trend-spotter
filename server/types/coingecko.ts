/**
 * Response dari:
 * GET /coins/{id}/market_chart
 */
export interface CoinGeckoMarketChart {
  prices: [number, number][]  // [timestamp(ms), price]
  market_caps?: [number, number][]
  total_volumes?: [number, number][]
}

export interface CoinGeckoStatusMetricEntry {
  value: number
  time: number
}

export interface CoinGeckoStatusMetric {
  title: string
  entries: CoinGeckoStatusMetricEntry[]
}

export interface CoinGeckoStatusResponse {
  metrics: CoinGeckoStatusMetric[]
}
  