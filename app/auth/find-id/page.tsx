"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"

export default function FindIdPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [foundUsername, setFoundUsername] = useState<string | null>(null)
  const [foundEmail, setFoundEmail] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFoundUsername(null)
    setFoundEmail(null)
    setLoading(true)

    try {
      // Firestore에서 이메일로 사용자 검색
      const q = query(collection(db, "users"), where("email", "==", email))
      const querySnapshot = await getDocs(q)

      console.log("아이디 찾기 검색 결과:", { email, name, count: querySnapshot.size })

      if (querySnapshot.empty) {
        setError("일치하는 계정 정보를 찾을 수 없습니다.")
        setLoading(false)
        return
      }

      // 이메일로 찾은 사용자 중에서 이름이 일치하는 사용자 찾기
      let found = false
      querySnapshot.forEach((doc) => {
        const userData = doc.data()
        console.log("검색된 사용자:", userData)

        if (userData.name === name) {
          setFoundUsername(userData.username)
          setFoundEmail(userData.email)
          found = true
        }
      })

      if (!found) {
        setError("일치하는 계정 정보를 찾을 수 없습니다.")
      }
    } catch (error) {
      console.error("아이디 찾기 오류:", error)
      setError("아이디 찾기 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-8">아이디 찾기</h1>

        <div className="bg-white rounded-lg p-6 shadow-md">
          {foundUsername ? (
            <div className="text-center">
              <p className="mb-4">찾은 아이디:</p>
              <p className="text-xl font-bold mb-2">{foundUsername}</p>
              {foundEmail && (
                <p className="text-sm text-gray-600 mb-6">
                  로그인 시 아이디가 아닌 <span className="font-bold text-blue-600">{foundEmail}</span> 이메일 주소를
                  사용해주세요.
                </p>
              )}
              <div className="flex justify-center space-x-4">
                <Link href="/auth/login">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">로그인</Button>
                </Link>
                <Link href="/auth/find-password">
                  <Button variant="outline">비밀번호 찾기</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFindId} className="space-y-4 text-black">
              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일"
                  required
                />
              </div>

              <div>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름"
                  required
                />
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={loading}>
                {loading ? "검색 중..." : "아이디 찾기"}
              </Button>
            </form>
          )}

          <div className="mt-6 flex justify-center space-x-4 text-sm">
            <Link href="/auth/login" className="text-gray-600 hover:underline">
              로그인
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/auth/find-password" className="text-gray-600 hover:underline">
              비밀번호 찾기
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/auth/register" className="text-gray-600 hover:underline">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

