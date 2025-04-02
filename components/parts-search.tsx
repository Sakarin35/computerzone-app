"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PartsSearchProps {
  onSearch: (query: string) => void
  className?: string
}

export default function PartsSearch({ onSearch, className }: PartsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery.trim())
  }

  return (
    <form onSubmit={handleSearch} className={`flex items-center ${className}`}>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="부품 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10 bg-gray-800 text-white border-gray-700 focus:border-blue-500"
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full text-gray-400 hover:text-white"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

