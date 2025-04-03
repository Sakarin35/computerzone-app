import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { getDisplayNameFromModelId } from "@/lib/utils-quote"

interface QuoteTemplateProps {
  quoteId?: string
  quoteName: string
  items: Array<{
    category: string
    name: string
    quantity: number
    price: number
  }>
  totalPrice: number
  userName?: string
  userEmail?: string
  createdAt?: Date | null
  isSaved: boolean // 추가!
}

export default function QuoteTemplate({
  quoteId,
  quoteName,
  items,
  totalPrice,
  userName,
  userEmail,
  createdAt,
}: QuoteTemplateProps) {
  // 견적일자: Firebase에서 가져온 createdAt이 있으면 사용, 없으면 현재 시간
  const dateToUse = createdAt || new Date()
  const formattedDate = format(dateToUse, "yyyy.MM.dd HH:mm:ss", { locale: ko })

  // 견적번호: Firebase에서 가져온 quoteId 그대로 사용
  const quoteNumber =
    quoteId ||
    `Q-${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(7, "0")}`

  const categoryNames: Record<string, string> = {
    vga: "그래픽카드",
    cpu: "CPU",
    mb: "메인보드",
    memory: "메모리(RAM)",
    ssd: "SSD",
    case: "PC 케이스",
    cooler: "쿨러/튜닝",
    power: "파워서플라이",
  }

  return (
    <div className="bg-white text-black p-6 max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="text-blue-600 font-bold text-3xl mr-2">computerzone</div>
          <div className="text-2xl font-bold">온라인견적서</div>
        </div>
        <div>1 / 1</div>
      </div>

      {/* 견적 정보 및 공급자 정보 */}
      <div className="flex gap-4 mb-6">
        <div className="border border-gray-300 p-4 flex-1">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="py-1 font-semibold w-24">견적번호</td>
                <td>{quoteNumber}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">주문자</td>
                <td>{userName || "비회원 고객님"}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">견적일자</td>
                <td>{formattedDate}</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">견적금액</td>
                <td className="text-lg font-bold">{totalPrice.toLocaleString()}원</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="border border-gray-300 p-4 flex-1 relative">
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td colSpan={3} className="py-1 font-semibold">
                  공급자
                </td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">상호명</td>
                <td className="px-2">|</td>
                <td>컴퓨터 견적 서비스</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">주소</td>
                <td className="px-2">|</td>
                <td>경기도 포천시 호국로 1007</td>
              </tr>
              <tr>
                <td className="py-1 font-semibold">대표전화</td>
                <td className="px-2">|</td>
                <td>.....................</td>
              </tr>
            </tbody>
          </table>
          <div className="absolute right-4 top-4">
            <div className="w-20 h-20 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 text-xs">
              <div className="text-center">
                <div className="text-sm font-bold">컴퓨터 견적 서비스</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 견적 내역 */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 py-2 w-12 text-center">번호</th>
              <th className="border border-gray-300 py-2 w-24 text-center">분류</th>
              <th className="border border-gray-300 py-2 text-center">제품명</th>
              <th className="border border-gray-300 py-2 w-28 text-center">판매가</th>
              <th className="border border-gray-300 py-2 w-16 text-center">수량</th>
              <th className="border border-gray-300 py-2 w-28 text-center">합계</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-300 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-300 py-2 text-center">
                  {categoryNames[item.category] || item.category}
                </td>
                <td className="border border-gray-300 py-2 px-3">{getDisplayNameFromModelId(item.name)}</td>
                <td className="border border-gray-300 py-2 text-right px-3">{item.price.toLocaleString()}원</td>
                <td className="border border-gray-300 py-2 text-center">{item.quantity}</td>
                <td className="border border-gray-300 py-2 text-right px-3">
                  {(item.price * item.quantity).toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 총 견적금액 */}
      <div className="bg-gray-100 border border-gray-300 p-4 text-right mb-6">
        <span className="font-bold mr-4">총 견적금액</span>
        <span className="text-xl font-bold">{totalPrice.toLocaleString()}원</span>
      </div>

      {/* 푸터 */}
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>본 견적서는 컴퓨터존에서 생성된 문서입니다.</p>
        <p>문의사항: {"jongyoun2256@gmail.com"}</p>
      </div>
    </div>
  )
}

