"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import {
  componentOrder,
  componentNames,
  componentOptions,
  type ComponentType,
  type ComponentOption,
} from "@/app/data/components"

// 애니메이션 변형
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

// 캐러셀 이미지 데이터
const carouselImages = [
  {
    src: "/images/RTX 4060 Ti.png",
    alt: "RTX 4060 Ti",
    title: "최신 그래픽카드",
    description: "게임과 작업을 위한 최적의 성능",
  },
  {
    src: "/images/Recommend Pc.png",
    alt: "추천 PC",
    title: "맞춤형 PC 구성",
    description: "당신의 용도에 맞는 최적의 PC",
  },
  {
    src: "/images/Custom Pc.png",
    alt: "커스텀 PC",
    title: "나만의 PC 만들기",
    description: "원하는 부품으로 직접 구성하는 PC",
  },
]

export default function Home() {
  const router = useRouter()
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>("vga")
  const [selectedOption, setSelectedOption] = useState<ComponentOption>(componentOptions.vga[0])
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  // 자동 슬라이드 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

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
      {/* 히어로 섹션 */}
      <section className="relative h-[70vh] overflow-hidden">
        {/* 캐러셀 이미지 */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 flex items-center z-20">
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, x: index === currentSlide ? 0 : -50 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-lg"
                >
                  <h1 className="text-5xl font-bold mb-4">{image.title}</h1>
                  <p className="text-xl mb-8">{image.description}</p>
                  <Button className="gradient-hover-button text-lg px-8 py-6" onClick={() => router.push("/custom")}>
                    PC 견적 시작하기
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        ))}

        {/* 슬라이드 인디케이터 */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30">
          <div className="flex space-x-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white w-8" : "bg-gray-500"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-8 py-8">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-3xl font-bold text-center mb-12"
        >
          견적내기
        </motion.h1>

        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <motion.h2 variants={itemVariants} className="text-5xl font-bold mb-8">
              {selectedOption.name}
            </motion.h2>
            <motion.div variants={itemVariants} className="relative w-full max-w-3xl mx-auto aspect-[16/9] mb-12">
              <Image
                src={selectedOption.image || "/placeholder.svg"}
                alt={selectedOption.name}
                fill
                className="object-contain"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button
                onClick={handleProceed}
                className="gradient-hover-button bg-transparent hover:bg-gray-800 text-white border border-white px-8 py-2 rounded"
              >
                견적내기
              </Button>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="grid grid-cols-8 gap-8 mb-16">
            {componentOrder.map((component) => (
              <button
                key={component}
                onClick={() => handleComponentClick(component)}
                className={`text-center pb-3 border-b smooth-transition ${
                  selectedComponent === component
                    ? "text-white border-white"
                    : "text-gray-400 border-gray-800 hover:text-white hover:border-white"
                }`}
              >
                {componentNames[component]}
              </button>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="relative overflow-hidden">
            <div
              ref={containerRef}
              className="flex space-x-8 overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {componentOptions[selectedComponent].map((option) => (
                <div
                  key={option.id}
                  className={`flex-none w-80 bg-gray-900 rounded-lg p-6 cursor-pointer transition-transform hover-scale ${
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
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={handlePrevClick}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={handleNextClick}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
