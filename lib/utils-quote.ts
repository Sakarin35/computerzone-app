// 견적서 관련 유틸리티 함수

// 특수 문자가 포함된 모델 이름 매핑
const specialModelNameMap: Record<string, string> = {
    "seasonic-focus-gx-850": "Seasonic FOCUS GX-850",
    "be-quiet-straight-power-11-750w": "be quiet! Straight Power 11 750W",
    "thermaltake-toughpower-gf1-850w": "Thermaltake Toughpower GF1 850W",
  }
  
  // 모델 ID로부터 표시 이름 가져오기
  export function getDisplayNameFromModelId(modelId: string): string {
    return specialModelNameMap[modelId] || modelId
  }
  
  // URL 안전한 인코딩 함수
  export function safeEncodeURIComponent(str: string): string {
    return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
  }
  
  // URL 안전한 디코딩 함수
  export function safeDecodeURIComponent(str: string): string {
    try {
      return decodeURIComponent(str)
    } catch (e) {
      // 특수 문자 처리를 위한 대체 방법
      const fixed = str.replace(/%(?![0-9A-Fa-f]{2})/g, "%25")
      return decodeURIComponent(fixed)
    }
  }
  
  // 견적 데이터 안전하게 파싱하기
  export function safeParseQuoteData(paramsData: string | null): any {
    if (!paramsData) return null
  
    try {
      const decodedData = safeDecodeURIComponent(paramsData)
      return JSON.parse(decodedData)
    } catch (e) {
      console.error("견적 데이터 파싱 오류:", e)
      return null
    }
  }
  
  