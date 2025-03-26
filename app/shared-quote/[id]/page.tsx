// /app/shared0quote/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '../../../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'

interface QuoteItem {
  category: string
  name: string
  quantity: number
  price: number
}

export default function SharedQuotePage() {
  const { id } = useParams()
  const [quote, setQuote] = useState<{ items: QuoteItem[], totalPrice: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const quoteRef = doc(db, 'quotes', id as string)
        const quoteSnap = await getDoc(quoteRef)
        if (quoteSnap.exists()) {
          setQuote(quoteSnap.data() as { items: QuoteItem[], totalPrice: number })
        } else {
          console.log('No such document!')
        }
      } catch (error) {
        console.error('Error fetching quote:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!quote) {
    return <div>Quote not found</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold mb-8">공유된 견적</h1>
        
        <div className="bg-gray-900 rounded-lg">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-400 border-b border-gray-800">
            <div className="col-span-2">분류</div>
            <div className="col-span-5">상품명</div>
            <div className="col-span-3 text-center">수량</div>
            <div className="col-span-2 text-right">가격</div>
          </div>

          <div className="divide-y divide-gray-800">
            {quote.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-2 font-medium text-gray-300">
                  {item.category}
                </div>
                <div className="col-span-5">{item.name}</div>
                <div className="col-span-3 text-center">{item.quantity}</div>
                <div className="col-span-2 text-right">
                  {(item.price * item.quantity).toLocaleString()}원
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>총 예상금액</span>
              <span>{quote.totalPrice.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button onClick={() => window.history.back()}>돌아가기</Button>
        </div>
      </div>
    </div>
  )
}

