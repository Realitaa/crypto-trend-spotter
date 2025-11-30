import { requiredEnv } from '../utils/env'

const SUPABASE_URL = requiredEnv('SUPABASE_URL')
const SERVICE_KEY = requiredEnv('SUPABASE_SERVICE_KEY')

export async function insertFeedback(data: {
  rating: number
  category: string
  message: string
  email?: string | null
}) {
  const url = `${SUPABASE_URL}/rest/v1/feedback`

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      ...data,
      created_at: new Date().toISOString(),
    }),
  })
}
