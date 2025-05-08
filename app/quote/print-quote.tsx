"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import QuoteTemplate from "@/components/quote-template"
import { safeParseQuoteData } from "@/lib/utils-quote"
import html2canvas from "html2canvas"
import { doc, getDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import type { Timestamp } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"

export default function PrintQuote() {
  const searchParams = useSearchParams()
  const quoteRef = useRef<HTMLDivElement>(null)
  const [quoteImage, setQuoteImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user] = useAuthState(auth)

  const quoteData = safeParseQuoteData(searchParams.get("data"))
  const [createdAt, setCreatedAt] = useState<Date | null>(null)
  const [quoteDetails, setQuoteDetails] = useState<any>(null)

  // 사용자 이름 가져오기 (이메일 사용자의 경우 이메일 앞부분 사용)
  const getUserName = () => {
    if (user) {
      if (user.displayName) {
        return `${user.displayName} 님` // 구글 로그인 등으로 displayName이 있는 경우 "님" 추가
      } else if (user.email) {
        return `${user.email.split("@")[0]} 님` // 이메일/비밀번호 로그인의 경우 이메일 앞부분 사용하고 "님" 추가
      }
    }
    return quoteData?.userName || "비회원 고객님"
  }

  // Firebase에서 견적 정보 가져오기
  useEffect(() => {
    const fetchQuoteDetails = async () => {
      if (quoteData) {
        try {
          // URL 파라미터에서 createdAt 값이 있으면 사용
          if (quoteData.createdAt) {
            try {
              // ISO 문자열이나 타임스탬프 숫자를 Date 객체로 변환
              const createdAtDate = new Date(quoteData.createdAt)
              if (!isNaN(createdAtDate.getTime())) {
                setCreatedAt(createdAtDate)
                console.log("Using createdAt from URL parameters:", createdAtDate)
              }
            } catch (error) {
              console.error("Error parsing createdAt from URL:", error)
            }
          }

          // 이미 quoteData에 필요한 정보가 있으면 Firebase 호출 건너뛰기
          if (quoteData.items && quoteData.quoteName && quoteData.totalPrice) {
            console.log("Using quote data from URL parameters")
            setIsLoading(false)
            return
          }

          // quoteId가 있고 필요한 정보가 URL에 없는 경우에만 Firebase에서 가져오기
          if (quoteData.quoteId) {
            console.log("Fetching quote details from Firebase")
            const quoteDoc = await getDoc(doc(db, "quotes", quoteData.quoteId))
            if (quoteDoc.exists()) {
              const data = quoteDoc.data()
              setQuoteDetails(data)

              // Firestore Timestamp를 JavaScript Date로 변환 (URL에서 가져온 createdAt이 없는 경우에만)
              if (data.createdAt && !createdAt) {
                const timestamp = data.createdAt as Timestamp
                setCreatedAt(timestamp.toDate())
              }
            }
          }
        } catch (error) {
          console.error("Error fetching quote details:", error)
        }
      }
      setIsLoading(false)
    }

    fetchQuoteDetails()
  }, [quoteData])

  // 견적서를 이미지로 변환
  useEffect(() => {
    if (!isLoading && quoteRef.current) {
      const captureQuote = async () => {
        try {
          const canvas = await html2canvas(quoteRef.current, {
            scale: 2,
            backgroundColor: "#ffffff",
            logging: false,
            useCORS: true,
            // 여백 없이 견적서만 캡처하기 위한 설정
            windowWidth: quoteRef.current.scrollWidth,
            windowHeight: quoteRef.current.scrollHeight,
          })

          setQuoteImage(canvas.toDataURL("image/png"))
        } catch (error) {
          console.error("Error capturing quote:", error)
        }
      }

      captureQuote()
    }
  }, [isLoading])

  const handleSaveImage = () => {
    if (!quoteImage) return

    try {
      const downloadLink = document.createElement("a")
      downloadLink.href = quoteImage
      downloadLink.download = `${quoteData?.quoteName || "PC견적서"}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } catch (error) {
      console.error("Error saving quote as image:", error)
      alert("견적서 이미지 저장에 실패했습니다.")
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">견적서 정보를 불러오는 중...</div>
  }

  if (!quoteData) {
    return <div className="flex justify-center items-center h-screen">견적 데이터를 찾을 수 없습니다.</div>
  }

  return (
    <>
      <div className="print-only">
        <style jsx global>{`
          @media print {
            body { margin: 0; padding: 0; }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
          }
          .print-only { display: none; }
        
          /* 네비게이션 바 숨기기 */
          nav, header, footer, .navbar {
            display: none !important;
          }
        `}</style>
      </div>

      <div className="flex flex-col items-center p-4 max-w-4xl mx-auto">
        {/* 버튼을 하단 중앙에 배치 */}
        <div className="no-print flex justify-center w-full fixed bottom-8 z-50">
          <div className="flex space-x-4">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              인쇄하기
            </button>
            <button
              onClick={handleSaveImage}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              이미지로 저장
            </button>
          </div>
        </div>

        {/* 실제 견적서 (직접 표시) */}
        <div ref={quoteRef} className="bg-white shadow-md w-full mt-8 mb-24">
          <QuoteTemplate
            quoteId={quoteData.quoteId}
            quoteName={quoteData.quoteName}
            items={quoteData.items}
            totalPrice={quoteData.totalPrice}
            userName={getUserName()}
            userEmail={user?.email || quoteData.userEmail}
            createdAt={createdAt}
            isSaved={!!quoteData.quoteId}
          />
        </div>
      </div>
    </>
  )
}

