"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
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
  const [previousSlide, setPreviousSlide] = useState(carouselImages.length - 1)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [dragDistance, setDragDistance] = useState(0)
  const [dragStartX, setDragStartX] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState<"next" | "prev" | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null)
  const [slideProgress, setSlideProgress] = useState(0)
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null)
  const [showDragHint, setShowDragHint] = useState(true)

  // 슬라이드 타이머 초기화 함수
  const resetSlideTimer = () => {
    setSlideProgress(0)
    if (autoplayInterval) {
      clearInterval(autoplayInterval)
      setAutoplayInterval(null)
    }
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current)
      slideTimerRef.current = null
    }
  }

  // 자동 슬라이드 효과
  useEffect(() => {
    // 일시정지 상태이거나 드래그 중이거나 전환 중이면 타이머 중지
    if (isPaused || isDragging || isTransitioning) {
      resetSlideTimer()
      return
    }

    // 슬라이드 진행 타이머
    setSlideProgress(0)
    if (slideTimerRef.current) {
      clearInterval(slideTimerRef.current)
    }

    const timerInterval = setInterval(() => {
      setSlideProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 0.5 // 7초 동안 0에서 100까지
      })
    }, 35) // 7000ms / 200 steps = 35ms per step

    slideTimerRef.current = timerInterval

    const interval = setInterval(() => {
      if (!isDragging && !isTransitioning) {
        handleNextSlide()
      }
    }, 7000)

    setAutoplayInterval(interval)

    return () => {
      if (autoplayInterval) clearInterval(autoplayInterval)
      if (slideTimerRef.current) clearInterval(slideTimerRef.current)
    }
  }, [isPaused, isDragging, isTransitioning, currentSlide])

  // 드래그 힌트 표시 및 숨기기
  useEffect(() => {
    // 5초 후에 드래그 힌트 숨기기
    const timer = setTimeout(() => {
      setShowDragHint(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleComponentClick = (componentId: ComponentType) => {
    setSelectedComponent(componentId)
    setSelectedOption(componentOptions[componentId][0])
  }

  const handleOptionClick = (option: ComponentOption) => {
    setSelectedOption(option)
  }

  const handlePrevClick = () => {
    if (containerRef.current) {
      // 현재 각 카드의 너비 계산 (여백 포함)
      const cards = containerRef.current.querySelectorAll(".flex-none")
      if (cards.length === 0) return

      const card = cards[0] as HTMLElement
      // 카드 너비 + 여백(space-x-8 = 2rem = 32px)
      const cardWidth = card.offsetWidth + 32

      // 현재 스크롤 위치
      const currentScroll = containerRef.current.scrollLeft

      // 이전 카드로 스크롤
      if (currentScroll === 0) {
        // 처음 위치에서 이전을 누르면 마지막으로 이동 (무한 스크롤)
        containerRef.current.scrollTo({
          left: containerRef.current.scrollWidth,
          behavior: "smooth",
        })
      } else {
        containerRef.current.scrollBy({
          left: -cardWidth,
          behavior: "smooth",
        })
      }
    }
  }

  const handleNextClick = () => {
    if (containerRef.current) {
      // 현재 각 카드의 너비 계산 (여백 포함)
      const cards = containerRef.current.querySelectorAll(".flex-none")
      if (cards.length === 0) return

      const card = cards[0] as HTMLElement
      // 카드 너비 + 여백(space-x-8 = 2rem = 32px)
      const cardWidth = card.offsetWidth + 32

      // 현재 스크롤 위치와 최대 스크롤 위치
      const currentScroll = containerRef.current.scrollLeft
      const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth

      // 다음 카드로 스크롤
      if (Math.abs(currentScroll - maxScroll) < 10) {
        // 마지막 위치에서 다음을 누르면 처음으로 이동 (무한 스크롤)
        containerRef.current.scrollTo({
          left: 0,
          behavior: "smooth",
        })
      } else {
        containerRef.current.scrollBy({
          left: cardWidth,
          behavior: "smooth",
        })
      }
    }
  }

  const handleProceed = () => {
    router.push(`/select-type?type=${selectedComponent}&id=${selectedOption.id}`)
  }

  // 캐러셀 이전 슬라이드로 이동
  const handlePrevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDirection("prev")
    setPreviousSlide(currentSlide)
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1))

    // 슬라이드 진행 타이머 리셋
    resetSlideTimer()

    setTimeout(() => {
      setIsTransitioning(false)
      setDirection(null)
    }, 500) // 전환 애니메이션 시간
  }

  // 캐러셀 다음 슬라이드로 이동
  const handleNextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setDirection("next")
    setPreviousSlide(currentSlide)
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)

    // 슬라이드 진행 타이머 리셋
    resetSlideTimer()

    setTimeout(() => {
      setIsTransitioning(false)
      setDirection(null)
    }, 500) // 전환 애니메이션 시간
  }

  // 캐러셀 드래그 시작
  const handleCarouselMouseDown = (e: React.MouseEvent) => {
    if (isTransitioning) return
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragDistance(0)
    setDragDirection(null)
  }

  // 캐러셀 드래그 중
  const handleCarouselMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isTransitioning) return
    e.preventDefault()
    const currentX = e.clientX
    const newDragDistance = currentX - dragStartX
    setDragDistance(newDragDistance)

    // 드래그 방향 설정
    if (newDragDistance > 0 && dragDirection !== "right") {
      setDragDirection("right")
    } else if (newDragDistance < 0 && dragDirection !== "left") {
      setDragDirection("left")
    }
  }

  // 캐러셀 드래그 종료
  const handleCarouselMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)

    // 드래그 거리가 충분히 클 때만 슬라이드 변경
    const threshold = window.innerWidth * 0.15 // 화면 너비의 15%

    if (dragDistance > threshold) {
      handlePrevSlide()
      // 타이머 초기화 - 이미 handlePrevSlide 내에서 처리됨
    } else if (dragDistance < -threshold) {
      handleNextSlide()
      // 타이머 초기화 - 이미 handleNextSlide 내에서 처리됨
    } else {
      // 슬라이드가 변경되지 않더라도 타이머 초기화
      resetSlideTimer()
    }

    // 드래그 거리 초기화
    setDragDistance(0)
  }

  // 드래그 취소 (마우스가 영역을 벗어난 경우)
  const handleCarouselMouseLeave = () => {
    if (isDragging) {
      handleCarouselMouseUp()
    }
  }

  // 터치 이벤트 핸들러
  const handleCarouselTouchStart = (e: React.TouchEvent) => {
    if (isTransitioning) return
    setIsDragging(true)
    setDragStartX(e.touches[0].clientX)
    setDragDistance(0)
    setDragDirection(null)
  }

  const handleCarouselTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isTransitioning) return
    const currentX = e.touches[0].clientX
    const newDragDistance = currentX - dragStartX
    setDragDistance(newDragDistance)

    // 드래그 방향 설정
    if (newDragDistance > 0 && dragDirection !== "right") {
      setDragDirection("right")
    } else if (newDragDistance < 0 && dragDirection !== "left") {
      setDragDirection("left")
    }
  }

  const handleCarouselTouchEnd = () => {
    handleCarouselMouseUp()
  }

  // 컴포넌트 옵션 컨테이너 드래그 시작
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  // 컴포넌트 옵션 컨테이너 드래그 중
  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (startX - x) * 2 // 스크롤 속도 조절
    containerRef.current.scrollLeft = scrollLeft + walk
  }

  // 컴포넌트 옵션 컨테이너 드래그 종료
  const handleContainerMouseUp = () => {
    setIsDragging(false)
  }

  // 컴포넌트 옵션 컨테이너 드래그 취소
  const handleContainerMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
    }
  }

  // 인디케이터 클릭 핸들러
  const handleIndicatorClick = (index: number) => {
    if (isTransitioning || index === currentSlide) return

    setIsTransitioning(true)
    setDirection(index > currentSlide ? "next" : "prev")
    setPreviousSlide(currentSlide)
    setCurrentSlide(index)

    // 슬라이드 진행 타이머 리셋
    resetSlideTimer()

    setTimeout(() => {
      setIsTransitioning(false)
      setDirection(null)
    }, 500)
  }

  // 자동 재생 토글
  const toggleAutoplay = () => {
    setIsPaused(!isPaused)
  }

  // 다음 슬라이드 인덱스 계산
  const getNextSlideIndex = () => {
    return (currentSlide + 1) % carouselImages.length
  }

  // 이전 슬라이드 인덱스 계산
  const getPrevSlideIndex = () => {
    return currentSlide === 0 ? carouselImages.length - 1 : currentSlide - 1
  }

  // 슬라이드 위치 계산 함수
  const getSlideStyle = (index: number) => {
    // 현재 슬라이드
    if (index === currentSlide) {
      return {
        transform: `translateX(${isDragging ? dragDistance : 0}px)`,
        zIndex: 20,
        opacity: 1,
        transition: isDragging ? "none" : "transform 500ms ease",
      }
    }

    // 드래그 중일 때
    if (isDragging) {
      // 오른쪽으로 드래그 중 (이전 슬라이드로 이동)
      if (dragDirection === "right" && index === getPrevSlideIndex()) {
        return {
          transform: `translateX(calc(-100% + ${dragDistance}px))`,
          zIndex: 10,
          opacity: 1,
          transition: "none",
        }
      }

      // 왼쪽으로 드래그 중 (다음 슬라이드로 이동)
      if (dragDirection === "left" && index === getNextSlideIndex()) {
        return {
          transform: `translateX(calc(100% + ${dragDistance}px))`,
          zIndex: 10,
          opacity: 1,
          transition: "none",
        }
      }
    }

    // 전환 애니메이션 중
    if (direction === "next" && index === previousSlide) {
      // 다음으로 이동 중 (현재 슬라이드는 왼쪽으로 나가고, 이전 슬라이드는 왼쪽으로 사라짐)
      return {
        transform: "translateX(-100%)",
        zIndex: 10,
        opacity: 1,
        transition: "transform 500ms ease",
      }
    } else if (direction === "prev" && index === previousSlide) {
      // 이전으로 이동 중 (현재 슬라이드는 오른쪽으로 나가고, 이전 슬라이드는 오른쪽으로 사라짐)
      return {
        transform: "translateX(100%)",
        zIndex: 10,
        opacity: 1,
        transition: "transform 500ms ease",
      }
    }

    // 다음 슬라이드 (대기 위치)
    if (index === getNextSlideIndex()) {
      return {
        transform: "translateX(100%)",
        zIndex: 5,
        opacity: 1,
        transition: "none",
      }
    }

    // 이전 슬라이드 (대기 위치)
    if (index === getPrevSlideIndex()) {
      return {
        transform: "translateX(-100%)",
        zIndex: 5,
        opacity: 1,
        transition: "none",
      }
    }

    // 나머지 슬라이드
    return {
      transform: index > currentSlide ? "translateX(100%)" : "translateX(-100%)",
      zIndex: 0,
      opacity: 0,
      transition: "none",
    }
  }

  // 슬라이드 렌더링 여부 결정
  const shouldRenderSlide = (index: number) => {
    // 현재 슬라이드는 항상 렌더링
    if (index === currentSlide) return true

    // 전환 중인 이전 슬라이드 렌더링
    if (direction && index === previousSlide) return true

    // 드래그 중일 때 이전/다음 슬라이드 렌더링
    if (isDragging) {
      const nextIndex = getNextSlideIndex()
      const prevIndex = getPrevSlideIndex()
      return index === nextIndex || index === prevIndex
    }

    // 대기 상태의 이전/다음 슬라이드도 미리 렌더링
    const nextIndex = getNextSlideIndex()
    const prevIndex = getPrevSlideIndex()
    return index === nextIndex || index === prevIndex

    return false
  }

  return (
    <div className="min-h-screen bg-black text-white select-none">
      {/* 히어로 섹션 */}
      <section className="relative w-full overflow-hidden mb-16" style={{ height: "calc(100vh - 4rem)" }}>
        {/* 캐러셀 컨테이너 */}
        <div
          ref={carouselRef}
          className={`h-full w-full relative draggable-carousel overflow-hidden select-none ${showDragHint ? "drag-hint" : ""}`}
          onMouseDown={handleCarouselMouseDown}
          onMouseMove={handleCarouselMouseMove}
          onMouseUp={handleCarouselMouseUp}
          onMouseLeave={handleCarouselMouseLeave}
          onTouchStart={handleCarouselTouchStart}
          onTouchMove={handleCarouselTouchMove}
          onTouchEnd={handleCarouselTouchEnd}
        >
          {/* 슬라이드 래퍼 */}
          <div className="swiper-wrapper" style={{ width: "100%", height: "100%", position: "relative" }}>
            {carouselImages.map(
              (image, index) =>
                shouldRenderSlide(index) && (
                  <div
                    key={index}
                    className="swiper-slide absolute inset-0 w-full h-full select-none"
                    style={getSlideStyle(index)}
                    onDragStart={(e) => e.preventDefault()}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10" />
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      priority={index === currentSlide}
                      draggable={false}
                    />
                    {index === currentSlide && (
                      <div className="absolute inset-0 flex items-center z-20">
                        <div className="container mx-auto px-6">
                          <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="max-w-lg"
                          >
                            <h1 className="text-5xl font-bold mb-4">{image.title}</h1>
                            <p className="text-xl mb-8">{image.description}</p>
                            <Button
                              className="gradient-hover-button text-lg px-8 py-6"
                              onClick={() => router.push(index === 1 ? "/select-type" : "/custom")}
                            >
                              PC 견적 시작하기
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>
                ),
            )}
          </div>
        </div>

        {/* 슬라이드 인디케이터 */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30">
          <div className="flex space-x-2 items-center">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white w-8" : "bg-gray-500"
                }`}
                onClick={() => handleIndicatorClick(index)}
              />
            ))}

            {/* 재생/일시정지 버튼 */}
            <button
              className="ml-4 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
              onClick={toggleAutoplay}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-8 py-8">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-3xl font-bold text-center mb-12"
        ></motion.h1>

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
              <Button onClick={handleProceed} className="gradient-hover-button px-8 py-2 rounded">
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
              className="flex space-x-8 overflow-x-auto pb-4 component-container scrollbar-hide"
              style={{
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={handleContainerMouseDown}
              onMouseMove={handleContainerMouseMove}
              onMouseUp={handleContainerMouseUp}
              onMouseLeave={handleContainerMouseLeave}
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
                    <Image
                      src={option.image || "/placeholder.svg"}
                      alt={option.name}
                      fill
                      className="object-contain"
                      draggable={false}
                    />
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
