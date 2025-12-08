import { requiredEnv } from '../../utils/env'

const SUPABASE_URL = requiredEnv('SUPABASE_URL')
const SERVICE_KEY = requiredEnv('SUPABASE_SERVICE_KEY')

export default defineEventHandler(async () => {
  const url = `${SUPABASE_URL}/rest/v1/feedback?select=*`

  const res = await fetch(url, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch feedback list')
  }

  return await res.json()
})
