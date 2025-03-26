"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { Eye, EyeOff } from "lucide-react"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 입력값이 이메일 형식인지 확인
      const isEmail = /\S+@\S+\.\S+/.test(identifier)
      const email = identifier

      // 이메일이 아닌 경우 (아이디로 입력한 경우)
      // 이 부분은 Firebase 권한 문제로 인해 직접 쿼리하지 않고
      // 사용자가 이메일을 직접 입력하도록 안내합니다
      if (!isEmail) {
        setError("이메일 형식으로 입력해주세요. (예: example@email.com)")
        setLoading(false)
        return
      }

      // Firebase Authentication으로 로그인
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/")
    } catch (error: any) {
      console.error("로그인 오류:", error)

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("이메일 또는 비밀번호를 잘못 입력했습니다.")
      } else if (error.code === "auth/invalid-email") {
        setError("유효하지 않은 이메일 형식입니다.")
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      // Google 로그인 성공 시 사용자 정보를 Firestore에 저장
      if (result.user) {
        const user = result.user
        const userRef = doc(db, "users", user.uid)

        // 이미 존재하는 사용자인지 확인
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
          // 새 사용자인 경우 Firestore에 정보 저장
          const email = user.email || ""
          const username = email.split("@")[0] // 이메일에서 아이디 부분 추출

          await setDoc(userRef, {
            username: username,
            email: email,
            name: user.displayName || username,
            createdAt: serverTimestamp(),
            // 생년월일과 성별은 기본값으로 설정하지 않음
          })

          console.log("Google 로그인 - 새 사용자 정보 저장:", {
            uid: user.uid,
            username: username,
            email: email,
          })
        } else {
          console.log("Google 로그인 - 기존 사용자:", {
            uid: user.uid,
            email: user.email,
          })
        }
      }

      router.push("/")
    } catch (error: any) {
      console.error("Google 로그인 오류:", error)
      setError("Google 로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-8">PC 견적 로그인</h1>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative text-black">
                <Input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="이메일"
                  className="pl-10 py-6"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <div className="relative text-black">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  className="pl-10 py-6"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-4">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 py-6"
              disabled={loading}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google 계정으로 로그인
            </Button>
          </div>

          <div className="mt-6 flex justify-center space-x-4 text-sm ">
            <Link href="/auth/find-id" className="text-gray-600 hover:underline">
              아이디 찾기
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

