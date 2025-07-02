"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CustomLoading() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // 더 자연스러운 진행률 증가
        const increment = Math.random() * 4 + 1
        return Math.min(prev + increment, 100)
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

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
            {["부", "품", " ", "데", "이", "터", " ", "로", "딩", " ", "중"].map((char, index) => (
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
