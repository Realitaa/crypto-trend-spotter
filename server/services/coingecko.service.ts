import { requiredEnv } from '../utils/env'
import type { CoinGeckoMarketChart } from '../types/coingecko'

const API_KEY = requiredEnv('COINGECKO_API_KEY')

export async function fetchCoinGeckoChart(
  coin: string,
  days: number | 'max'
): Promise<CoinGeckoMarketChart> {

  const params = new URLSearchParams({
    vs_currency: 'usd',
    days: days.toString(),
    precision: '8',
  })

  const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?${params}`

  const res = await fetch(url, {
    headers: {
      accept: 'application/json',
      'x-cg-demo-api-key': API_KEY,
    },
  })

  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`CoinGecko error ${res.status}: ${msg}`)
  }

  return await res.json() as CoinGeckoMarketChart
}
