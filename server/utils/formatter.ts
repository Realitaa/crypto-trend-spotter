export function formatTimestampMsToSec(ms: number) {
  return Math.floor(ms / 1000)
}

export function roundPrice(value: number, decimals = 8) {
  return Number(value.toFixed(decimals))
}
  