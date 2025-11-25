// server/utils/coingecko.ts  ← VERSI BENAR & SUDAH DISESUAIKAN DOKUMEN RESMI
export async function fetchCoinGecko(
    coin: string,
    days: number | 'max'
  ) {
    const params = new URLSearchParams({
      vs_currency: 'usd',
      days: days.toString(),
      precision: '8',
    })
  
    // CoinGecko otomatis kasih:
    // - minute  → kalau days ≤ 1
    // - hourly  → kalau 1 < days ≤ 90
    // - daily   → kalau days > 90 atau pakai interval=daily
  
    const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?${params}`
  
    const res = await fetch(url, {
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
      },
    })
  
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`CoinGecko error ${res.status}: ${text}`)
    }
  
    return (await res.json()) as {
      prices: [number, number][] // [timestamp ms, price]
    }
  }