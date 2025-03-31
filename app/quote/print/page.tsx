import dynamic from "next/dynamic"

// 클라이언트 컴포넌트를 동적으로 임포트하고 레이아웃 없이 렌더링
const PrintQuote = dynamic(() => import("../print-quote"), { ssr: false })

// 메타데이터 설정으로 타이틀 변경
export const metadata = {
  title: "PC 견적서",
}

// 레이아웃 없이 견적서만 표시
export default function PrintQuotePage() {
  return <PrintQuote />
}

