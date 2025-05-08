"use client"

import { useState, useEffect } from "react"
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
import { ChevronDown, LogOut, User, Menu, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { NavLinks } from "./NavLinks"

export function NavBar() {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("로그아웃 오류:", error)
    }
  }

  // 사용자 표시 이름 가져오기
  const displayName = user ? user.displayName || user.email?.split("@")[0] : "로그인"

  return (
    <div
      className={`relative z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-sm shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl font-bold text-blue-500"
              >
                computerzone
              </motion.span>
            </Link>
            <div className="hidden md:block ml-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <NavLinks />
              </motion.div>
            </div>
          </div>

          <div className="flex items-center">
            {!loading && (
              <>
                <div className="hidden md:block">
                  {user ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 hover:bg-gray-800/50 transition-colors duration-300"
                          >
                            <User className="h-4 w-4 mr-1" />
                            {displayName}
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-5 duration-300">
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
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button variant="ghost" onClick={() => router.push("/login")} className="gradient-hover-button">
                        로그인
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* 모바일 메뉴 버튼 */}
                <div className="md:hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-white"
                  >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-900 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/" ? "text-blue-400 bg-gray-800" : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                홈
              </Link>
              <Link
                href="/custom"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/custom"
                    ? "text-blue-400 bg-gray-800"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                PC 견적하기
              </Link>
              <Link
                href="/parts-db"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === "/parts-db"
                    ? "text-blue-400 bg-gray-800"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                부품DB
              </Link>
              {user && (
                <Link
                  href="/saved-quotes"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === "/saved-quotes"
                      ? "text-blue-400 bg-gray-800"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  저장된 견적
                </Link>
              )}
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    내 계정
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:text-red-400 hover:bg-gray-700"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-500 hover:text-blue-400 hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  로그인
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
