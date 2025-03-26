// /app/parts-db/page.tsx
"use client"

import { useState, useEffect } from "react"
import { componentOptions, type ComponentType } from "../data/components"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { fetchComponents, type FirebaseComponentData } from "@/lib/fetch-components"

export default function PartsDB() {
  const [selectedType, setSelectedType] = useState<ComponentType>("vga")
  const [components, setComponents] = useState<Record<string, FirebaseComponentData[]>>({})
  const [loading, setLoading] = useState(true)
  const [useFirebase, setUseFirebase] = useState(false)

  // Firebase에서 컴포넌트 데이터 가져오기
  useEffect(() => {
    const loadComponents = async () => {
      try {
        const data = await fetchComponents()
        if (Object.keys(data).length > 0) {
          setComponents(data)
          setUseFirebase(true)
        }
      } catch (error) {
        console.error("Error loading components from Firebase:", error)
        // Firebase 로드 실패 시 로컬 데이터 사용
        setUseFirebase(false)
      } finally {
        setLoading(false)
      }
    }

    loadComponents()
  }, [])

  // 현재 선택된 타입의 컴포넌트 목록
  const currentComponents = useFirebase ? components[selectedType] || [] : componentOptions[selectedType]

  if (loading) {
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

        {/* 부품 유형 선택 */}
        <div className="flex flex-wrap gap-4 mb-8">
          {(useFirebase ? Object.keys(components) : Object.keys(componentOptions)).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as ComponentType)}
              className={`px-4 py-2 rounded-md ${
                selectedType === type ? "bg-white text-black" : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 선택된 부품 유형의 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {currentComponents.map((component) => (
            <Card key={component.id} className="bg-gray-950 border-gray-800">
              <CardContent className="p-6">
                <div className="w-full h-48 relative mb-4">
                  <Image
                    src={component.image || "/placeholder.svg"}
                    alt={component.name}
                    width={200}
                    height={200}
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{component.name}</h3>
                <p className="text-2xl font-bold text-white mb-4">{component.price.toLocaleString()}원</p>
                <ScrollArea className="h-[150px] mb-4">
                  <p className="text-sm text-gray-200 leading-relaxed">{component.description}</p>
                </ScrollArea>
             
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

