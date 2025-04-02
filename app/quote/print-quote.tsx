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

  // Firebase에서 견적 정보 가져오기
  useEffect(() => {
    const fetchQuoteDetails = async () => {
      if (quoteData?.quoteId) {
        try {
          const quoteDoc = await getDoc(doc(db, "quotes", quoteData.quoteId))
          if (quoteDoc.exists()) {
            const data = quoteDoc.data()
            setQuoteDetails(data)

            // Firestore Timestamp를 JavaScript Date로 변환
            if (data.createdAt) {
              const timestamp = data.createdAt as Timestamp
              setCreatedAt(timestamp.toDate())
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
        <div
          className="no-print flex justify-between w-full mb-4 fixed top-4 right-4 z-50"
          style={{ maxWidth: "200px", right: "1rem" }}
        >
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2">
            인쇄
          </button>
          <button onClick={handleSaveImage} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            다운로드
          </button>
        </div>

        {/* 실제 견적서 (직접 표시) */}
        <div ref={quoteRef} className="bg-white shadow-md w-full mt-16">
          <QuoteTemplate
            quoteId={quoteData.quoteId}
            quoteName={quoteData.quoteName}
            items={quoteData.items}
            totalPrice={quoteData.totalPrice}
            userName={user?.displayName || quoteData.userName || "비회원 고객님"}
            userEmail={user?.email || quoteData.userEmail}
            createdAt={createdAt}
          />
        </div>
      </div>
    </>
  )
}

