import { requiredEnv, optionalEnv } from '../utils/env'

const SUPABASE_URL = requiredEnv('SUPABASE_URL')
const SERVICE_KEY = requiredEnv('SUPABASE_SERVICE_KEY')

const DEBUG = optionalEnv('NODE_ENV', 'production') !== 'production'

// ================================
// 🔥 IN-MEMORY CACHE
// ================================
type CacheEntry<T> = {
  ts: number
  data: T
}

const FEEDBACK_STATS_CACHE = new Map<string, CacheEntry<any>>()
const FEEDBACK_LIST_CACHE  = new Map<string, CacheEntry<any>>()

// Cache TTL (ms)
const TTL = 6000_000 // 10 menit
const CACHE_KEY_STATS = 'feedback_stats'
const CACHE_KEY_LIST  = 'feedback_list'

// Utility log
function debugLog(...msg: any[]) {
  if (DEBUG) console.log(...msg)
}

// Utility clear cache
export function clearFeedbackCache() {
  FEEDBACK_STATS_CACHE.delete(CACHE_KEY_STATS)
  FEEDBACK_LIST_CACHE.delete(CACHE_KEY_LIST)
  debugLog('[FEEDBACK CACHE CLEAR] Stats + List cache deleted')
}

// ======================================================================
// INSERT FEEDBACK
// ======================================================================
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

  // ❗ Setelah insert, hapus cache
  clearFeedbackCache()
}

// ======================================================================
// GET FEEDBACK LIST
// ======================================================================
export async function getFeedbackList() {
  const now = Date.now()
  const cached = FEEDBACK_LIST_CACHE.get(CACHE_KEY_LIST)

  if (cached && now - cached.ts < TTL) {
    debugLog('[FEEDBACK CACHE HIT] list')
    return cached.data
  }

  debugLog('[FEEDBACK CACHE MISS] list → fetching from Supabase')

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

  const list = await res.json()

  // Simpan ke cache
  FEEDBACK_LIST_CACHE.set(CACHE_KEY_LIST, {
    ts: now,
    data: list,
  })

  return list
}

// ======================================================================
// GET FEEDBACK STATS
// ======================================================================
export async function getFeedbackStats() {
  const now = Date.now()
  const cached = FEEDBACK_STATS_CACHE.get(CACHE_KEY_STATS)

  if (cached && now - cached.ts < TTL) {
    debugLog('[FEEDBACK CACHE HIT] stats')
    return cached.data
  }

  debugLog('[FEEDBACK CACHE MISS] stats → fetching from Supabase')

  const url = `${SUPABASE_URL}/rest/v1/feedback?select=rating`
  const res = await fetch(url, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch feedback stats')
  }

  const rows: { rating: number }[] = await res.json()

  const count = rows.length
  const average = count === 0
    ? 0
    : rows.reduce((a, b) => a + b.rating, 0) / count

  const stats = {
    average: Number(average.toFixed(2)),
    count,
  }

  // Simpan ke cache
  FEEDBACK_STATS_CACHE.set(CACHE_KEY_STATS, {
    ts: now,
    data: stats,
  })

  return stats
}
