import {
  fetchComponents as originalFetchComponents,
  fetchComponentsByCategory as originalFetchComponentsByCategory,
  type FirebaseComponentData,
} from "./fetch-components"

// 브라우저 localStorage를 활용한 영구 캐시
class EnhancedComponentCache {
  private static instance: EnhancedComponentCache
  private memoryCache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly MEMORY_CACHE_DURATION = 10 * 60 * 1000 // 10분
  private readonly STORAGE_CACHE_DURATION = 60 * 60 * 1000 // 1시간
  private readonly STORAGE_PREFIX = "pc_cache_"

  static getInstance(): EnhancedComponentCache {
    if (!EnhancedComponentCache.instance) {
      EnhancedComponentCache.instance = new EnhancedComponentCache()
    }
    return EnhancedComponentCache.instance
  }

  // 메모리 캐시에서 가져오기
  private getFromMemory(key: string): any | null {
    const cached = this.memoryCache.get(key)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > this.MEMORY_CACHE_DURATION
    if (isExpired) {
      this.memoryCache.delete(key)
      return null
    }

    return cached.data
  }

  // localStorage에서 가져오기
  private getFromStorage(key: string): any | null {
    try {
      const storageKey = this.STORAGE_PREFIX + key
      const cached = localStorage.getItem(storageKey)
      if (!cached) return null

      const parsed = JSON.parse(cached)
      const isExpired = Date.now() - parsed.timestamp > this.STORAGE_CACHE_DURATION

      if (isExpired) {
        localStorage.removeItem(storageKey)
        return null
      }

      return parsed.data
    } catch (error) {
      console.error("Storage cache error:", error)
      return null
    }
  }

  // 캐시에서 데이터 가져오기 (메모리 → localStorage 순서)
  get(key: string): { data: any; source: "memory" | "storage" | null } {
    // 1. 메모리 캐시 확인
    const memoryData = this.getFromMemory(key)
    if (memoryData) {
      console.log(`⚡ 메모리 캐시 히트: ${key}`)
      return { data: memoryData, source: "memory" }
    }

    // 2. localStorage 캐시 확인
    const storageData = this.getFromStorage(key)
    if (storageData) {
      console.log(`💾 스토리지 캐시 히트: ${key}`)
      // 메모리 캐시에도 저장
      this.setMemory(key, storageData)
      return { data: storageData, source: "storage" }
    }

    console.log(`🔍 캐시 미스: ${key}`)
    return { data: null, source: null }
  }

  // 메모리 캐시에 저장
  private setMemory(key: string, data: any): void {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  // localStorage에 저장
  private setStorage(key: string, data: any): void {
    try {
      const storageKey = this.STORAGE_PREFIX + key
      const cacheData = {
        data,
        timestamp: Date.now(),
      }
      localStorage.setItem(storageKey, JSON.stringify(cacheData))
    } catch (error) {
      console.error("Storage cache save error:", error)
    }
  }

  // 캐시에 데이터 저장 (메모리 + localStorage)
  set(key: string, data: any): void {
    console.log(`💾 캐시 저장: ${key}`)
    this.setMemory(key, data)
    this.setStorage(key, data)
  }

  // 캐시 상태 확인
  getStats(): { memory: number; storage: number; keys: string[] } {
    const storageKeys = Object.keys(localStorage).filter((key) => key.startsWith(this.STORAGE_PREFIX))

    return {
      memory: this.memoryCache.size,
      storage: storageKeys.length,
      keys: Array.from(this.memoryCache.keys()),
    }
  }

  // 캐시 초기화
  clear(): void {
    console.log("🗑️ 전체 캐시 초기화")
    this.memoryCache.clear()

    // localStorage 캐시도 초기화
    const keysToRemove = Object.keys(localStorage).filter((key) => key.startsWith(this.STORAGE_PREFIX))
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }
}

const cache = EnhancedComponentCache.getInstance()

// 성능 측정 유틸리티
class PerformanceTracker {
  private static timers: Map<string, number> = new Map()

  static start(label: string): void {
    this.timers.set(label, performance.now())
    console.log(`⏱️ ${label} 시작`)
  }

  static end(label: string): number {
    const startTime = this.timers.get(label)
    if (!startTime) return 0

    const duration = performance.now() - startTime
    console.log(`⏱️ ${label} 완료: ${duration.toFixed(2)}ms`)
    this.timers.delete(label)
    return duration
  }
}

// 🚀 향상된 fetchComponents (성능 측정 + 강화된 캐시)
export async function fetchComponentsWithEnhancedCache(): Promise<Record<string, FirebaseComponentData[]>> {
  const cacheKey = "all_components"
  const performanceLabel = "fetchComponents"

  PerformanceTracker.start(performanceLabel)

  // 캐시에서 먼저 확인
  const cached = cache.get(cacheKey)
  if (cached.data) {
    PerformanceTracker.end(performanceLabel)
    console.log(`🎯 캐시에서 로드 (${cached.source})`)
    return cached.data
  }

  // 캐시에 없으면 Firebase에서 가져오기
  console.log("🔄 Firebase에서 새로 로드...")
  PerformanceTracker.start("firebase_fetch")

  const data = await originalFetchComponents()

  PerformanceTracker.end("firebase_fetch")

  // 성공적으로 데이터를 가져왔으면 캐시에 저장
  if (data && Object.keys(data).length > 0) {
    cache.set(cacheKey, data)
  }

  PerformanceTracker.end(performanceLabel)
  return data
}

// 🚀 향상된 fetchComponentsByCategory
export async function fetchComponentsByCategoryWithEnhancedCache(category: string): Promise<FirebaseComponentData[]> {
  const cacheKey = `category_${category}`
  const performanceLabel = `fetchCategory_${category}`

  PerformanceTracker.start(performanceLabel)

  // 캐시에서 먼저 확인
  const cached = cache.get(cacheKey)
  if (cached.data) {
    PerformanceTracker.end(performanceLabel)
    console.log(`🎯 ${category} 캐시에서 로드 (${cached.source})`)
    return cached.data
  }

  // 캐시에 없으면 Firebase에서 가져오기
  console.log(`🔄 ${category} Firebase에서 새로 로드...`)
  PerformanceTracker.start(`firebase_fetch_${category}`)

  const data = await originalFetchComponentsByCategory(category)

  PerformanceTracker.end(`firebase_fetch_${category}`)

  // 성공적으로 데이터를 가져왔으면 캐시에 저장
  if (data && data.length > 0) {
    cache.set(cacheKey, data)
  }

  PerformanceTracker.end(performanceLabel)
  return data
}

// 캐시 관리 함수들
export function getEnhancedCacheStats() {
  return cache.getStats()
}

export function clearEnhancedCache() {
  cache.clear()
}

// 기존 함수들도 그대로 export (호환성 유지)
export {
  fetchComponents as fetchComponentsOriginal,
  fetchComponentsByCategory as fetchComponentsByCategoryOriginal,
  fetchComponentById,
} from "./fetch-components"
export type { FirebaseComponentData } from "./fetch-components"
