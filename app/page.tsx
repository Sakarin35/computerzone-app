// /app/page.tsx
"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  componentOrder,
  componentNames,
  componentOptions,
  type ComponentType,
  type ComponentOption,
} from "@/app/data/components"

export default function Home() {
  const router = useRouter()
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>("vga")
  const [selectedOption, setSelectedOption] = useState<ComponentOption>(componentOptions.vga[0])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleComponentClick = (componentId: ComponentType) => {
    setSelectedComponent(componentId)
    setSelectedOption(componentOptions[componentId][0])
  }

  const handleOptionClick = (option: ComponentOption) => {
    setSelectedOption(option)
  }

  const scrollAmount = 300

  const handlePrevClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    }
  }

  const handleNextClick = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const handleProceed = () => {
    router.push(`/select-type?type=${selectedComponent}&id=${selectedOption.id}`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-center mb-12">견적내기</h1>

        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-8">{selectedOption.name}</h2>
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] mb-12">
              <Image
                src={selectedOption.image || "/placeholder.svg"}
                alt={selectedOption.name}
                fill
                className="object-contain"
              />
            </div>
            <Button
              onClick={handleProceed}
              className="bg-transparent hover:bg-gray-800 text-white border border-white px-8 py-2 rounded"
            >
              견적내기
            </Button>
          </div>

          <div className="grid grid-cols-8 gap-8 mb-16">
            {componentOrder.map((component) => (
              <button
                key={component}
                onClick={() => handleComponentClick(component)}
                className={`text-center pb-3 border-b ${
                  selectedComponent === component
                    ? "text-white border-white"
                    : "text-gray-400 border-gray-800 hover:text-white hover:border-white"
                }`}
              >
                {componentNames[component]}
              </button>
            ))}
          </div>

          <div className="relative overflow-hidden">
            <div
              ref={containerRef}
              className="flex space-x-8 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {componentOptions[selectedComponent].map((option) => (
                <div
                  key={option.id}
                  className={`flex-none w-80 bg-gray-900 rounded-lg p-6 cursor-pointer transition-transform ${
                    selectedOption.id === option.id ? "ring-2 ring-white scale-105" : ""
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  <div className="relative w-full aspect-square mb-6">
                    <Image src={option.image || "/placeholder.svg"} alt={option.name} fill className="object-contain" />
                  </div>
                  <h3 className="text-center text-xl">{option.name}</h3>
                </div>
              ))}
            </div>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
              onClick={handlePrevClick}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
              onClick={handleNextClick}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

