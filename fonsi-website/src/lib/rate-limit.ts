const rateMap = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (!entry || now > entry.resetTime) {
    rateMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false
  entry.count++
  return true
}
