import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { AuthProvider } from "../components/AuthProvider"
import { NavLinks } from "../components/NavLinks"
import { AuthStatus } from "../components/Auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PC Builder",
  description: "Build your custom PC",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning className={inter.className + " bg-black text-white"}>
        <AuthProvider>
          {/* 상단 메뉴바 – fixed로 변경 */}
          <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
            <div className="container mx-auto px-4">
              <div className="flex justify-between h-16 items-center">
                <NavLinks />
                <AuthStatus />
              </div>
            </div>
          </header>

          {/* main에 padding-top을 주어 헤더 아래로 내용이 밀리도록 */}
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
