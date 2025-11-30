import { insertFeedback } from '../services/feedback.service'
import type { ApiResponse } from '../types/api'

export default defineEventHandler(async (event): Promise<ApiResponse<null>> => {
  try {
    const body = await readBody(event)

    await insertFeedback({
      rating: body.rating,
      category: body.category,
      message: body.message,
      email: body.email || null,
    })

    return { ok: true, data: null }

  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || 'Internal server error',
    }
  }
})
