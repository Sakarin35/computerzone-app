"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { componentOptions, type ComponentType } from "@/app/data/components"

// 이미지 데이터
const images = {
  recommended: {
    src: "/images/Recommend Pc.png",
    alt: "추천 견적 PC 이미지",
  },
  custom: {
    src: "/images/Custom Pc.png",
    alt: "커스텀 PC 이미지",
  },
} as const

export default function SelectType() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedComponent, setSelectedComponent] = useState({ type: "", name: "" })

  useEffect(() => {
    const type = searchParams.get("type") as ComponentType
    const id = searchParams.get("id")
    if (type && id) {
      // componentOptions[type]이 존재하는지 확인
      if (componentOptions[type] && Array.isArray(componentOptions[type])) {
        const option = componentOptions[type].find((opt) => opt.id === id)
        if (option) {
          setSelectedComponent({ type, name: option.name })
        } else {
          // 로컬 데이터에 없는 경우, DB에서 온 부품일 수 있음
          setSelectedComponent({ type, name: `${type} 부품` })
        }
      } else {
        // componentOptions에 해당 타입이 없는 경우
        setSelectedComponent({ type, name: `${type} 부품` })
      }
    }
  }, [searchParams])

  const handleCustomBuild = () => {
    const type = searchParams.get("type")
    const id = searchParams.get("id")
    if (type && id) {
      router.push(`/custom?type=${type}&id=${id}`)
    } else {
      router.push(`/custom`)
    }
  }

  const handleRecommendedBuild = () => {
    const type = searchParams.get("type")
    const id = searchParams.get("id")
    if (type && id) {
      router.push(`/recommended?type=${type}&id=${id}`)
    } else {
      router.push(`/recommended`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center mb-12">
          {selectedComponent.name ? `${selectedComponent.name} 견적내기` : "견적내기"}
        </h1>
        <p className="text-center text-gray-400 mb-12">견적내기 방식을 선택해주세요.</p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="block group cursor-pointer" onClick={handleRecommendedBuild}>
            <div className="bg-gray-900 rounded-lg overflow-hidden transition-transform group-hover:scale-105 h-full flex flex-col">
              <div className="aspect-square relative">
                <Image
                  src={images.recommended.src || "/placeholder.svg"}
                  alt={images.recommended.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <span className="text-white text-2xl font-bold">추천견적 &gt;</span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-bold mb-2">추천 견적</h2>
                <p className="text-gray-400 flex-grow">
                  사이트에서 추천드리는 다양한 사양 조합으로 견적내기를 시작합니다. 가격대와 선호하는 브랜드를 선택하여,
                  편리하게 견적내기를 진행할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="block group cursor-pointer" onClick={handleCustomBuild}>
            <div className="bg-gray-900 rounded-lg overflow-hidden transition-transform group-hover:scale-105 h-full flex flex-col">
              <div className="aspect-square relative">
                <Image
                  src={images.custom.src || "/placeholder.svg"}
                  alt={images.custom.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <span className="text-white text-2xl font-bold">나만의 PC 만들기 &gt;</span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-bold mb-2">나만의 PC 만들기</h2>
                <p className="text-gray-400 flex-grow">
                  그래픽카드부터 상세 옵션까지, 원하시는 사양 구성을 직접선택하며 나만의 PC 만들기를 시작합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
