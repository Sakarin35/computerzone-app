import type React from "react"

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <style>{`
          /* 네비게이션 바 및 불필요한 UI 요소 숨기기 */
          nav, header, footer, .navbar {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
            background-color: white;
          }
        `}</style>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

