"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"
import { sendPasswordResetEmail } from "firebase/auth"

export default function FindPasswordPage() {
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (error: any) {
      console.error("비밀번호 재설정 오류:", error)
      if (error.code === "auth/user-not-found") {
        setError("등록되지 않은 이메일입니다.")
      } else if (error.code === "auth/invalid-email") {
        setError("유효하지 않은 이메일 형식입니다.")
      } else {
        setError("비밀번호 재설정 이메일 발송 중 오류가 발생했습니다.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white text-center mb-8">비밀번호 찾기</h1>

        <div className="bg-white rounded-lg p-6 shadow-md">
          {success ? (
            <div className="text-center">
              <p className="mb-4">비밀번호 재설정 이메일이 발송되었습니다.</p>
              <p className="text-sm text-gray-600 mb-6">
                {email} 주소로 전송된 이메일의 안내에 따라 비밀번호를 재설정해주세요.
              </p>
              <Link href="/auth/login">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">��그인 페이지로 이동</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4 text-black">
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
                <p className="text-xs text-gray-500 mt-1">
                  가입 시 등록한 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
                </p>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={loading}>
                {loading ? "처리 중..." : "비밀번호 재설정 이메일 받기"}
              </Button>
            </form>
          )}

          <div className="mt-6 flex justify-center space-x-4 text-sm">
            <Link href="/auth/login" className="text-gray-600 hover:underline">
              로그인
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/auth/find-id" className="text-gray-600 hover:underline">
              아이디 찾기
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

