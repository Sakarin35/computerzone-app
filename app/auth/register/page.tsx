"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "male",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenderChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return false
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.")
      return false
    }

    // 생년월일 유효성 검사
    const year = Number.parseInt(formData.birthYear)
    const month = Number.parseInt(formData.birthMonth)
    const day = Number.parseInt(formData.birthDay)

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      setError("생년월일을 올바르게 입력해주세요.")
      return false
    }

    const currentYear = new Date().getFullYear()
    if (year < 1900 || year > currentYear) {
      setError("올바른 출생연도를 입력해주세요.")
      return false
    }

    if (month < 1 || month > 12) {
      setError("올바른 월을 입력해주세요.")
      return false
    }

    if (day < 1 || day > 31) {
      setError("올바른 일을 입력해주세요.")
      return false
    }

    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Firebase Authentication으로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // 생년월일 형식 변환
      const birthMonth = String(Number.parseInt(formData.birthMonth)).padStart(2, "0")
      const birthDay = String(Number.parseInt(formData.birthDay)).padStart(2, "0")
      const birthDate = `${formData.birthYear}-${birthMonth}-${birthDay}`

      // 이메일에서 사용자명 추출 (@ 앞부분)
      const username = formData.email.split("@")[0]

      // Firestore에 추가 사용자 정보 저장
      await setDoc(doc(db, "users", user.uid), {
        username: username, // 이메일에서 추출한 사용자명 사용
        email: formData.email,
        name: formData.name,
        birthDate: birthDate,
        gender: formData.gender,
        createdAt: serverTimestamp(),
      })

      console.log("사용자 정보가 성공적으로 저장되었습니다:", {
        uid: user.uid,
        username: username,
        email: formData.email,
      })

      // 성공 메시지 표시
      setSuccess(true)

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (error: any) {
      console.error("회원가입 오류:", error)
      if (error.code === "auth/email-already-in-use") {
        setError("이미 사용 중인 이메일입니다.")
      } else if (error.code === "auth/invalid-email") {
        setError("유효하지 않은 이메일 형식입니다.")
      } else {
        setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.")
      }
    } finally {
      setLoading(false)
    }
  }

  // 기존 handleGoogleRegister 함수를 수정합니다
  const handleGoogleRegister = async () => {
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

          console.log("Google 사용자 정보가 성공적으로 저장되었습니다:", {
            uid: user.uid,
            username: username,
            email: email,
          })
        }
      }

      router.push("/")
    } catch (error: any) {
      console.error("Google 회원가입 오류:", error)
      setError("Google 계정으로 회원가입 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 pt-20">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">회원가입 완료!</h1>
            <p className="mb-6">회원가입이 성공적으로 완료되었습니다.</p>
            <p className="mb-6 text-blue-600 font-medium">
              로그인 시 <span className="font-bold">이메일 주소</span>를 사용해주세요.
            </p>
            <p className="text-gray-500 mb-4">잠시 후 로그인 페이지로 이동합니다...</p>
            <Link href="/auth/login">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">로그인 페이지로 이동</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 pt-20">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="email">이메일 (로그인에 사용됩니다)</Label>
              <div className="relative mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="이메일"
                  className="pl-10 text-black"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">* 로그인 시 이메일 주소를 사용합니다.</p>
            </div>

            <div>
              <Label htmlFor="name">이름</Label>
              <div className="relative mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름"
                  className="pl-10 text-black"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호"
                  className="pl-10 text-black"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">6자 이상의 영문 대/소문자, 숫자, 특수문자를 사용하세요</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호 확인"
                  className="pl-10 text-black"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
              </div>
            </div>

            <div>
              <Label>생년월일</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div className="relative">
                  <Input
                    name="birthYear"
                    type="text"
                    value={formData.birthYear}
                    onChange={handleChange}
                    placeholder="년(4자)"
                    maxLength={4}
                    className="text-center text-black"
                    required
                  />
                </div>
                <div className="relative">
                  <Input
                    name="birthMonth"
                    type="text"
                    value={formData.birthMonth}
                    onChange={handleChange}
                    placeholder="월"
                    maxLength={2}
                    className="text-center text-black"
                    required
                  />
                </div>
                <div className="relative">
                  <Input
                    name="birthDay"
                    type="text"
                    value={formData.birthDay}
                    onChange={handleChange}
                    placeholder="일"
                    maxLength={2}
                    className="text-center text-black"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>성별</Label>
              <RadioGroup value={formData.gender} onValueChange={handleGenderChange} className="flex space-x-4 mt-1">
                <div className="flex items-center space-x-2 text-black">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="cursor-pointer">
                    남자
                  </Label>
                </div>
                <div className="flex items-center space-x-2 text-black">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="cursor-pointer">
                    여자
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={loading}>
              {loading ? "가입 중..." : "가입하기"}
            </Button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full mt-4 flex items-center justify-center bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
              Google 계정으로 가입
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">이미 계정이 있으신가요?</span>{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

