// /components/NavLink.tsx
"use client"

import Link from "next/link"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../lib/firebase"

export function NavLinks() {
  const [user] = useAuthState(auth)

  return (
    <div className="flex space-x-8">
      <Link href="/" className="text-gray-300 hover:text-white px-3 py-2">
        홈
      </Link>
      <Link href="/parts-db" className="text-gray-300 hover:text-white px-3 py-2">
        부품DB
      </Link>
      {user && (
        <Link href="/saved-quotes" className="text-gray-300 hover:text-white px-3 py-2">
          저장된 견적
        </Link>
      )}
    </div>
  )
}

