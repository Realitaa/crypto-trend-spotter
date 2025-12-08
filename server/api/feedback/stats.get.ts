import { getFeedbackStats } from '../../services/feedback.service'

export default defineEventHandler(async () => {
  return await getFeedbackStats()
})
