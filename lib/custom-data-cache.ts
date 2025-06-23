import { fetchCustomComponentData as originalFetchCustomComponentData } from "./custom-data-adapter"
import type { ComponentType, ComponentOption } from "@/app/data/components"

// 커스텀 페이지용 캐시 시스템 (parts-db와 동일한 로직)
class CustomDataCache {
  private static instance: CustomDataCache
  private memoryCache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly MEMORY_CACHE_DURATION = 10 * 60 * 1000 // 10분
  private readonly STORAGE_CACHE_DURATION = 60 * 60 * 1000 // 1시간
  private readonly STORAGE_PREFIX = "custom_cache_"

  static getInstance(): CustomDataCache {
    if (!CustomDataCache.instance) {
      CustomDataCache.instance = new CustomDataCache()
    }
    return CustomDataCache.instance
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
      console.error("Custom storage cache error:", error)
      return null
    }
  }

  // 캐시에서 데이터 가져오기
  get(key: string): { data: any; source: "memory" | "storage" | null } {
    // 1. 메모리 캐시 확인
    const memoryData = this.getFromMemory(key)
    if (memoryData) {
      console.log(`⚡ [커스텀] 메모리 캐시 히트: ${key}`)
      return { data: memoryData, source: "memory" }
    }

    // 2. localStorage 캐시 확인
    const storageData = this.getFromStorage(key)
    if (storageData) {
      console.log(`💾 [커스텀] 스토리지 캐시 히트: ${key}`)
      // 메모리 캐시에도 저장
      this.setMemory(key, storageData)
      return { data: storageData, source: "storage" }
    }

    console.log(`🔍 [커스텀] 캐시 미스: ${key}`)
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
      console.error("Custom storage cache save error:", error)
    }
  }

  // 캐시에 데이터 저장
  set(key: string, data: any): void {
    console.log(`💾 [커스텀] 캐시 저장: ${key}`)
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
    console.log("🗑️ [커스텀] 전체 캐시 초기화")
    this.memoryCache.clear()

    // localStorage 캐시도 초기화
    const keysToRemove = Object.keys(localStorage).filter((key) => key.startsWith(this.STORAGE_PREFIX))
    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }
}

const customCache = CustomDataCache.getInstance()

// 성능 측정 유틸리티
class CustomPerformanceTracker {
  private static timers: Map<string, number> = new Map()

  static start(label: string): void {
    this.timers.set(label, performance.now())
    console.log(`⏱️ [커스텀] ${label} 시작`)
  }

  static end(label: string): number {
    const startTime = this.timers.get(label)
    if (!startTime) return 0

    const duration = performance.now() - startTime
    console.log(`⏱️ [커스텀] ${label} 완료: ${duration.toFixed(2)}ms`)
    this.timers.delete(label)
    return duration
  }
}

// 🚀 캐시가 적용된 fetchCustomComponentData
export async function fetchCustomComponentDataWithCache(): Promise<Record<ComponentType, ComponentOption[]>> {
  const cacheKey = "custom_components"
  const performanceLabel = "fetchCustomComponents"

  CustomPerformanceTracker.start(performanceLabel)

  // 캐시에서 먼저 확인
  const cached = customCache.get(cacheKey)
  if (cached.data) {
    CustomPerformanceTracker.end(performanceLabel)
    console.log(`🎯 [커스텀] 캐시에서 로드 (${cached.source})`)
    return cached.data
  }

  // 캐시에 없으면 Firebase에서 가져오기
  console.log("🔄 [커스텀] Firebase에서 새로 로드...")
  CustomPerformanceTracker.start("custom_firebase_fetch")

  const data = await originalFetchCustomComponentData()

  CustomPerformanceTracker.end("custom_firebase_fetch")

  // 성공적으로 데이터를 가져왔으면 캐시에 저장
  if (data && Object.keys(data).length > 0) {
    customCache.set(cacheKey, data)
  }

  CustomPerformanceTracker.end(performanceLabel)
  return data
}

// 캐시 관리 함수들
export function getCustomCacheStats() {
  return customCache.getStats()
}

export function clearCustomCache() {
  customCache.clear()
}

// 기존 함수도 그대로 export (호환성 유지)
export { fetchCustomComponentData as fetchCustomComponentDataOriginal } from "./custom-data-adapter"
