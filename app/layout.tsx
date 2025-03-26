import type React from "react"
// /app/layout.tsx
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
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>
          <header className="border-b border-gray-800">
            <div className="container mx-auto px-4">
              <div className="flex justify-between h-16 items-center">
                <NavLinks />
                <AuthStatus />
              </div>
            </div>
          </header>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}

