"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Eye, EyeOff } from "lucide-react"

interface UserData {
  username: string
  email: string
  name: string
  birthDate?: string
  birthYear?: string
  birthMonth?: string
  birthDay?: string
  gender?: string
  createdAt?: any
}

export default function MyPage() {
  const [user, loading] = useAuthState(auth)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userLoading, setUserLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<UserData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // 비밀번호 변경 관련 상태
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserLoading(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData

          // 생년월일 분리 처리
          let birthYear = "",
            birthMonth = "",
            birthDay = ""
          if (data.birthDate) {
            const parts = data.birthDate.split("-")
            if (parts.length === 3) {
              birthYear = parts[0]
              birthMonth = parts[1]
              birthDay = parts[2]
            }
          }

          setUserData({
            ...data,
            birthYear,
            birthMonth,
            birthDay,
          })

          setEditData({
            ...data,
            birthYear,
            birthMonth,
            birthDay,
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setUserLoading(false)
      }
    }

    if (!loading) {
      fetchUserData()
    }
  }, [user, loading])

  // 로그인하지 않은 사용자는 로그인 페이지로 리디렉션
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editData) {
      setEditData({
        ...editData,
        [name]: value,
      })
    }
  }

  const handleGenderChange = (value: string) => {
    if (editData) {
      setEditData({
        ...editData,
        gender: value,
      })
    }
  }

  const handleSave = async () => {
    if (!user || !editData) return

    setIsSaving(true)

    try {
      // 생년월일 형식 검증
      const birthYear = Number.parseInt(editData.birthYear || "0")
      const birthMonth = Number.parseInt(editData.birthMonth || "0")
      const birthDay = Number.parseInt(editData.birthDay || "0")

      const currentYear = new Date().getFullYear()

      if (birthYear < 1900 || birthYear > currentYear) {
        toast({
          title: "유효하지 않은 출생연도입니다.",
          description: "1900년부터 현재까지의 연도를 입력해주세요.",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      if (birthMonth < 1 || birthMonth > 12) {
        toast({
          title: "유효하지 않은 월입니다.",
          description: "1부터 12 사이의 값을 입력해주세요.",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      if (birthDay < 1 || birthDay > 31) {
        toast({
          title: "유효하지 않은 일입니다.",
          description: "1부터 31 사이의 값을 입력해주세요.",
          variant: "destructive",
        })
        setIsSaving(false)
        return
      }

      // 생년월일 형식 변환 - undefined 오류 수정
      const monthStr = String(birthMonth).padStart(2, "0")
      const dayStr = String(birthDay).padStart(2, "0")
      const birthDate = `${birthYear}-${monthStr}-${dayStr}`

      // Firestore 업데이트
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        name: editData.name,
        birthDate,
        gender: editData.gender,
      })

      // 상태 업데이트
      setUserData({
        ...editData,
        birthDate,
        birthMonth: monthStr,
        birthDay: dayStr,
      })

      toast({
        title: "저장 완료",
        description: "개인정보가 성공적으로 업데이트되었습니다.",
      })

      setIsEditing(false)
    } catch (error) {
      console.error("Error updating user data:", error)
      toast({
        title: "저장 실패",
        description: "개인정보 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // 편집 취소 시 원래 데이터로 복원
    setEditData(userData)
    setIsEditing(false)
  }

  // 비밀번호 변경 처리
  const handleChangePassword = async () => {
    if (!user) return

    // 유효성 검사
    if (newPassword.length < 6) {
      toast({
        title: "비밀번호 오류",
        description: "새 비밀번호는 6자 이상이어야 합니다.",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "비밀번호 오류",
        description: "새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      })
      return
    }

    setChangingPassword(true)

    try {
      // 현재 사용자 재인증
      const credential = EmailAuthProvider.credential(user.email || "", currentPassword)

      await reauthenticateWithCredential(user, credential)

      // 비밀번호 변경
      await updatePassword(user, newPassword)

      // 성공 메시지
      toast({
        title: "비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다.",
      })

      // 입력 필드 초기화
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      console.error("Error changing password:", error)

      if (error.code === "auth/wrong-password") {
        toast({
          title: "인증 오류",
          description: "현재 비밀번호가 올바르지 않습니다.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "비밀번호 변경 실패",
          description: "비밀번호 변경 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return null // 리디렉션 처리 중
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">마이페이지</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">개인정보 관리</TabsTrigger>
            <TabsTrigger value="password">비밀번호 변경</TabsTrigger>
            <TabsTrigger value="empty">빈 페이지</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <CardTitle>개인정보</CardTitle>
                <CardDescription className="text-gray-400">
                  회원님의 개인정보를 확인하고 관리할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    value={userData?.email || user.email || ""}
                    readOnly
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      name="name"
                      value={editData?.name || ""}
                      onChange={handleEditChange}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  ) : (
                    <Input
                      id="name"
                      value={userData?.name || ""}
                      readOnly
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>생년월일</Label>
                  {isEditing ? (
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        name="birthYear"
                        placeholder="년(4자)"
                        value={editData?.birthYear || ""}
                        onChange={handleEditChange}
                        maxLength={4}
                        className="bg-gray-800 border-gray-700 text-white text-center"
                      />
                      <Input
                        name="birthMonth"
                        placeholder="월"
                        value={editData?.birthMonth || ""}
                        onChange={handleEditChange}
                        maxLength={2}
                        className="bg-gray-800 border-gray-700 text-white text-center"
                      />
                      <Input
                        name="birthDay"
                        placeholder="일"
                        value={editData?.birthDay || ""}
                        onChange={handleEditChange}
                        maxLength={2}
                        className="bg-gray-800 border-gray-700 text-white text-center"
                      />
                    </div>
                  ) : (
                    <Input
                      value={userData?.birthDate || "정보 없음"}
                      readOnly
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>성별</Label>
                  {isEditing ? (
                    <RadioGroup
                      value={editData?.gender || ""}
                      onValueChange={handleGenderChange}
                      className="flex space-x-4 mt-1"
                    >
                      <div
                        className={`flex items-center space-x-2 text-white border rounded-md px-4 py-2 ${editData?.gender === "male" ? "bg-blue-600 border-blue-400" : "bg-gray-800 border-gray-700"}`}
                      >
                        <RadioGroupItem value="male" id="edit-male" />
                        <Label htmlFor="edit-male" className="cursor-pointer">
                          남자
                        </Label>
                      </div>
                      <div
                        className={`flex items-center space-x-2 text-white border rounded-md px-4 py-2 ${editData?.gender === "female" ? "bg-pink-600 border-pink-400" : "bg-gray-800 border-gray-700"}`}
                      >
                        <RadioGroupItem value="female" id="edit-female" />
                        <Label htmlFor="edit-female" className="cursor-pointer">
                          여자
                        </Label>
                      </div>
                    </RadioGroup>
                  ) : (
                    <Input
                      value={
                        userData?.gender === "male" ? "남자" : userData?.gender === "female" ? "여자" : "정보 없음"
                      }
                      readOnly
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4 text-black">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                      취소
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "저장 중..." : "저장"}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>개인정보 수정</Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card className="bg-gray-900 border-gray-800 text-white">
              <CardHeader>
                <CardTitle>비밀번호 변경</CardTitle>
                <CardDescription className="text-gray-400">
                  계정 보안을 위해 주기적으로 비밀번호를 변경해주세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user?.providerData[0]?.providerId === "google.com" ? (
                  <div className="py-8 text-center">
                    <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800">
                      <svg className="h-8 w-8" viewBox="0 0 24 24">
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
                    </div>
                    <h3 className="text-xl font-medium mb-2">Google 계정으로 로그인 중입니다</h3>
                    <p className="text-gray-400 mb-4">
                      Google 계정으로 로그인하셨기 때문에 이 페이지에서 비밀번호를 변경할 수 없습니다.
                    </p>
                    <p className="text-gray-400">비밀번호를 변경하려면 Google 계정 설정에서 변경해주세요.</p>
                    <Button
                      className="mt-6"
                      onClick={() => window.open("https://myaccount.google.com/security", "_blank")}
                    >
                      Google 계정 관리로 이동
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">현재 비밀번호</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white pr-10"
                          placeholder="현재 비밀번호"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">새 비밀번호</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white pr-10"
                          placeholder="새 비밀번호"
                        />
                      </div>
                      <p className="text-xs text-gray-500">비밀번호는 6자 이상이어야 합니다.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white pr-10"
                          placeholder="새 비밀번호 확인"
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex justify-end space-x-4 text-black">
                {user?.providerData[0]?.providerId !== "google.com" && (
                  <Button
                    onClick={handleChangePassword}
                    disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                  >
                    {changingPassword ? "변경 중..." : "비밀번호 변경"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="empty">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>빈 페이지</CardTitle>
                <CardDescription className="text-gray-400">이 페이지는 아직 준비 중입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center text-gray-400">
                  <p>곧 새로운 기능이 추가될 예정입니다.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}

