"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ArrowLeft, Save, Share, Trash, Edit, Camera } from "lucide-react"
import { auth, db } from "../../lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getDisplayNameFromModelId } from "../../lib/utils-quote"

interface QuoteItem {
  category: string
  name: string
  quantity: number
  price: number
}

interface SavedQuote {
  id: string
  name: string
}

const categoryNames: Record<string, string> = {
  vga: "그래픽카드",
  cpu: "CPU",
  mb: "메인보드",
  memory: "메모리",
  ssd: "SSD",
  case: "케이스",
  cooler: "쿨러/튜닝",
  power: "파워",
}

export default function QuotePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [user] = useAuthState(auth)
  const [items, setItems] = useState<QuoteItem[]>(() => {
    const paramsData = searchParams.get("components")
    if (paramsData) {
      try {
        // 1단계: 안전한 decodeURIComponent 처리
        let decodedData
        try {
          decodedData = decodeURIComponent(paramsData)
        } catch (decodeError) {
          console.error("URI 디코딩 오류:", decodeError)
          // 특수 문자 처리를 위한 대체 방법
          decodedData = paramsData.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
          decodedData = decodeURIComponent(decodedData)
        }

        if (!decodedData) return []

        // 2단계: JSON 파싱
        const decoded = JSON.parse(decodedData)

        // 3단계: 유효성 검사 후 map으로 변환
        if (!decoded || typeof decoded !== "object") {
          console.error("유효하지 않은 데이터 형식:", decoded)
          return []
        }

        // 4단계: 안전한 변환
        return Object.entries(decoded)
          .map(([category, component]: [string, any]) => {
            if (!component || typeof component !== "object") {
              console.error(`유효하지 않은 컴포넌트 데이터 (${category}):`, component)
              return null
            }

            return {
              category,
              name: component.name || "이름 없음",
              quantity: 1,
              price: Number.parseInt(component.price) || 0,
            }
          })
          .filter(Boolean) as QuoteItem[]
      } catch (e) {
        console.error("🚨 Failed to parse components data:", e, "\nparamsData:", paramsData)
        return []
      }
    }
    return []
  })
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [quoteName, setQuoteName] = useState("")
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([])
  const [selectedQuote, setSelectedQuote] = useState<string>("new")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentQuoteId, setCurrentQuoteId] = useState<string | null>(null)
  const [currentQuoteName, setCurrentQuoteName] = useState<string>("이름 없는 견적")
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [newQuoteName, setNewQuoteName] = useState<string>("")

  // 견적서 요소에 대한 ref 추가
  const quoteRef = useRef<HTMLDivElement>(null)

  // URL에서 견적서 ID 가져오기
  useEffect(() => {
    const quoteId = searchParams.get("id")
    if (quoteId) {
      setCurrentQuoteId(quoteId)
      // 견적서 이름 가져오기
      const fetchQuoteName = async () => {
        try {
          const quoteDoc = await getDoc(doc(db, "quotes", quoteId))
          if (quoteDoc.exists()) {
            const quoteData = quoteDoc.data()
            setCurrentQuoteName(quoteData.name || "이름 없는 견적")
            setNewQuoteName(quoteData.name || "이름 없는 견적")

            // 견적서 아이템 설정
            if (quoteData.items && Array.isArray(quoteData.items)) {
              setItems(quoteData.items)
            }
          }
        } catch (error) {
          console.error("Error fetching quote name:", error)
        }
      }
      fetchQuoteName()
    }
  }, [searchParams])

  const handleQuantityChange = (index: number, change: number) => {
    setItems((current) =>
      current.map((item, i) => {
        if (i === index) {
          const newQuantity = item.quantity + change
          // 수량이 0이면 해당 아이템을 제거
          if (newQuantity <= 0) {
            return { ...item, quantity: 0 }
          }
          return { ...item, quantity: newQuantity }
        }
        return item
      }),
    )
  }

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [items])

  const handleBack = () => {
    if (window.confirm("첫 페이지로 돌아가시겠습니까? 현재 견적 내용은 저장되지 않습니다.")) {
      router.push("/")
    }
  }

  const openSaveDialog = async () => {
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }

    // 사용자의 저장된 견적 목록 가져오기
    try {
      const q = query(collection(db, "quotes"), where("userId", "==", user.uid))
      const querySnapshot = await getDocs(q)
      const quotes: SavedQuote[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        quotes.push({ id: doc.id, name: data.name || "이름 없는 견적" })
      })
      setSavedQuotes(quotes)

      // 현재 견적서 이름을 기본값으로 설정
      if (currentQuoteId) {
        setSelectedQuote(currentQuoteId)
        setQuoteName(currentQuoteName)
      } else {
        setSelectedQuote("new")
        setQuoteName(generateDefaultQuoteName())
      }

      setIsSaveDialogOpen(true)
    } catch (error) {
      console.error("Error fetching saved quotes:", error)
    }
  }

  // 기본 견적서 이름 생성 (현재 날짜와 시간 포함)
  const generateDefaultQuoteName = () => {
    const now = new Date()
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    return `견적서 ${dateStr} ${timeStr}`
  }

  const handleDeleteQuote = async () => {
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }

    try {
      if (currentQuoteId) {
        // Firestore에서 문서 존재 여부 확인
        console.log("Attempting to delete quote with ID:", currentQuoteId)

        // 문서 삭제 시도 - 존재 여부 확인 없이 바로 삭제 시도
        await deleteDoc(doc(db, "quotes", currentQuoteId))
        console.log("문서가 성공적으로 삭제되었습니다.")

        // 상태 갱신
        setSavedQuotes((prev) => prev.filter((quote) => quote.id !== currentQuoteId))
        setItems([])
        setIsDeleteDialogOpen(false)

        // 삭제 성공 메시지 표시
        alert("견적서가 삭제되었습니다.")

        // 저장된 견적 목록 페이지로 이동
        router.push("/saved-quotes")
      } else {
        // 현재 견적서가 저장되지 않은 경우
        console.log("저장되지 않은 견적서입니다.")
        setItems([])
        setIsDeleteDialogOpen(false)
        router.push("/")
      }
    } catch (error) {
      console.error("삭제 실패:", error)
      alert(`견적서 삭제에 실패했습니다: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const handleSave = async () => {
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }

    try {
      const finalQuoteName = quoteName || generateDefaultQuoteName()

      if (selectedQuote !== "new" && savedQuotes.some((q) => q.id === selectedQuote)) {
        // 기존 견적서 업데이트
        await updateDoc(doc(db, "quotes", selectedQuote), {
          name: finalQuoteName,
          items,
          totalPrice,
          updatedAt: serverTimestamp(),
        })
        setCurrentQuoteId(selectedQuote)
        setCurrentQuoteName(finalQuoteName)
      } else {
        // 새 견적서 생성
        const quoteRef = await addDoc(collection(db, "quotes"), {
          userId: user.uid,
          name: finalQuoteName,
          items,
          totalPrice,
          createdAt: serverTimestamp(),
        })
        setCurrentQuoteId(quoteRef.id)
        setCurrentQuoteName(finalQuoteName)
      }

      setIsSaveDialogOpen(false)
      alert("견적이 저장되었습니다.")
    } catch (error) {
      console.error("Error saving quote:", error)
      alert("견적 저장에 실패했습니다.")
    }
  }

  const handleRename = async () => {
    if (!user || !currentQuoteId) {
      alert("로그인이 필요하거나 저장된 견적서가 아닙니다.")
      return
    }

    try {
      const finalQuoteName = newQuoteName || "이름 없는 견적"

      // 견적서 이름 업데이트
      await updateDoc(doc(db, "quotes", currentQuoteId), {
        name: finalQuoteName,
        updatedAt: serverTimestamp(),
      })

      setCurrentQuoteName(finalQuoteName)
      setIsRenameDialogOpen(false)
      alert("견적서 이름이 변경되었습니다.")
    } catch (error) {
      console.error("Error renaming quote:", error)
      alert("견적서 이름 변경에 실패했습니다.")
    }
  }

  const handleShare = () => {
    if (!user) {
      alert("로그인이 필요합니다.")
      return
    }
    setIsShareDialogOpen(true)
  }

  const sendEmail = async () => {
    if (!user || !user.email) {
      alert("이메일 주소를 찾을 수 없습니다.")
      return
    }

    const subject = encodeURIComponent("PC 견적 공유")
    const body = encodeURIComponent(`
견적서 이름: ${currentQuoteName}

PC 견적 정보:

${items.map((item) => `${categoryNames[item.category] || item.category}: ${item.name} - ${item.quantity}개 - ${(item.price * item.quantity).toLocaleString()}원`).join("\n")}

총 예상금액: ${totalPrice.toLocaleString()}원
    `)

    // 실제 이메일 전송 로직을 여기에 구현해야 합니다.
    // 현재는 시뮬레이션만 합니다.
    console.log(`Sending email to: ${user.email}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${body}`)

    alert(`견적서가 ${user.email}로 전송되었습니다.`)
    setIsShareDialogOpen(false)
  }

  // 견적서를 이미지로 저장하는 함수
  const saveAsImage = async () => {
    if (!quoteRef.current) return

    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(quoteRef.current, {
        scale: 2,
        backgroundColor: "#111827",
        logging: false,
        useCORS: true,
      })

      const image = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.href = image
      downloadLink.download = `${currentQuoteName || "PC견적서"}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      setIsSaveDialogOpen(false)
    } catch (error) {
      console.error("Error saving quote as image:", error)
      alert("견적서 이미지 저장에 실패했습니다.")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" onClick={handleBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              돌아가기
            </Button>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">{currentQuoteId ? currentQuoteName : "새 견적서"}</h1>
              {currentQuoteId && (
                <Button variant="ghost" onClick={() => setIsRenameDialogOpen(true)} className="ml-2">
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="flex space-x-4">
            <Button onClick={openSaveDialog}>
              <Save className="h-4 w-4 mr-2" />
              저장
            </Button>
            <Button onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              이메일로 공유
            </Button>
            <Button onClick={() => setIsDeleteDialogOpen(true)} variant="destructive" className="flex items-center">
              <Trash className="h-4 w-4 mr-2" />
              삭제
            </Button>
          </div>
        </div>

        <div ref={quoteRef} className="bg-gray-900 rounded-lg">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-400 border-b border-gray-800">
            <div className="col-span-2">분류</div>
            <div className="col-span-5">상품명</div>
            <div className="col-span-3 text-center">수량</div>
            <div className="col-span-2 text-right">가격</div>
          </div>

          <div className="divide-y divide-gray-800">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-2 font-medium text-gray-300">
                  {categoryNames[item.category] || item.category}
                </div>
                <div className="col-span-5">{getDisplayNameFromModelId(item.name)}</div>
                <div className="col-span-3 flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-gray-800 hover:bg-gray-700"
                    onClick={() => handleQuantityChange(index, -1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-gray-800 hover:bg-gray-700"
                    onClick={() => handleQuantityChange(index, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="col-span-2 text-right">{Math.round(item.price * item.quantity).toLocaleString()}원</div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="flex justify-between items-center text-lg font-bold mb-4">
              <span>총 예상금액</span>
              <span>{Math.round(totalPrice).toLocaleString()}원</span>
            </div>
            <div className="flex justify-end"></div>
          </div>
        </div>
      </div>

      {/* 견적서 저장 모달 */}
      <AlertDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">견적함</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mt-4">
                <RadioGroup value={selectedQuote} onValueChange={setSelectedQuote} className="mb-4">
                  <div className="flex items-center space-x-2 p-2 rounded bg-gray-100">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">새 견적함</Label>
                  </div>

                  {savedQuotes.map((quote) => (
                    <div key={quote.id} className="flex items-center space-x-2 p-2 rounded bg-gray-100 mt-2">
                      <RadioGroupItem value={quote.id} id={quote.id} />
                      <Label htmlFor={quote.id}>{quote.name}</Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Label htmlFor="quoteName">견적함 이름</Label>
                    <Input
                      id="quoteName"
                      value={quoteName}
                      onChange={(e) => setQuoteName(e.target.value)}
                      placeholder="견적함 이름을 입력하세요."
                      className="flex-1"
                    />
                  </div>
                  <Button onClick={handleSave} className="w-full">
                    저장하기
                  </Button>
                </div>

                <div className="text-sm text-gray-500 mt-4">
                  <p className="mb-1">견적 저장 안내:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>장바구니에 담긴 상품을 견적함에 저장할 수 있습니다.</li>
                    <li>저장한 견적은 '견적함 클릭'에서 확인할 수 있습니다.</li>
                    <li>견적이 저장되어 있는 견적함에 새로게 저장 시 기존 견적은 삭제됩니다.</li>
                    <li>저장 가능한 견적함은 최대 10개입니다.</li>
                    <li>견적함에 저장된 상품은 1년간 유지됩니다.</li>
                    <li>견적함은 최대 30자, 한글, 영문, 숫자만 입력할 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={saveAsImage} className="flex items-center text-black">
              <Camera className="h-4 w-4 mr-2 text-black" />
              이미지 저장
            </Button>
            <AlertDialogCancel className="text-black">취소</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 견적서 이름 변경 모달 */}
      <AlertDialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">견적서 이름 변경</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Label htmlFor="newQuoteName">새 이름</Label>
                  <Input
                    id="newQuoteName"
                    value={newQuoteName}
                    onChange={(e) => setNewQuoteName(e.target.value)}
                    placeholder="새 견적서 이름을 입력하세요."
                    className="flex-1"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleRename}>변경</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 견적서 공유 모달 */}
      <AlertDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">견적서 공유</AlertDialogTitle>
            <AlertDialogDescription>
              현재 로그인한 이메일 주소({user?.email})로 견적서를 보내시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black">취소</AlertDialogCancel>
            <AlertDialogAction onClick={sendEmail}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 견적서 삭제 모달 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">견적서 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              {currentQuoteId ? `"${currentQuoteName}" 견적서를 삭제하시겠습니까?` : "현재 견적서를 삭제하시겠습니까?"}{" "}
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black">취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuote}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

