// app/admin/page.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { db } from "../../lib/firebase"
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"
import { componentOrder } from "../data/components"

export default function AdminPage() {
  const [type, setType] = useState("")
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [description, setDescription] = useState("")
  const [componentTypes, setComponentTypes] = useState<string[]>([])

  // 컴포넌트 타입 목록 가져오기
  useEffect(() => {
    const fetchComponentTypes = async () => {
      try {
        const metadataDoc = await getDoc(doc(db, "metadata", "componentOrder"))
        if (metadataDoc.exists()) {
          setComponentTypes(metadataDoc.data().order)
        } else {
          // Firebase에 데이터가 없으면 로컬 데이터 사용
          setComponentTypes([...componentOrder])
        }
      } catch (error) {
        console.error("Error fetching component types:", error)
        setComponentTypes([...componentOrder])
      }
    }

    fetchComponentTypes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const componentRef = doc(db, "components", type)
      await updateDoc(componentRef, {
        items: arrayUnion({
          id,
          name,
          price: Number(price),
          image,
          description,
        }),
      })
      alert("Component added successfully!")
      // Reset form
      setId("")
      setName("")
      setPrice("")
      setImage("")
      setDescription("")
    } catch (error) {
      console.error("Error adding component:", error)
      alert("Error adding component")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">부품 추가</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-lg">
          <div>
            <label className="block mb-1 text-gray-300">타입:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
            >
              <option value="">타입 선택</option>
              {componentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-gray-300">ID:</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">이름:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">가격:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">이미지 URL:</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">설명:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white h-32"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            부품 추가
          </button>
        </form>
      </div>
    </div>
  )
}

