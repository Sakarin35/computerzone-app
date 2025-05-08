
// components/NavLinks.tsx
"use client"

import Link from "next/link"
import { useAuthState } from "react-firebase-hooks/auth"

import { usePathname } from "next/navigation"
import { auth } from "@/lib/firebase"

export function NavLinks() {
  const [user] = useAuthState(auth)
  const pathname = usePathname()

  const linkClasses = (path: string) =>
    `px-3 py-2 transition-colors duration-200 ${
      pathname === path
        ? "text-white border-b-2 border-blue-500"
        : "text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-500"
    }`

  return (
    <div className="flex space-x-6">
      <Link href="/" className={linkClasses("/")}>
        홈
      </Link>
      <Link href="/custom" className={linkClasses("/custom")}>
        PC 견적하기
      </Link>
      <Link href="/parts-db" className={linkClasses("/parts-db")}>
        부품DB
      </Link>
      {user && (
        <Link href="/saved-quotes" className={linkClasses("/saved-quotes")}>
          저장된 견적
        </Link>
      )}

    </div>
  )
}
