"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  fetchComponentsWithEnhancedCache as fetchComponents,
  type FirebaseComponentData,
} from "@/lib/firebase-cache-enhanced"
import { sortByPopularity } from "@/lib/popularity-utils"

// Firebase 데이터를 커스텀 형식으로 변환
function convertFirebaseToCustomFormat(firebaseData: Record<string, FirebaseComponentData[]>) {
  const customData: Record<string, any[]> = {}

  // 카테고리 매핑 (Firebase ID → 커스텀 키)
  const categoryMapping: Record<string, string> = {
    Cpu: "cpu",
    Vga: "vga",
    "M.B": "mb",
    Memory: "memory",
    SSD: "ssd",
    Ssd: "ssd",
    Case: "case",
    Cooler: "cooler",
    Power: "power",
  }

  Object.entries(firebaseData).forEach(([firebaseCategory, components]) => {
    const customCategory = categoryMapping[firebaseCategory] || firebaseCategory.toLowerCase()

    if (components && components.length > 0) {
      // 인기순으로 정렬하고 상위 20개만 선택
      const sortedComponents = sortByPopularity(components)
      const top20Components = sortedComponents.slice(0, 20)

      console.log(`🏆 [${customCategory}] 인기순 상위 5개:`)
      top20Components.slice(0, 5).forEach((comp, idx) => {
        console.log(`  ${idx + 1}위: ${comp.name}`)
      })

      customData[customCategory] = top20Components.map((comp) => ({
        id: comp.id,
        name: comp.name,
        price: comp.price,
        image: comp.image || "/placeholder.svg",
        description: comp.description || comp.specs || "",
        category: customCategory,
      }))
    }
  })

  return customData
}

export default function CustomPC() {
  const router = useRouter()
  const [selectedComponents, setSelectedComponents] = useState<Record<string, any>>({})
  const [components, setComponents] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const categories = [
    { id: "cpu", name: "CPU", icon: "🔧" },
    { id: "vga", name: "그래픽카드", icon: "🎮" },
    { id: "mb", name: "메인보드", icon: "🔌" },
    { id: "memory", name: "메모리", icon: "💾" },
    { id: "ssd", name: "SSD", icon: "💿" },
    { id: "case", name: "케이스", icon: "📦" },
    { id: "cooler", name: "쿨러", icon: "❄️" },
    { id: "power", name: "파워서플라이", icon: "⚡" },
  ]

  // Load components data with enhanced cache
  useEffect(() => {
    const loadComponents = async () => {
      try {
        setLoading(true)
        setError(null)

        const startTime = performance.now()

        console.log("🚀 부품 DB 캐시 공유로 fetchComponents 호출...")
        const firebaseData = await fetchComponents()

        const loadTime = performance.now() - startTime
        console.log(`⚡ 커스텀 페이지 로딩 완료: ${loadTime.toFixed(2)}ms`)

        // Firebase 데이터를 커스텀 형식으로 변환 (인기순 상위 20개)
        const customData = convertFirebaseToCustomFormat(firebaseData)

        console.log("📦 변환된 카테고리들:", Object.keys(customData))
        setComponents(customData)

        // Load saved configuration
        const savedConfig = localStorage.getItem("pc_config")
        if (savedConfig) {
          try {
            setSelectedComponents(JSON.parse(savedConfig))
          } catch (e) {
            console.error("Failed to parse saved config:", e)
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading components:", error)
        setError("부품 데이터를 불러오는 중 오류가 발생했습니다.")
        setLoading(false)
      }
    }

    loadComponents()
  }, [])

  const totalPrice = useMemo(() => {
    return Object.values(selectedComponents).reduce((sum, component) => {
      return sum + (component?.price || 0)
    }, 0)
  }, [selectedComponents])

  const handleComponentSelect = (category: string, component: any) => {
    const updatedComponents = {
      ...selectedComponents,
      [category]: component,
    }
    setSelectedComponents(updatedComponents)

    // Save to localStorage
    try {
      localStorage.setItem("pc_config", JSON.stringify(updatedComponents))
    } catch (e) {
      console.error("Failed to save to localStorage:", e)
    }
  }

  const handleRemoveComponent = (category: string) => {
    const updatedComponents = { ...selectedComponents }
    delete updatedComponents[category]
    setSelectedComponents(updatedComponents)

    // Update localStorage
    try {
      localStorage.setItem("pc_config", JSON.stringify(updatedComponents))
    } catch (e) {
      console.error("Failed to update localStorage:", e)
    }
  }

  const handleGoToQuote = () => {
    router.push("/quote")
  }

  const handleGoToPartsDB = (category?: string) => {
    if (category) {
      router.push(`/parts-db?category=${category}`)
    } else {
      router.push("/parts-db")
    }
  }

  // 로딩 중일 때는 loading.tsx가 자동으로 표시됨
  if (loading) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            다시 시도
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">커스텀 PC 구성</h1>
          <p className="text-xl text-gray-300">원하는 부품을 선택하여 나만의 PC를 구성해보세요</p>
        </div>

        {/* Selected Components Summary */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">선택된 부품</h2>
            <div className="text-right">
              <p className="text-3xl font-bold text-green-400">{totalPrice.toLocaleString()}원</p>
              <p className="text-sm text-gray-400">총 예상 가격</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {categories.map((category) => {
              const selected = selectedComponents[category.id]
              return (
                <div key={category.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {category.icon} {category.name}
                    </span>
                    {selected && (
                      <Button
                        onClick={() => handleRemoveComponent(category.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 p-1 h-auto"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                  {selected ? (
                    <div>
                      <p className="text-sm text-white font-medium truncate">{selected.name}</p>
                      <p className="text-sm text-green-400">{selected.price?.toLocaleString()}원</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">선택되지 않음</p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleGoToQuote}
              className="flex-1"
              disabled={Object.keys(selectedComponents).length === 0}
            >
              견적서 생성
            </Button>
            <Button onClick={() => handleGoToPartsDB()} variant="outline">
              전체 부품 보기
            </Button>
          </div>
        </div>

        {/* Component Categories */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryComponents = components[category.id] || []
            const visibleProducts = categoryComponents.slice(0, 20) // 상위 20개만 표시

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: categories.indexOf(category) * 0.01 }}
                className="bg-gray-900 rounded-lg p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold">
                    {category.icon} {category.name}
                  </h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">인기 상위 {visibleProducts.length}개 표시</span>
                    <Button onClick={() => handleGoToPartsDB(category.id)} variant="outline" size="sm">
                      더보기
                    </Button>
                  </div>
                </div>

                {visibleProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {visibleProducts.map((component, index) => (
                      <motion.div
                        key={component.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.01 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                            selectedComponents[category.id]?.id === component.id
                              ? "ring-2 ring-blue-500 bg-blue-950/20"
                              : "bg-gray-800 hover:bg-gray-750"
                          }`}
                          onClick={() => handleComponentSelect(category.id, component)}
                        >
                          <CardContent className="p-4">
                            {/* 인기 순위 배지 */}
                            {index < 10 && (
                              <div className="absolute top-2 left-2 z-10">
                                <Badge variant="secondary" className="bg-yellow-600 text-white text-xs">
                                  {index + 1}위
                                </Badge>
                              </div>
                            )}

                            <div className="relative w-full h-32 mb-3">
                              <Image
                                src={component.image || "/placeholder.svg"}
                                alt={component.name}
                                fill
                                className="object-contain"
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                            <h4 className="font-medium text-sm mb-2 line-clamp-2 h-10">{component.name}</h4>
                            <p className="text-lg font-bold text-green-400">{component.price?.toLocaleString()}원</p>
                            {selectedComponents[category.id]?.id === component.id && (
                              <div className="mt-2">
                                <Badge variant="default" className="bg-blue-600">
                                  선택됨
                                </Badge>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">이 카테고리에 사용 가능한 부품이 없습니다.</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
