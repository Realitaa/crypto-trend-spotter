import { defineEventHandler, getRouterParams } from 'h3'
import { getPriceData } from '../../../services/price.service'
import { computeTrendAnalysis } from '../../../services/trend.service'

export default defineEventHandler(async (event) => {
  const { coin, tf } = getRouterParams(event)

  if (!coin || !tf) {
    throw createError({ statusCode: 400, message: 'Missing coin or tf' })
  }

  try {
    const priceData = await getPriceData(coin, tf)
    const result = computeTrendAnalysis(priceData, { coin, tf })

    return result
  } catch (err: any) {
    console.error('[Trend API Error]', err)
    throw createError({
      statusCode: 500,
      message: err.message || 'Gagal menghitung analisis tren',
    })
  }
})