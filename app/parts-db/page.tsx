"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import type { ComponentType } from "../data/components"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchComponents, fetchComponentsByCategory, type FirebaseComponentData } from "@/lib/fetch-components"
import PartsSearch from "@/components/parts-search"

export default function PartsDB() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ComponentType>("vga")
  const [components, setComponents] = useState<Record<string, FirebaseComponentData[]>>({})
  const [currentComponents, setCurrentComponents] = useState<FirebaseComponentData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  // 모든 컴포넌트 카테고리 가져오기
  useEffect(() => {
    const loadAllComponents = async () => {
      try {
        setLoading(true)
        console.log("Fetching all components...")
        const data = await fetchComponents()
        console.log("Components fetched:", Object.keys(data))
        setComponents(data)
        setCategories(Object.keys(data))
        setLoading(false)
      } catch (error) {
        console.error("Error loading all components:", error)
        setLoading(false)
      }
    }

    loadAllComponents()
  }, [])

  // 선택된 카테고리의 컴포넌트 가져오기
  useEffect(() => {
    const loadCategoryComponents = async () => {
      if (!selectedType) return

      try {
        setLoading(true)
        // 이미 로드된 데이터가 있으면 사용
        if (components[selectedType]) {
          console.log(`Using cached components for ${selectedType}`)
          setCurrentComponents(components[selectedType])
          setLoading(false)
          return
        }

        // 없으면 Firebase에서 가져오기
        console.log(`Fetching components for ${selectedType}...`)
        const categoryComponents = await fetchComponentsByCategory(selectedType)
        console.log(`Fetched ${categoryComponents.length} components for ${selectedType}`)
        setCurrentComponents(categoryComponents)

        // 전체 컴포넌트 상태 업데이트
        setComponents((prev) => ({
          ...prev,
          [selectedType]: categoryComponents,
        }))

        setLoading(false)
      } catch (error) {
        console.error(`Error loading components for category ${selectedType}:`, error)
        setLoading(false)
      }
    }

    loadCategoryComponents()
  }, [selectedType, components])

  // 검색 쿼리에 따라 필터링된 컴포넌트 목록
  const filteredComponents = useMemo(() => {
    if (!searchQuery) return currentComponents

    const lowerQuery = searchQuery.toLowerCase()
    return currentComponents.filter((component) => {
      return (
        component.name.toLowerCase().includes(lowerQuery) ||
        (component.description && component.description.toLowerCase().includes(lowerQuery)) ||
        (component.specs && component.specs.toLowerCase().includes(lowerQuery))
      )
    })
  }, [currentComponents, searchQuery])

  // 부품 선택 핸들러
  const handleComponentSelect = (component: FirebaseComponentData) => {
    console.log(`Selected component: ${component.id} (${selectedType})`)
    // 로컬 스토리지에 선택한 부품 저장
    try {
      let currentConfig = {}
      const configStr = localStorage.getItem("pc_config")
      if (configStr) {
        currentConfig = JSON.parse(configStr)
      }

      const updatedConfig = {
        ...currentConfig,
        [selectedType]: {
          id: component.id,
          name: component.name,
          price: component.price,
          image: component.image || "/placeholder.svg",
        },
      }

      localStorage.setItem("pc_config", JSON.stringify(updatedConfig))
    } catch (e) {
      console.error("Failed to save component to localStorage:", e)
    }

    // select-type 페이지로 이동
    router.push(`/select-type?type=${selectedType}&id=${component.id}`)
  }

  // 검색 핸들러
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // 카테고리 변경 핸들러
  const handleCategoryChange = (category: ComponentType) => {
    setSelectedType(category)
    setSearchQuery("") // 카테고리 변경 시 검색어 초기화
  }

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">부품 DB</h1>

        {/* 부품 유형 선택과 검색창 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-4">
            {categories.map((type) => (
              <button
                key={type}
                onClick={() => handleCategoryChange(type as ComponentType)}
                className={`px-4 py-2 rounded-md ${
                  selectedType === type ? "bg-white text-black" : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 검색창 */}
          <PartsSearch onSearch={handleSearch} className="w-full md:w-64 mt-4 md:mt-0" />
        </div>

        {/* 검색 결과 표시 */}
        {searchQuery && (
          <div className="mb-4 text-gray-300">
            <p>
              검색 결과: {filteredComponents.length}개의 부품 {searchQuery && `"${searchQuery}" 검색`}
            </p>
          </div>
        )}

        {/* 카테고리 로딩 중 표시 */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {/* 선택된 부품 유형의 목록 */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredComponents.map((component) => (
              <Card
                key={component.id}
                className="bg-gray-950 border-gray-800 cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleComponentSelect(component)}
              >
                <CardContent className="p-6">
                  <div className="w-full h-48 relative mb-4">
                    <Image
                      src={component.image || "/placeholder.svg"}
                      alt={component.name}
                      width={200}
                      height={200}
                      className="object-contain w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{component.name}</h3>
                  <p className="text-2xl font-bold text-white mb-4">{component.price.toLocaleString()}원</p>
                  <ScrollArea className="h-[150px] mb-4">
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {component.description || component.specs || "상세 정보가 없습니다."}
                    </p>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

