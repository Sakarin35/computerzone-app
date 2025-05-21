"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchComponents, fetchComponentsByCategory, type FirebaseComponentData } from "@/lib/fetch-components"
import { checkFirebaseRules, testDirectDocumentCreation, createTestData } from "@/lib/firebase-debug"
import PartsSearch from "@/components/parts-search"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function PartsDB() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string>("")
  const [components, setComponents] = useState<Record<string, FirebaseComponentData[]>>({})
  const [currentComponents, setCurrentComponents] = useState<FirebaseComponentData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<"price-asc" | "price-desc" | "name-asc" | "name-desc">("price-asc")
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [isCheckingRules, setIsCheckingRules] = useState(false)
  const [isTestingDirectCreation, setIsTestingDirectCreation] = useState(false)
  const [isCreatingTestData, setIsCreatingTestData] = useState(false)

  // Firebase 보안 규칙 확인
  const handleCheckRules = async () => {
    try {
      setIsCheckingRules(true)
      setDebugInfo("Firebase 보안 규칙 확인 중...")

      const result = await checkFirebaseRules()

      if (result) {
        setDebugInfo("Firebase 보안 규칙 확인 완료: 접근 권한이 있습니다.")
      } else {
        setDebugInfo("Firebase 보안 규칙 확인 실패: 접근 권한이 없습니다.")
      }
    } catch (error) {
      console.error("Firebase 보안 규칙 확인 중 오류:", error)
      setDebugInfo(`Firebase 보안 규칙 확인 오류: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsCheckingRules(false)
    }
  }

  // 직접 문서 생성 테스트 핸들러
  const handleTestDirectCreation = async () => {
    try {
      setIsTestingDirectCreation(true)
      setDebugInfo("직접 문서 생성 테스트 중...")

      const result = await testDirectDocumentCreation()

      if (result.success) {
        setDebugInfo(`직접 문서 생성 테스트 성공: ${result.message}`)
      } else {
        setDebugInfo(`직접 문서 생성 테스트 실패: ${result.error}`)
      }
    } catch (error) {
      console.error("직접 문서 생성 테스트 중 오류:", error)
      setDebugInfo(`직접 문서 생성 테스트 오류: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsTestingDirectCreation(false)
    }
  }

  // 테스트 데이터 생성 핸들러
  const handleCreateTestData = async () => {
    try {
      setIsCreatingTestData(true)
      setDebugInfo("테스트 데이터 생성 중...")

      const result = await createTestData()

      if (result.success) {
        setDebugInfo(`테스트 데이터 생성 성공: ${result.message}`)
        // 데이터가 생성되었으므로 컴포넌트 다시 로드
        loadAllComponents()
      } else {
        setDebugInfo(`테스트 데이터 생성 실패: ${result.error}`)
      }
    } catch (error) {
      console.error("테스트 데이터 생성 중 오류:", error)
      setDebugInfo(`테스트 데이터 생성 오류: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsCreatingTestData(false)
    }
  }

  // 모든 컴포넌트 로드 함수
  const loadAllComponents = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching all components...")

      const data = await fetchComponents()
      console.log("Components fetched:", Object.keys(data))

      // Check if data is empty
      const hasData = Object.values(data).some((arr) => arr && arr.length > 0)
      if (!hasData) {
        console.error("No components data available")
        setError("부품 데이터를 불러올 수 없습니다.")
      }

      setComponents(data)

      // Set categories and select first one
      const availableCategories = Object.keys(data).filter((cat) => data[cat]?.length > 0)
      console.log("Available categories:", availableCategories)
      setCategories(availableCategories)

      if (availableCategories.length > 0 && !selectedType) {
        setSelectedType(availableCategories[0])
      }

      setLoading(false)
    } catch (error) {
      console.error("Error loading all components:", error)
      setError("부품 데이터를 불러오는 중 오류가 발생했습니다.")
      setLoading(false)
    }
  }

  // Fetch all component categories
  useEffect(() => {
    loadAllComponents()
  }, [])

  // Fetch components for selected category
  useEffect(() => {
    const loadCategoryComponents = async () => {
      if (!selectedType) return

      try {
        setLoading(true)
        setError(null)

        // Use cached data if available
        if (components[selectedType]) {
          console.log(`Using cached components for ${selectedType}:`, components[selectedType])
          setCurrentComponents(components[selectedType])
          setLoading(false)
          return
        }

        // Otherwise fetch from Firebase
        console.log(`Fetching components for ${selectedType}...`)
        const categoryComponents = await fetchComponentsByCategory(selectedType)
        console.log(`Fetched ${categoryComponents.length} components for ${selectedType}:`, categoryComponents)

        if (categoryComponents.length === 0) {
          console.warn(`No components found for category ${selectedType}`)
        }

        setCurrentComponents(categoryComponents)

        // Update the components state
        setComponents((prev) => ({
          ...prev,
          [selectedType]: categoryComponents,
        }))

        setLoading(false)
      } catch (error) {
        console.error(`Error loading components for category ${selectedType}:`, error)
        setError(`${selectedType} 카테고리의 부품을 불러오는 중 오류가 발생했습니다.`)
        setLoading(false)
      }
    }

    loadCategoryComponents()
  }, [selectedType, components])

  // Filter components based on search query
  const filteredComponents = useMemo(() => {
    if (!currentComponents) return []

    let filtered = [...currentComponents]
    console.log(`Filtering ${filtered.length} components with query: "${searchQuery}"`)

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((component) => {
        const nameMatch = component.name?.toLowerCase().includes(lowerQuery) || false
        const descMatch = component.description?.toLowerCase().includes(lowerQuery) || false
        const specsMatch = component.specs?.toLowerCase().includes(lowerQuery) || false

        return nameMatch || descMatch || specsMatch
      })
      console.log(`Found ${filtered.length} components matching query`)
    }

    // Sort components
    switch (sortOption) {
      case "price-asc":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case "price-desc":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case "name-asc":
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        break
      case "name-desc":
        filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""))
        break
    }

    return filtered
  }, [currentComponents, searchQuery, sortOption])

  // Handle component selection
  const handleComponentSelect = (component: FirebaseComponentData) => {
    console.log(`Selected component: ${component.id} (${selectedType})`, component)
    // Save selected component to local storage
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

    // Navigate to select-type page
    router.push(`/select-type?type=${selectedType}&id=${component.id}`)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedType(category)
    setSearchQuery("") // Reset search query when changing category
  }

  // Handle sort option change
  const handleSortChange = (option: "price-asc" | "price-desc" | "name-asc" | "name-desc") => {
    setSortOption(option)
  }

  // Format category name for display
  const formatCategoryName = (category: string): string => {
    const categoryMap: Record<string, string> = {
      vga: "그래픽카드",
      cpu: "CPU",
      mb: "메인보드",
      memory: "메모리",
      ssd: "SSD",
      case: "케이스",
      cooler: "쿨러",
      power: "파워서플라이",
      "m.b": "메인보드",
      "test-category": "테스트 카테고리",
    }

    return categoryMap[category?.toLowerCase()] || category?.toUpperCase() || ""
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

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded-md mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* 디버그 정보 및 Firebase 보안 규칙 확인 버튼 */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            {debugInfo && (
              <div className="bg-blue-900/50 border border-blue-500 text-white p-4 rounded-md">
                <p className="font-mono text-sm">{debugInfo}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              onClick={handleCheckRules}
              disabled={isCheckingRules}
              variant="outline"
              className="whitespace-nowrap"
            >
              {isCheckingRules ? "확인 중..." : "Firebase 권한 확인"}
            </Button>
            <Button
              onClick={handleTestDirectCreation}
              disabled={isTestingDirectCreation}
              variant="outline"
              className="whitespace-nowrap"
            >
              {isTestingDirectCreation ? "테스트 중..." : "직접 문서 생성 테스트"}
            </Button>
            <Button
              onClick={handleCreateTestData}
              disabled={isCreatingTestData}
              variant="outline"
              className="whitespace-nowrap"
            >
              {isCreatingTestData ? "생성 중..." : "테스트 데이터 생성"}
            </Button>
          </div>
        </div>

        {/* Category tabs */}
        {categories.length > 0 ? (
          <Tabs value={selectedType} onValueChange={handleCategoryChange} className="mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
              {categories.map((type) => (
                <TabsTrigger key={type} value={type} className="text-sm">
                  {formatCategoryName(type)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <div className="text-center py-6 mb-8 bg-gray-900 rounded-lg">
            <p className="text-gray-400">사용 가능한 카테고리가 없습니다.</p>
          </div>
        )}

        {/* Search and sort options */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="w-full md:w-64">
            <PartsSearch onSearch={handleSearch} className="w-full" />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">정렬:</span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 text-sm"
            >
              <option value="price-asc">가격 낮은순</option>
              <option value="price-desc">가격 높은순</option>
              <option value="name-asc">이름 오름차순</option>
              <option value="name-desc">이름 내림차순</option>
            </select>
          </div>
        </div>

        {/* Search results info */}
        {searchQuery && (
          <div className="mb-4 text-gray-300">
            <p>
              검색 결과: {filteredComponents.length}개의 부품 {searchQuery && `"${searchQuery}" 검색`}
            </p>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}

        {/* Component list */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredComponents.length > 0 ? (
              filteredComponents.map((component) => (
                <Card
                  key={component.id}
                  className="bg-gray-950 border-gray-800 cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleComponentSelect(component)}
                >
                  <CardContent className="p-6">
                    <div className="w-full h-48 relative mb-4">
                      <Image
                        src={component.image || "/placeholder.svg"}
                        alt={component.name || "부품 이미지"}
                        width={200}
                        height={200}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <div className="mb-2">
                      <h3 className="text-xl font-semibold text-white">{component.name}</h3>
                      <p className="text-sm text-gray-400">{formatCategoryName(component.category || "")}</p>
                    </div>
                    <p className="text-2xl font-bold text-white mb-4">{component.price?.toLocaleString()}원</p>
                    <ScrollArea className="h-[150px] mb-4">
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {component.specs || component.description || "상세 정보가 없습니다."}
                      </p>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-400">이 카테고리에 부품이 없습니다.</p>
                <Button onClick={handleCreateTestData} className="mt-4">
                  테스트 데이터 생성하기
                </Button>
              </div>
            )}
          </div>
        )}

        {!loading && filteredComponents.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
