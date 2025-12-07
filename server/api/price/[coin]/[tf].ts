import { getPriceData } from '../../../services/price.service'

export default defineEventHandler(async (event) => {
  const { coin, tf } = event.context.params
  return await getPriceData(coin, tf)
})
