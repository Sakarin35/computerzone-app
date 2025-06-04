"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export interface FilterOption {
  id: string
  label: string
  count: number
}

export interface FilterCategory {
  id: string
  label: string
  options: FilterOption[]
  isOpen?: boolean
}

export interface FilterState {
  [categoryId: string]: string[]
}

interface PartsFilterProps {
  category: string
  totalCount: number
  filters: FilterCategory[]
  selectedFilters: FilterState
  onFilterChange: (filters: FilterState) => void
  onResetFilters: () => void
}

export default function PartsFilter({
  category,
  totalCount,
  filters,
  selectedFilters,
  onFilterChange,
  onResetFilters,
}: PartsFilterProps) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [showAllFilters, setShowAllFilters] = useState(false)

  // 초기 상태에서 모든 카테고리를 열어둠
  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {}
    filters.forEach((filter) => {
      initialOpenState[filter.id] = filter.isOpen !== false
    })
    setOpenCategories(initialOpenState)
  }, [filters])

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const handleOptionChange = (categoryId: string, optionId: string, checked: boolean) => {
    const currentCategoryFilters = selectedFilters[categoryId] || []
    let newCategoryFilters: string[]

    if (checked) {
      newCategoryFilters = [...currentCategoryFilters, optionId]
    } else {
      newCategoryFilters = currentCategoryFilters.filter((id) => id !== optionId)
    }

    const newFilters = {
      ...selectedFilters,
      [categoryId]: newCategoryFilters,
    }

    // 빈 배열인 경우 해당 카테고리 제거
    if (newCategoryFilters.length === 0) {
      delete newFilters[categoryId]
    }

    onFilterChange(newFilters)
  }

  const getSelectedCount = () => {
    return Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0)
  }

  const formatCategoryName = (category: string): string => {
    const categoryMap: Record<string, string> = {
      cpu: "CPU",
      vga: "그래픽카드",
      mb: "메인보드",
      memory: "메모리",
      ssd: "SSD",
      case: "케이스",
      cooler: "쿨러",
      power: "파워서플라이",
      Cpu: "CPU",
      Vga: "그래픽카드",
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

  // 중요한 필터 카테고리 정의
  const getImportantFilters = () => {
    if (category.toLowerCase() === "cpu") {
      return ["manufacturer", "intel-cpu-type", "amd-cpu-type", "socket", "core-count", "thread-count", "memory-type"]
    }
    return ["manufacturer", "price_range"]
  }

  return (
    <div className="w-full bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">
            {formatCategoryName(category)} 상품개수: {totalCount.toLocaleString()}개
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {/* 선택된 필터 요약 */}
          {getSelectedCount() > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-300">{getSelectedCount()}개 필터 적용됨</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="text-xs text-blue-300 hover:text-blue-100"
              >
                초기화
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-black bg-white border-gray-300 hover:bg-gray-100"
            onClick={() => setShowAllFilters(!showAllFilters)}
          >
            {showAllFilters ? "필터 간단히 보기" : "옵션 전체보기"}
            <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${showAllFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {/* 필터 카테고리들 - 다나와 스타일 */}
      <div className="space-y-4">
        {filters
          .filter((filterCategory) => {
            // 전체보기가 아닐 때는 중요한 필터만 표시
            if (!showAllFilters) {
              const importantFilters = getImportantFilters()
              return importantFilters.includes(filterCategory.id)
            }
            return true
          })
          .map((filterCategory) => (
            <div key={filterCategory.id} className="border-b border-gray-700 pb-4">
              {/* 카테고리 헤더 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">{filterCategory.label}</span>
                  <span className="text-xs text-gray-400">{filterCategory.options.length}개</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCategory(filterCategory.id)}
                  className="h-6 w-6 p-0"
                >
                  {openCategories[filterCategory.id] ? (
                    <ChevronUp className="h-3 w-3 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  )}
                </Button>
              </div>

              {/* 옵션들 - 다나와 스타일 한 줄 표시 */}
              {openCategories[filterCategory.id] && (
                <div className="space-y-2">
                  {/* 첫 번째 줄: 주요 옵션들 */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {filterCategory.options
                      .slice(0, showAllFilters ? filterCategory.options.length : 5) // 5개로 줄임
                      .map((option) => (
                        <div key={option.id} className="flex items-center space-x-2 min-w-0">
                          <Checkbox
                            id={`${filterCategory.id}-${option.id}`}
                            checked={selectedFilters[filterCategory.id]?.includes(option.id) || false}
                            onCheckedChange={(checked) =>
                              handleOptionChange(filterCategory.id, option.id, checked === true)
                            }
                          />
                          <label
                            htmlFor={`${filterCategory.id}-${option.id}`}
                            className="text-sm text-gray-300 cursor-pointer whitespace-nowrap"
                            title={option.label}
                          >
                            {option.label}
                          </label>
                          <span className="text-xs text-gray-500">({option.count})</span>
                        </div>
                      ))}
                  </div>

                  {/* 더보기 버튼 */}
                  {!showAllFilters && filterCategory.options.length > 5 && (
                    <div className="pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-400 hover:text-blue-300 h-6"
                        onClick={() => setShowAllFilters(true)}
                      >
                        {filterCategory.options.length}개 <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  )
}
