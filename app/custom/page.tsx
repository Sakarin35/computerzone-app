"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react"
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
import { fetchComponents, type FirebaseComponentData } from "@/lib/fetch-components"

type SelectedComponents = Partial<Record<ComponentType, ComponentOption & { description: string }>>

// Firebase 데이터를 커스텀 페이지 형식으로 변환하는 함수 (추천순 10개)
function convertFirebaseToCustomFormat(
  firebaseData: Record<string, FirebaseComponentData[]>,
): Record<ComponentType, ComponentOption[]> {
  const customData: Record<ComponentType, ComponentOption[]> = {
    cpu: [],
    vga: [],
    memory: [],
    ssd: [],
    mb: [],
    power: [],
    case: [],
    cooler: [],
  }

  // Firebase 카테고리 이름을 커스텀 형식으로 매핑
  const categoryMapping: Record<string, ComponentType> = {
    Cpu: "cpu",
    CPU: "cpu",
    cpu: "cpu",
    Vga: "vga",
    VGA: "vga",
    vga: "vga",
    Memory: "memory",
    MEMORY: "memory",
    memory: "memory",
    SSD: "ssd",
    Ssd: "ssd",
    ssd: "ssd",
    "M.B": "mb",
    MB: "mb",
    mb: "mb",
    Power: "power",
    POWER: "power",
    power: "power",
    Case: "case",
    CASE: "case",
    case: "case",
    Cooler: "cooler",
    COOLER: "cooler",
    cooler: "cooler",
  }

  // Firebase 데이터를 커스텀 형식으로 변환 (추천순 10개만)
  Object.entries(firebaseData).forEach(([firebaseCategory, components]) => {
    const customCategory = categoryMapping[firebaseCategory]
    if (customCategory && components) {
      console.log(`🔄 [${customCategory}] 추천순 10개 선별 시작 (${components.length}개 제품)`)

      // 추천순 정렬 (가격, 이름 등을 기준으로 간단한 추천 알고리즘)
      const sortedComponents = components
        .filter((comp) => comp.name && comp.price) // 유효한 데이터만
        .sort((a, b) => {
          // 1. 가격대별 균형 (너무 비싸지 않고 너무 싸지 않은 것 우선)
          const priceScoreA = Math.abs(a.price - 500000) // 50만원 기준
          const priceScoreB = Math.abs(b.price - 500000)

          // 2. 이름 길이 (상세한 설명이 있는 제품 우선)
          const nameScoreA = a.name.length
          const nameScoreB = b.name.length

          // 3. 설명 유무
          const descScoreA = a.description || a.specs ? 100 : 0
          const descScoreB = b.description || b.specs ? 100 : 0

          const totalScoreA = nameScoreA + descScoreA - priceScoreA / 10000
          const totalScoreB = nameScoreB + descScoreB - priceScoreB / 10000

          return totalScoreB - totalScoreA
        })
        .slice(0, 10) // 상위 10개만

      customData[customCategory] = sortedComponents.map((comp, index) => ({
        id: comp.id || "",
        name: comp.name || "",
        price: comp.price || 0,
        image: comp.image || "/placeholder.svg",
        description: comp.description || comp.specs || "상세 정보가 없습니다.",
        rank: index + 1, // 추천 순위 추가
      }))

      console.log(`✅ [${customCategory}] 추천순 상위 10개 선별 완료`)
    }
  })

  return customData
}

// 제네시스 스타일 로딩 컴포넌트
function PremiumLoading({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-light text-white tracking-[0.2em] mb-4">COMPUTERZONE</h1>
          <p className="text-sm md:text-base text-gray-400 tracking-[0.1em] font-light">CUSTOM PC CONFIGURATOR</p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Progress Bar Container */}
          <div className="relative mb-8">
            {/* Background Line */}
            <div className="w-full h-[2px] bg-gray-800 rounded-full overflow-hidden">
              {/* Progress Fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-white rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            {/* Progress Glow Effect */}
            <motion.div
              className="absolute top-0 h-[2px] bg-white rounded-full blur-sm opacity-60"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>

          {/* Percentage */}
          <div className="flex justify-between items-center">
            <motion.span
              key={Math.floor(progress)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-light text-white tracking-wider"
            >
              {Math.floor(progress)}%
            </motion.span>
            <span className="text-sm text-gray-500 tracking-wider">LOADING</span>
          </div>
        </motion.div>

        {/* Loading Text Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center space-x-1">
            {["추", "천", " ", "제", "품", " ", "로", "딩", " ", "중"].map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: index * 0.1,
                }}
                className="text-gray-400 text-sm tracking-wider"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-gray-700" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-gray-700" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-gray-700" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-gray-700" />
    </div>
  )
}

// 성능 최적화된 애니메이션
const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export default function CustomBuild() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
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

  // 상태 추가
  const [dataLoaded, setDataLoaded] = useState(false)
  const startTimeRef = useRef<number>(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // 로딩 진행률 애니메이션
  useEffect(() => {
    const targetTime = 2000 // 2초 목표
    startTimeRef.current = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current
      if (!dataLoaded) {
        // 데이터 로딩 중일 때는 70%까지만 (2초 동안)
        const progress = Math.min((elapsed / targetTime) * 70, 70)
        setLoadingProgress(progress)
      } else {
        // 데이터 로딩 완료 후 빠르게 100%까지
        setLoadingProgress((prev) => {
          const newProgress = Math.min(prev + 4, 100)
          if (newProgress >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            // 100% 완료 후 0.5초 대기 후 로딩 화면 숨김
            setTimeout(() => setLoading(false), 500)
          }
          return newProgress
        })
      }
    }

    // 즉시 시작
    updateProgress()
    intervalRef.current = setInterval(updateProgress, 50)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [dataLoaded])

  // Firebase 데이터 로딩
  useEffect(() => {
    const loadFirebaseData = async () => {
      try {
        console.log("🚀 [커스텀] 추천 제품 데이터 로딩 시작...")
        const firebaseData = await fetchComponents()
        const hasFirebaseData = Object.values(firebaseData).some((arr) => arr.length > 0)

        if (hasFirebaseData) {
          console.log("✅ [커스텀] Firebase 데이터 사용")
          const convertedData = convertFirebaseToCustomFormat(firebaseData)
          setComponentOptions(convertedData)
          Object.entries(convertedData).forEach(([category, items]) => {
            console.log(`📦 [커스텀] ${category}: 추천 ${items.length}개 제품`)
          })
        } else {
          console.log("⚠️ [커스텀] Firebase 데이터 없음, 로컬 데이터 사용")
          const safeLocalData: Record<ComponentType, ComponentOption[]> = {
            cpu: localComponentOptions.cpu ? localComponentOptions.cpu.slice(0, 10) : [],
            vga: localComponentOptions.vga ? localComponentOptions.vga.slice(0, 10) : [],
            memory: localComponentOptions.memory ? localComponentOptions.memory.slice(0, 10) : [],
            ssd: localComponentOptions.ssd ? localComponentOptions.ssd.slice(0, 10) : [],
            mb: localComponentOptions.mb ? localComponentOptions.mb.slice(0, 10) : [],
            power: localComponentOptions.power ? localComponentOptions.power.slice(0, 10) : [],
            case: localComponentOptions.case ? localComponentOptions.case.slice(0, 10) : [],
            cooler: localComponentOptions.cooler ? localComponentOptions.cooler.slice(0, 10) : [],
          }
          setComponentOptions(safeLocalData)
        }

        // 데이터 로딩 완료 표시
        setDataLoaded(true)
      } catch (error) {
        console.error("❌ [커스텀] 데이터 로딩 실패:", error)
        // 로컬 데이터로 폴백 (10개로 제한)
        const safeLocalData: Record<ComponentType, ComponentOption[]> = {
          cpu: localComponentOptions.cpu ? localComponentOptions.cpu.slice(0, 10) : [],
          vga: localComponentOptions.vga ? localComponentOptions.vga.slice(0, 10) : [],
          memory: localComponentOptions.memory ? localComponentOptions.memory.slice(0, 10) : [],
          ssd: localComponentOptions.ssd ? localComponentOptions.ssd.slice(0, 10) : [],
          mb: localComponentOptions.mb ? localComponentOptions.mb.slice(0, 10) : [],
          power: localComponentOptions.power ? localComponentOptions.power.slice(0, 10) : [],
          case: localComponentOptions.case ? localComponentOptions.case.slice(0, 10) : [],
          cooler: localComponentOptions.cooler ? localComponentOptions.cooler.slice(0, 10) : [],
        }
        setComponentOptions(safeLocalData)
        setDataLoaded(true)
      }
    }

    loadFirebaseData()
  }, [])

  // URL 파라미터 처리 (DB에서 넘어온 부품 처리)
  useEffect(() => {
    if (loading) return

    const type = searchParams.get("type") as ComponentType | null
    const id = searchParams.get("id")

    if (type && id && componentOptions[type]) {
      const component = componentOptions[type]?.find((c) => c.id === id)
      if (component) {
        setSelectedComponents((prev) => ({
          ...prev,
          [type]: { ...component, description: component.description },
        }))
        setCurrentComponent(type)
      } else {
        setCurrentComponent(type)
      }
    }
  }, [searchParams, componentOptions, loading])

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

  // 추천 상위 10개 제품
  const recommendedProducts = useMemo(() => {
    const products = componentOptions[currentComponent] || []
    console.log(`🎯 [${currentComponent}] 추천 상위 10개 표시: ${products.length}개`)
    return products
  }, [componentOptions, currentComponent])

  // 🎯 로딩 중일 때 제네시스 스타일 애니메이션 표시
  if (loading) {
    return <PremiumLoading progress={loadingProgress} />
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
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
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
              {/* Product Image - 더 작게 조정 */}
              <div className="aspect-[4/3] relative bg-gray-900 rounded-lg overflow-hidden">
                <AnimatePresence mode="wait">
                  {selectedComponents[currentComponent] ? (
                    <motion.div
                      key={selectedComponents[currentComponent]?.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      <Image
                        src={selectedComponents[currentComponent]?.image || "/placeholder.svg"}
                        alt={selectedComponents[currentComponent]?.name || ""}
                        fill
                        className="object-contain p-6"
                        priority
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

              {/* Description Card - 더 크게 조정 */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">제품 상세 정보</h3>

                  {/* 선택된 제품 이름과 가격 */}
                  {selectedComponents[currentComponent] && (
                    <div className="mb-4 pb-4 border-b border-gray-700">
                      <h4 className="text-lg font-medium text-white mb-2">
                        {selectedComponents[currentComponent]?.name}
                      </h4>
                      <div className="text-xl font-bold text-blue-400">
                        {selectedComponents[currentComponent]?.price?.toLocaleString()}원
                      </div>
                    </div>
                  )}

                  {/* 제품 설명 - 더 큰 영역 */}
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-300 mb-2">제품 설명</h5>
                    <ScrollArea className="h-[300px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedComponents[currentComponent]?.id || "empty"}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-gray-400 text-sm leading-relaxed space-y-3"
                        >
                          {selectedComponents[currentComponent] ? (
                            <div className="space-y-4">
                              {/* 주요 설명 */}
                              <div>
                                <p className="whitespace-pre-wrap">
                                  {selectedComponents[currentComponent]?.description || "상세 설명이 없습니다."}
                                </p>
                              </div>

                              {/* 구분선 */}
                              <div className="border-t border-gray-700 pt-4">
                                <h6 className="text-xs font-medium text-gray-300 mb-2">카테고리 정보</h6>
                                <p className="text-xs text-gray-500">{componentNames[currentComponent]} • 추천 제품</p>
                              </div>

                              {/* 추가 정보 영역 */}
                              <div className="bg-gray-800/50 p-4 rounded-lg">
                                <h6 className="text-xs font-medium text-gray-300 mb-2">구매 가이드</h6>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                  이 제품은 현재 카테고리에서 추천하는 제품입니다. 성능과 가격을 종합적으로 고려하여
                                  선별된 제품으로, 안정적인 PC 구성에 적합합니다.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-gray-500 mb-4">제품을 선택하면 상세 정보가 표시됩니다.</p>
                              <div className="text-xs text-gray-600">오른쪽 목록에서 원하는 제품을 클릭해보세요.</div>
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Component options - 추천 상위 10개 표시 */}
          <motion.div variants={itemVariants} className="col-span-12 md:col-span-4">
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {currentIndex + 1}. {componentNames[currentComponent]}
                </h2>
                <div className="text-sm text-gray-400">추천 {recommendedProducts.length}개</div>
              </div>

              <div className="text-sm text-yellow-400 mb-4 flex items-center">🏆 추천 상위 10개 제품</div>

              <AnimatePresence>
                {recommendedProducts.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    whileHover={{ scale: 1.02, x: -5 }}
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
                      {/* 추천 순위 표시 */}
                      <div className="ml-2 flex flex-col items-end gap-1">
                        <div className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">추천 {index + 1}위</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {recommendedProducts.length === 0 && (
                <div className="text-center text-gray-400 py-8">이 카테고리에는 아직 제품이 없습니다</div>
              )}

              {/* 더보기 버튼 */}
              <div className="text-center py-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push(`/parts-db?category=${currentComponent}`)
                  }}
                  className="bg-transparent text-white border-white hover:bg-gray-800"
                >
                  전체 제품 보기 →
                </Button>
              </div>
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
            <Button onClick={goToNext} className="px-8 bg-blue-600 hover:bg-blue-700 text-white">
              {currentComponent === "power" ? "견적서 보기" : "다음"}
              {currentComponent !== "power" && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
