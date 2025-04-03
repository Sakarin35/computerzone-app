"use client"

import Link from "next/link"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function NavBar() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("로그아웃 오류:", error)
    }
  }

  // 사용자 표시 이름 가져오기 (실제 이름만 사용, "님" 제거)
  const displayName = user ? user.displayName || user.email?.split("@")[0] : "로그인"

  return (
    <div className="bg-black text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-500">computerzone</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link href="/custom" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                  PC 견적하기
                </Link>
                <Link href="/saved-quotes" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                  내 견적 목록
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-1">
                        <User className="h-4 w-4 mr-1" />
                        {displayName}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem onClick={() => router.push("/account")} className="cursor-pointer">
                        내 계정
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/saved-quotes")} className="cursor-pointer">
                        저장된 견적
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                        <LogOut className="h-4 w-4 mr-2" />
                        로그아웃
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" onClick={() => router.push("/login")}>
                    로그인
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

