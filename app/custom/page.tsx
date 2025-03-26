// /app/custom/page.tsx
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ChevronLeft, ChevronRight, ChevronDown, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  componentOrder,
  componentNames,
  componentOptions,
  type ComponentType,
  type ComponentOption,
} from "@/app/data/components"

type SelectedComponents = Partial<Record<ComponentType, ComponentOption & { description: string }>>

export default function CustomBuild() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [currentComponent, setCurrentComponent] = useState<ComponentType>("vga")
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponents>({})

  useEffect(() => {
    const type = searchParams.get("type") as ComponentType | null
    const id = searchParams.get("id")

    if (type && id && componentOptions[type]) {
      const component = componentOptions[type].find((c) => c.id === id)
      if (component) {
        setSelectedComponents((prev) => ({
          ...prev,
          [type]: { ...component, description: component.description },
        }))
        setCurrentComponent(type)
      }
    }

    setLoading(false)
  }, [searchParams])

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
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 space-x-8">
            {/* Component selection dropdown */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
                  <span>{selectedComponents[currentComponent]?.name || "부품 선택"}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[400px] sm:w-[540px] bg-gray-900 text-white">
                <div className="grid gap-4 py-4">
                  {componentOrder.map((comp) => (
                    <button
                      key={comp}
                      className="text-left px-4 py-2 hover:bg-gray-800 rounded-lg"
                      onClick={() => {
                        setCurrentComponent(comp as ComponentType)
                      }}
                    >
                      <div className="font-medium">{componentNames[comp as keyof typeof componentNames]}</div>
                      <div className="text-sm text-gray-400">{selectedComponents[comp]?.name || "선택되지 않음"}</div>
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* Component navigation */}
            <div className="flex-1 flex items-center justify-between">
              {componentOrder.map((comp) => (
                <button
                  key={comp}
                  onClick={() => setCurrentComponent(comp as ComponentType)}
                  className={`px-4 py-2 ${
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
            <button className="p-2" onClick={handleClose}>
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Previously selected components */}
          <div className="col-span-3 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {componentOrder.map((comp, index) => {
              const selected = selectedComponents[comp]
              return (
                <div
                  key={comp}
                  className="bg-gray-900 p-4 rounded-lg cursor-pointer"
                  onClick={() => setCurrentComponent(comp as ComponentType)}
                >
                  <div className="text-sm text-gray-400">
                    {index + 1}. {componentNames[comp as keyof typeof componentNames]}
                  </div>
                  {selected ? (
                    <>
                      <div className="font-medium">{selected.name}</div>
                      <div className="text-sm text-gray-400">+ {selected.price?.toLocaleString()}원</div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-400">선택되지 않음</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Current component display */}
          <div className="col-span-5">
            <div className="space-y-6">
              <div className="aspect-square relative bg-gray-900 rounded-lg overflow-hidden">
                {selectedComponents[currentComponent] ? (
                  <Image
                    src={selectedComponents[currentComponent]?.image || "/placeholder.svg"}
                    alt={selectedComponents[currentComponent]?.name}
                    fill
                    className="object-contain p-8"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">제품을 선택해주세요</div>
                )}
              </div>

              {/* Description Card */}
              <Card className="bg-gray-900 border-gray-800 text-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">제품 설명</h3>
                  <ScrollArea className="h-[120px]">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {selectedComponents[currentComponent]?.description || "제품을 선택하면 상세 설명이 표시됩니다."}
                    </p>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Component options */}
          <div className="col-span-4">
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {currentIndex + 1}. {componentNames[currentComponent]}
              </h2>
              {componentOptions[currentComponent]?.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedComponents[currentComponent]?.id === option.id
                      ? "bg-gray-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-gray-400 mb-2">+ {option.price?.toLocaleString()}원</div>
                  <p className="text-xs text-gray-500">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="flex justify-between items-center mt-8 px-4">
          <div className="text-xl">예상 가격: {totalPrice.toLocaleString()}원</div>
          <div className="flex space-x-4">
            <Button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              variant="outline"
              className="px-8 bg-white text-black hover:bg-gray-200"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              이전
            </Button>
            <Button onClick={goToNext} className="px-8">
              {currentComponent === "power" ? "견적서 보기" : "다음"}
              {currentComponent !== "power" && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

