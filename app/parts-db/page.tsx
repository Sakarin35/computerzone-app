"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchComponents, fetchComponentsByCategory, type FirebaseComponentData } from "@/lib/fetch-components"
import PartsSearch from "@/components/parts-search"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PartsFilter, { type FilterState } from "@/components/parts-filter"
import { generateFiltersFromComponents, applyFilters } from "@/lib/filter-utils"
import { calculatePopularityScore } from "@/lib/popularity-utils"

export default function PartsDB() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string>("")
  const [components, setComponents] = useState<Record<string, FirebaseComponentData[]>>({})
  const [currentComponents, setCurrentComponents] = useState<FirebaseComponentData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [sortOption, setSortOption] = useState<"price-asc" | "price-desc" | "name-asc" | "name-desc" | "popularity">(
    "popularity",
  )
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({})
  const [availableFilters, setAvailableFilters] = useState<any[]>([])

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

  // 컴포넌트가 로드될 때 필터 생성
  useEffect(() => {
    if (currentComponents && currentComponents.length > 0) {
      const generatedFilters = generateFiltersFromComponents(currentComponents, selectedType)
      setAvailableFilters(generatedFilters)
    }
  }, [currentComponents, selectedType])

  // Filter components based on search query
  const filteredComponents = useMemo(() => {
    if (!currentComponents) return []

    let filtered = [...currentComponents]

    // 필터 적용
    filtered = applyFilters(filtered, filters, selectedType)

    // 검색 쿼리 적용
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((component) => {
        const nameMatch = component.name?.toLowerCase().includes(lowerQuery) || false
        const descMatch = component.description?.toLowerCase().includes(lowerQuery) || false
        const specsMatch = component.specs?.toLowerCase().includes(lowerQuery) || false
        return nameMatch || descMatch || specsMatch
      })
    }

    // 정렬 적용
    switch (sortOption) {
      case "popularity":
        filtered.sort((a, b) => calculatePopularityScore(b) - calculatePopularityScore(a))
        break
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
  }, [currentComponents, searchQuery, sortOption, filters, selectedType])

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

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({})
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedType(category)
    setSearchQuery("") // Reset search query when changing category
    setFilters({}) // Reset filters when changing category
  }

  // Handle sort option change
  const handleSortChange = (option: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "popularity") => {
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
      // Firebase에서 실제 사용되는 카테고리 이름들
      Vga: "그래픽카드",
      Cpu: "CPU",
      "M.B": "메인보드",
      Memory: "메모리",
      SSD: "SSD",
      Ssd: "SSD",
      Case: "케이스",
      Cooler: "쿨러",
      Power: "파워서플라이",
    }

    return categoryMap[category] || category?.toUpperCase() || ""
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

        {/* Filter section - 상단 가로 배치 */}
        {availableFilters.length > 0 && (
          <PartsFilter
            category={selectedType}
            totalCount={currentComponents.length}
            filters={availableFilters}
            selectedFilters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
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
              <option value="popularity">인기순</option>
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
