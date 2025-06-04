// /app/custom/page.tsx
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronLeft, ChevronRight, ChevronDown, X, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import {
  componentOrder,
  componentNames,
  componentOptions as localComponentOptions,
  type ComponentType,
  type ComponentOption,
} from "@/app/data/components"
import { fetchCustomComponentData } from "@/lib/custom-data-adapter"

type SelectedComponents = Partial<Record<ComponentType, ComponentOption & { description: string }>>

// 애니메이션 변형
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function CustomBuild() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<"firebase" | "local">("local")
  const [currentComponent, setCurrentComponent] = useState<ComponentType>("vga")
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({})
  const [componentOptions, setComponentOptions] = useState<Record<ComponentType, ComponentOption[]>>({
    cpu: [],
    vga: [],
    memory: [],
    ssd: [],
    mb: [],
    power: [],
    case: [],
    cooler: [],
  })

  // Firebase 데이터 로딩
  useEffect(() => {
    const loadFirebaseData = async () => {
      try {
        setLoading(true)
        console.log("🔄 Firebase 데이터 로딩 시작...")

        // Firebase 데이터 가져오기
        const firebaseData = await fetchCustomComponentData()

        // Firebase 데이터가 있는지 확인
        const hasFirebaseData = Object.values(firebaseData).some((arr) => arr.length > 0)

        if (hasFirebaseData) {
          console.log("✅ Firebase 데이터 사용")
          setComponentOptions(firebaseData)
          setDataSource("firebase")
        } else {
          console.log("⚠️ Firebase 데이터 없음, 로컬 데이터 사용")
          // 로컬 데이터를 안전하게 변환
          const safeLocalData: Record<ComponentType, ComponentOption[]> = {
            cpu: localComponentOptions.cpu ? [...localComponentOptions.cpu] : [],
            vga: localComponentOptions.vga ? [...localComponentOptions.vga] : [],
            memory: localComponentOptions.memory ? [...localComponentOptions.memory] : [],
            ssd: localComponentOptions.ssd ? [...localComponentOptions.ssd] : [],
            mb: localComponentOptions.mb ? [...localComponentOptions.mb] : [],
            power: localComponentOptions.power ? [...localComponentOptions.power] : [],
            case: localComponentOptions.case ? [...localComponentOptions.case] : [],
            cooler: localComponentOptions.cooler ? [...localComponentOptions.cooler] : [],
          }
          setComponentOptions(safeLocalData)
          setDataSource("local")
        }

        // 각 카테고리별 제품 수 로그
        Object.entries(componentOptions).forEach(([category, items]) => {
          console.log(`📦 ${category}: ${items.length}개 제품`)
        })
      } catch (error) {
        console.error("❌ 데이터 로딩 실패:", error)
        setDataSource("local")
        // 로컬 데이터를 안전하게 변환
        const safeLocalData: Record<ComponentType, ComponentOption[]> = {
          cpu: localComponentOptions.cpu ? [...localComponentOptions.cpu] : [],
          vga: localComponentOptions.vga ? [...localComponentOptions.vga] : [],
          memory: localComponentOptions.memory ? [...localComponentOptions.memory] : [],
          ssd: localComponentOptions.ssd ? [...localComponentOptions.ssd] : [],
          mb: localComponentOptions.mb ? [...localComponentOptions.mb] : [],
          power: localComponentOptions.power ? [...localComponentOptions.power] : [],
          case: localComponentOptions.case ? [...localComponentOptions.case] : [],
          cooler: localComponentOptions.cooler ? [...localComponentOptions.cooler] : [],
        }
        setComponentOptions(safeLocalData)
      } finally {
        setLoading(false)
      }
    }

    loadFirebaseData()
  }, [])

  // URL 파라미터 처리 (DB에서 넘어온 부품 처리)
  useEffect(() => {
    const type = searchParams.get("type") as ComponentType | null
    const id = searchParams.get("id")

    if (type && id && componentOptions[type]) {
      // 먼저 로드된 데이터에서 찾기
      const component = componentOptions[type]?.find((c) => c.id === id)
      if (component) {
        setSelectedComponents((prev) => ({
          ...prev,
          [type]: { ...component, description: component.description },
        }))
        setCurrentComponent(type)
      } else {
        // 데이터에서 찾지 못한 경우, 해당 카테고리로 이동
        setCurrentComponent(type)
      }
    }
  }, [searchParams, componentOptions])

  const handleSelect = useCallback(
    (component: ComponentOption) => {
      setSelectedComponents((prev) => ({
        ...prev,
        [currentComponent]: { ...component, description: component.description },
      }))
    },
    [currentComponent],
  )

  const currentIndex = useMemo(() => componentOrder.indexOf(currentComponent), [currentComponent])

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex + 1
    if (nextIndex < componentOrder.length) {
      setCurrentComponent(componentOrder[nextIndex] as ComponentType)
    } else if (currentComponent === "power") {
      // Navigate to quote page with selected components
      const componentsParam = encodeURIComponent(JSON.stringify(selectedComponents))
      router.push(`/quote?components=${componentsParam}`)
    }
  }, [currentIndex, currentComponent, selectedComponents, router])

  const goToPrev = useCallback(() => {
    const prevIndex = currentIndex - 1
    if (prevIndex >= 0) {
      setCurrentComponent(componentOrder[prevIndex] as ComponentType)
    }
  }, [currentIndex])

  const totalPrice = useMemo(
    () => Object.values(selectedComponents).reduce((sum, component) => sum + (component?.price || 0), 0),
    [selectedComponents],
  )

  const handleClose = useCallback(() => {
    router.push("/")
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <p className="text-white text-lg">부품 데이터를 불러오는 중...</p>
          <p className="text-gray-400 text-sm">Firebase에서 최신 부품 정보를 가져오고 있습니다</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-black text-white custom-scrollbar-container"
    >
      {/* Top Navigation */}
      <motion.div variants={itemVariants} className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 space-x-8">
            {/* Data source indicator */}
            

            {/* Component selection dropdown */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300">
                  <span>{selectedComponents[currentComponent]?.name || "부품 선택"}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[400px] sm:w-[540px] bg-gray-900 text-white">
                <div className="grid gap-4 py-4">
                  {componentOrder.map((comp) => (
                    <motion.button
                      key={comp}
                      whileHover={{ x: 5 }}
                      className="text-left px-4 py-2 hover:bg-gray-800 rounded-lg transition-colors duration-300"
                      onClick={() => {
                        setCurrentComponent(comp as ComponentType)
                      }}
                    >
                      <div className="font-medium">{componentNames[comp as keyof typeof componentNames]}</div>
                      <div className="text-sm text-gray-400">{selectedComponents[comp]?.name || "선택되지 않음"}</div>
                    </motion.button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Component navigation */}
            <div className="flex-1 flex items-center justify-between overflow-x-auto scrollbar-hide">
              {componentOrder.map((comp) => (
                <button
                  key={comp}
                  onClick={() => setCurrentComponent(comp as ComponentType)}
                  className={`px-4 py-2 whitespace-nowrap transition-all duration-300 ${
                    currentComponent === comp
                      ? "text-white border-b-2 border-white"
                      : "text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-400"
                  }`}
                >
                  {componentNames[comp as keyof typeof componentNames]}
                </button>
              ))}
            </div>

            {/* Close button */}
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors duration-300" onClick={handleClose}>
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Previously selected components */}
          <motion.div
            variants={itemVariants}
            className="col-span-12 md:col-span-3 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            {componentOrder.map((comp, index) => {
              const selected = selectedComponents[comp]
              return (
                <motion.div
                  key={comp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-900 p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-all duration-300"
                  onClick={() => setCurrentComponent(comp as ComponentType)}
                >
                  <div className="text-sm text-gray-400">
                    {index + 1}. {componentNames[comp as keyof typeof componentNames]}
                  </div>
                  {selected ? (
                    <>
                      <div className="font-medium">{selected.name}</div>
                      <div className="text-sm text-blue-400">+ {selected.price?.toLocaleString()}원</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">선택되지 않음</div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>

          {/* Current component display */}
          <motion.div variants={itemVariants} className="col-span-12 md:col-span-5">
            <div className="space-y-6">
              <div className="aspect-square relative bg-gray-900 rounded-lg overflow-hidden">
                <AnimatePresence mode="wait">
                  {selectedComponents[currentComponent] ? (
                    <motion.div
                      key={selectedComponents[currentComponent]?.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full"
                    >
                      <Image
                        src={selectedComponents[currentComponent]?.image || "/placeholder.svg"}
                        alt={selectedComponents[currentComponent]?.name}
                        fill
                        className="object-contain p-8"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-full text-gray-400"
                    >
                      제품을 선택해주세요
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Description Card */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">제품 설명</h3>
                  <ScrollArea className="h-[120px]">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={selectedComponents[currentComponent]?.id || "empty"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-400 text-sm leading-relaxed"
                      >
                        {selectedComponents[currentComponent]?.description || "제품을 선택하면 상세 설명이 표시됩니다."}
                      </motion.p>
                    </AnimatePresence>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Component options - 인기순 정렬된 전체 목록 */}
          <motion.div variants={itemVariants} className="col-span-12 md:col-span-4">
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {currentIndex + 1}. {componentNames[currentComponent]}
                </h2>
                <div className="text-sm text-gray-400">{componentOptions[currentComponent]?.length || 0}개 제품</div>
              </div>

              {dataSource === "firebase" && (
                <div className="text-sm text-yellow-400 mb-4 flex items-center">
                  ⭐ 인기순으로 정렬됨 • 스크롤하여 더 많은 제품 확인
                </div>
              )}

              <AnimatePresence>
                {componentOptions[currentComponent]?.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedComponents[currentComponent]?.id === option.id
                        ? "bg-blue-900/30 border border-blue-500"
                        : "bg-gray-900 hover:bg-gray-800 border border-transparent"
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-blue-400 mb-2">+ {option.price?.toLocaleString()}원</div>
                        <p className="text-xs text-gray-500 line-clamp-2">{option.description}</p>
                      </div>
                      {dataSource === "firebase" && index < 3 && (
                        <div className="ml-2 text-xs bg-yellow-600 text-white px-2 py-1 rounded">
                          인기 {index + 1}위
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {componentOptions[currentComponent]?.length === 0 && (
                <div className="text-center text-gray-400 py-8">이 카테고리에는 아직 제품이 없습니다</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom navigation */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row justify-between items-center mt-8 px-4 gap-4"
        >
          <div className="text-xl font-bold">
            예상 가격: <span className="text-blue-400">{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              variant="outline"
              className="px-8 bg-transparent text-white border-white hover:bg-gray-800 hover:text-white transition-colors duration-300"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              이전
            </Button>
            <Button onClick={goToNext} className="px-8 gradient-hover-button">
              {currentComponent === "power" ? "견적서 보기" : "다음"}
              {currentComponent !== "power" && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
