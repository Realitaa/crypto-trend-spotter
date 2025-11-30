export function ensureString(value: any, name: string) {
  if (typeof value !== 'string') {
    throw new Error(`${name} must be a string`)
  }
  return value
}

export function ensureNumber(value: any, name: string) {
  const num = Number(value)
  if (Number.isNaN(num)) throw new Error(`${name} must be a number`)
  return num
}

export function ensureOneOf<T extends string>(value: string, allowed: T[], name: string): T {
  if (!allowed.includes(value as T)) {
    throw new Error(`${name} must be one of: ${allowed.join(', ')}`)
  }
  return value as T
}
  