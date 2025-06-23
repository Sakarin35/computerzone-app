import {
  fetchComponents as originalFetchComponents,
  fetchComponentsByCategory as originalFetchComponentsByCategory,
  type FirebaseComponentData,
} from "./fetch-components"

// 캐시 저장소
class ComponentCache {
  private static instance: ComponentCache
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5분

  static getInstance(): ComponentCache {
    if (!ComponentCache.instance) {
      ComponentCache.instance = new ComponentCache()
    }
    return ComponentCache.instance
  }

  // 캐시에서 데이터 가져오기
  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) {
      console.log(`🔍 캐시 미스: ${key}`)
      return null
    }

    const now = Date.now()
    const isExpired = now - cached.timestamp > this.CACHE_DURATION

    if (isExpired) {
      console.log(`⏰ 캐시 만료: ${key}`)
      this.cache.delete(key)
      return null
    }

    console.log(`⚡ 캐시 히트: ${key}`)
    return cached.data
  }

  // 캐시에 데이터 저장
  set(key: string, data: any): void {
    console.log(`💾 캐시 저장: ${key}`)
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  // 캐시 상태 확인
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }

  // 캐시 초기화
  clear(): void {
    console.log("🗑️ 캐시 초기화")
    this.cache.clear()
  }
}

const cache = ComponentCache.getInstance()

// 🎯 기존 fetchComponents 함수를 감싸는 캐시 래퍼
export async function fetchComponentsWithCache(): Promise<Record<string, FirebaseComponentData[]>> {
  const cacheKey = "all_components"

  // 캐시에서 먼저 확인
  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // 캐시에 없으면 원본 함수 호출
  console.log("🔄 원본 fetchComponents 호출...")
  const data = await originalFetchComponents()

  // 성공적으로 데이터를 가져왔으면 캐시에 저장
  if (data && Object.keys(data).length > 0) {
    cache.set(cacheKey, data)
  }

  return data
}

// 🎯 기존 fetchComponentsByCategory 함수를 감싸는 캐시 래퍼
export async function fetchComponentsByCategoryWithCache(category: string): Promise<FirebaseComponentData[]> {
  const cacheKey = `category_${category}`

  // 캐시에서 먼저 확인
  const cachedData = cache.get(cacheKey)
  if (cachedData) {
    return cachedData
  }

  // 캐시에 없으면 원본 함수 호출
  console.log(`🔄 원본 fetchComponentsByCategory 호출: ${category}`)
  const data = await originalFetchComponentsByCategory(category)

  // 성공적으로 데이터를 가져왔으면 캐시에 저장
  if (data && data.length > 0) {
    cache.set(cacheKey, data)
  }

  return data
}

// 캐시 관리 함수들
export function getCacheStats() {
  return cache.getStats()
}

export function clearCache() {
  cache.clear()
}

// 기존 함수들도 그대로 export (호환성 유지)
export {
  fetchComponents as fetchComponentsOriginal,
  fetchComponentsByCategory as fetchComponentsByCategoryOriginal,
  fetchComponentById,
} from "./fetch-components"
export type { FirebaseComponentData } from "./fetch-components"
