import Redis from 'ioredis'
import { optionalEnv } from './env'

const redis = new Redis({
  host: optionalEnv('REDIS_HOST', 'localhost'),
  port: Number(optionalEnv('REDIS_PORT', '6379')),
})

export async function getCache<T>(key: string): Promise<T | null> {
  const raw = await redis.get(key)
  return raw ? JSON.parse(raw) : null
}

export async function setCache<T>(key: string, data: T, ttl: number) {
  await redis.setex(key, ttl, JSON.stringify(data))
}

export default redis
