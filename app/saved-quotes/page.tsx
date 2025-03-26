// /app/saved-quotes/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { auth, db } from "../../lib/firebase"
import { collection, query, where, getDocs, deleteDoc, doc, type Timestamp } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
import { Trash } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SavedQuote {
  id: string
  name: string
  items: {
    category: string
    name: string
    quantity: number
    price: number
  }[]
  totalPrice: number
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export default function SavedQuotes() {
  const [user] = useAuthState(auth)
  const [quotes, setQuotes] = useState<SavedQuote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      const fetchQuotes = async () => {
        setLoading(true)
        try {
          // 인덱스 문제를 해결하기 위해 orderBy 없이 먼저 쿼리
          const q = query(collection(db, "quotes"), where("userId", "==", user.uid))
          const querySnapshot = await getDocs(q)

          // 결과를 클라이언트 측에서 정렬
          const fetchedQuotes = querySnapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              }) as SavedQuote,
          )

          // createdAt 기준으로 내림차순 정렬 (최신순)
          fetchedQuotes.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0
            return b.createdAt.toMillis() - a.createdAt.toMillis()
          })

          setQuotes(fetchedQuotes)
          console.log("Fetched quotes:", fetchedQuotes)
        } catch (error) {
          console.error("Error fetching quotes:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchQuotes()
    }
  }, [user])

  const handleViewQuote = (quoteId: string) => {
    router.push(`/quote?id=${quoteId}`)
  }

  const handleCheckboxChange = (quoteId: string) => {
    setSelectedQuotes((prev) => {
      if (prev.includes(quoteId)) {
        return prev.filter((id) => id !== quoteId)
      } else {
        return [...prev, quoteId]
      }
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedQuotes(quotes.map((quote) => quote.id))
    } else {
      setSelectedQuotes([])
    }
  }

  const handleDeleteSelected = async () => {
    try {
      for (const quoteId of selectedQuotes) {
        await deleteDoc(doc(db, "quotes", quoteId))
      }

      // 성공적으로 삭제된 후 목록에서 제거
      setQuotes(quotes.filter((quote) => !selectedQuotes.includes(quote.id)))
      setSelectedQuotes([])
      setIsDeleteDialogOpen(false)
      alert(`${selectedQuotes.length}개의 견적서가 삭제되었습니다.`)
    } catch (error) {
      console.error("Error deleting quotes:", error)
      alert("견적서 삭제에 실패했습니다.")
    }
  }

  if (!user) {
    return <div className="text-center mt-8">로그인이 필요합니다.</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">저장된 견적</h1>
          <Button
            variant={selectedQuotes.length > 0 ? "destructive" : "outline"}
            onClick={() => selectedQuotes.length > 0 && setIsDeleteDialogOpen(true)}
            className={`flex items-center ${selectedQuotes.length === 0 ? "text-black" : ""}`}
            disabled={selectedQuotes.length === 0}
          >
            <Trash className="h-4 w-4 mr-2" />
            선택 삭제 {selectedQuotes.length > 0 ? `(${selectedQuotes.length})` : ""}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">저장된 견적이 없습니다.</p>
            <Button onClick={() => router.push("/")}>견적 만들기</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={selectedQuotes.length === quotes.length && quotes.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-left">견적서 이름</th>
                    <th className="p-4 text-left">생성일</th>
                    <th className="p-4 text-right">가격</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedQuotes.includes(quote.id)}
                          onCheckedChange={() => handleCheckboxChange(quote.id)}
                        />
                      </td>
                      <td
                        className="p-4 cursor-pointer font-medium text-blue-400 hover:underline"
                        onClick={() => handleViewQuote(quote.id)}
                      >
                        {quote.name || "이름 없는 견적"}
                      </td>
                      <td className="p-4 text-gray-400">
                        {quote.updatedAt
                          ? `수정됨: ${quote.updatedAt.toDate().toLocaleString()}`
                          : quote.createdAt
                            ? `${quote.createdAt.toDate().toLocaleString()}`
                            : "날짜 정보 없음"}
                      </td>
                      <td className="p-4 text-right font-bold">{quote.totalPrice?.toLocaleString() || 0}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 견적서 삭제 확인 모달 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">견적서 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              선택한 {selectedQuotes.length}개의 견적서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

