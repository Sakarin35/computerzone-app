import type React from "react"
export default function PrintLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

