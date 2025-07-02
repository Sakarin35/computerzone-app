"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface PremiumLoadingProps {
  onComplete?: () => void
}

export function PremiumLoading({ onComplete }: PremiumLoadingProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 3000 // 3초
    const interval = 50 // 50ms마다 업데이트
    const increment = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment
        if (newProgress >= 100) {
          clearInterval(timer)
          setTimeout(() => {
            onComplete?.()
          }, 500) // 100% 도달 후 0.5초 대기
          return 100
        }
        return newProgress
      })
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/images/genesis-loading-bg.png')",
        }}
      />

      {/* 코너 장식 */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-white/30"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-white/30"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-white/30"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-white/30"></div>

      <div className="relative z-10 text-center">
        {/* 브랜드 텍스트 */}
        <div className="mb-16">
          <h1 className="text-2xl font-light tracking-[0.3em] text-white mb-2">COMPUTERZONE</h1>
          <p className="text-sm font-light tracking-[0.2em] text-white/70">CUSTOM PC CONFIGURATOR</p>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-96 mb-8">
          <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-white via-blue-200 to-white rounded-full"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.5)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </div>

        {/* 퍼센트 표시 */}
        <div className="text-right">
          <span className="text-2xl font-light text-white tracking-wider">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  )
}
