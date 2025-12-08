// server/api/differential/[coin]/[tf].ts
import { getPriceData } from '../../../services/price.service'
import { calculateDifferential } from '../../../services/differential.service'

export default defineEventHandler(async (event) => {
  const { coin, tf } = getRouterParams(event)
  const { smoothing = 'false' } = getQuery(event)

  // Validasi sederhana
  if (tf !== '1d') {
    throw createError({ statusCode: 400, message: 'Saat ini hanya mendukung timeframe 1d' })
  }

  const isSmoothing = smoothing === 'true' || smoothing === '1'

  try {
    const rawData = await getPriceData(coin, tf)

    const result = calculateDifferential(rawData, { smoothing: isSmoothing })

    // Tambah metadata biar frontend tahu
    result.metadata.coin = coin
    result.metadata.tf = tf
    result.metadata.smoothed = isSmoothing

    return result
  } catch (err: any) {
    console.error('[Differential API Error]', err)
    throw createError({
      statusCode: 500,
      message: err.message || 'Gagal mengambil atau menghitung data diferensial',
    })
  }
})