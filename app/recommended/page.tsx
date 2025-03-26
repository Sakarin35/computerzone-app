// /app/recommended/page.tsx
"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { componentOptions, type ComponentType } from "@/app/data/components"
import { recommendedImages } from "../data/recommended-images"

const getRandomComponent = (type: ComponentType, excludeId?: string) => {
  const options = componentOptions[type].filter((c) => c.id !== excludeId)
  return options[Math.floor(Math.random() * options.length)]
}

const generateRecommendedBuilds = (selectedType: ComponentType, selectedId: string) => {
  const selectedComponent = componentOptions[selectedType].find((c) => c.id === selectedId)

  if (!selectedComponent) {
    return []
  }

  const builds = []
  for (let i = 0; i < 3; i++) {
    const build = {
      id: i + 1,
      name: `추천 PC ${i + 1}`,
      image: recommendedImages[`pc${i + 1}` as keyof typeof recommendedImages],
      specs: Object.fromEntries(
        Object.keys(componentOptions).map((key) => {
          const type = key as ComponentType
          return [type, type === selectedType ? selectedComponent : getRandomComponent(type)]
        }),
      ) as Record<ComponentType, typeof selectedComponent>,
    }
    builds.push(build)
  }

  return builds
}

export default function RecommendedBuilds() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedBuild, setSelectedBuild] = useState<number | null>(null)

  const type = searchParams.get("type") as ComponentType
  const id = searchParams.get("id")

  const recommendedBuilds = useMemo(() => {
    if (type && id) {
      return generateRecommendedBuilds(type, id)
    }
    return []
  }, [type, id])

  const handleSelectBuild = (buildId: number) => {
    setSelectedBuild(buildId)
  }

  const handleProceed = () => {
    if (selectedBuild !== null) {
      const selectedPc = recommendedBuilds.find((build) => build.id === selectedBuild)
      if (selectedPc) {
        const components = Object.entries(selectedPc.specs).reduce(
          (acc, [key, value]) => {
            acc[key] = { name: value.name, price: value.price }
            return acc
          },
          {} as Record<string, { name: string; price: number }>,
        )
        const componentsParam = encodeURIComponent(JSON.stringify(components))
        router.push(`/quote?components=${componentsParam}`)
      }
    }
  }

  const handleGoBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">추천 PC</h2>
        <p className="text-gray-400 mb-8">선택하신 부품을 포함한 추천 PC 구성입니다. 원하는 구성을 선택해 주세요.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedBuilds.map((build) => (
            <div
              key={build.id}
              className={`bg-gray-900 rounded-lg overflow-hidden cursor-pointer transition-all ${
                selectedBuild === build.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => handleSelectBuild(build.id)}
            >
              <div className="aspect-square relative">
                <Image
                  src={build.image.src || "/placeholder.svg"}
                  alt={build.image.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{build.name}</h3>
                  <span className="text-xl font-bold">
                    {Object.values(build.specs)
                      .reduce((sum, component) => sum + component.price, 0)
                      .toLocaleString()}
                    원
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  {Object.entries(build.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium text-gray-400">{key.toUpperCase()}:</span>
                      <span className="text-right ml-2">{value.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <Button onClick={handleGoBack} variant="outline" className="px-8 py-2 bg-white text-black hover:bg-gray-200">
            돌아가기
          </Button>
          <Button onClick={handleProceed} disabled={selectedBuild === null} className="px-8 py-2">
            견적 선택하기
          </Button>
        </div>
      </div>
    </div>
  )
}

