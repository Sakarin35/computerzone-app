import type { FirebaseComponentData } from "./fetch-components"

/**
 * 1) 브랜드별 가중치 (0~100 스케일)
 */
const BRAND_POPULARITY: Record<string, number> = {
  intel: 90,
  amd: 85,
  nvidia: 95,
  geforce: 95,
  rtx: 100,
  gtx: 80,
  samsung: 90,
  sk하이닉스: 85,
  corsair: 80,
  "g.skill": 85,
  crucial: 75,
  wd: 80,
  seagate: 75,
  kingston: 70,
  asus: 90,
  msi: 85,
  gigabyte: 80,
  asrock: 75,
  seasonic: 95,
  evga: 85,
  nzxt: 80,
  noctua: 95,
  arctic: 70,
  쿨러마스터: 75,
  "cooler master": 75,
  "fractal design": 85,
  "be quiet": 85,
  // 한국 브랜드 추가
  마이크론: 70,
  팀그룹: 65,
  실리콘파워: 60,
}

/**
 * 2) 모델·시리즈별 가중치 (0~100 스케일)
 */
const MODEL_POPULARITY: Record<string, number> = {
  // Intel CPU
  "i9-13900k": 95,
  "i9-13900kf": 94,
  "i7-13700k": 90,
  "i7-13700kf": 89,
  "i5-13600k": 85,
  "i5-13600kf": 84,
  "i5-13400": 80,
  "i3-13100": 70,

  // AMD CPU
  "ryzen 9 7950x": 95,
  "ryzen 9 7900x": 92,
  "ryzen 7 7700x": 90,
  "ryzen 5 7600x": 85,
  "ryzen 5 5600x": 82,
  "ryzen 7 5700x": 80,

  // NVIDIA GPU
  "rtx 4090": 100,
  "rtx 4080": 98,
  "rtx 4070 ti": 95,
  "rtx 4070": 92,
  "rtx 4060 ti": 88,
  "rtx 4060": 85,
  "rtx 3080": 80,
  "rtx 3070": 75,
  "rtx 3060": 70,
  "gtx 1660": 65,
  "gtx 1650": 60,

  // AMD GPU
  "rx 7900xt": 92,
  "rx 7800xt": 88,
  "rx 7700xt": 85,
  "rx 6700xt": 75,
  "rx 6600xt": 70,

  // 메모리
  ddr5: 90,
  ddr4: 75,
  "3200": 70,
  "3600": 80,
  "5600": 85,
  "6000": 90,

  // SSD
  "980 pro": 95,
  "970 evo": 85,
  sn850: 90,
  mp600: 80,
}

/**
 * 3) 기능/특징 키워드별 가중치 (0~100 스케일)
 */
const FEATURE_KEYWORDS: Record<string, number> = {
  gaming: 50,
  게이밍: 50,
  oc: 40,
  overclocking: 40,
  오버클럭: 40,
  rgb: 30,
  led: 20,
  silent: 20,
  quiet: 20,
  조용한: 20,
  무소음: 25,
  "high performance": 60,
  ultra: 50,
  pro: 40,
  ti: 45,
  super: 35,
  xt: 40,
  수냉: 35,
  공냉: 25,
  타워형: 30,
  "80plus": 40,
  gold: 35,
  platinum: 45,
  titanium: 50,
  모듈러: 30,
  풀모듈러: 35,
  atx: 25,
  micro: 20,
  mini: 20,
}

/**
 * 4) 카테고리별 평균 가격 (예: 메인스트림 평균값)
 *    - 가성비 계산 시 분모(averagePrice)로 사용
 */
const AVERAGE_CATEGORY_PRICE: Record<string, number> = {
  cpu: 300000,
  vga: 600000,
  memory: 100000,
  ssd: 100000,
  mb: 150000,
  "m.b": 150000,
  power: 120000,
  case: 80000,
  cooler: 70000,
}

/**
 * 5) 가중치 비율 (총합 1.0)
 */
const WEIGHTS = {
  brand: 0.25,
  model: 0.25,
  feature: 0.15,
  recency: 0.1,
  value: 0.1,
  pricePenalty: 0.05,
}

/**
 * 출시일 문자열(YYYY-MM-DD)을 Date 객체로 파싱
 */
function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null
  const parts = dateStr.split("-")
  if (parts.length !== 3) return null
  const [y, m, d] = parts.map((x) => Number.parseInt(x, 10))
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null
  return new Date(y, m - 1, d)
}

/**
 * 출시일 기준으로 0~1 범위의 recency 값 반환
 */
function recencyFactor(releaseDateStr: string | undefined): number {
  const releaseDate = parseDate(releaseDateStr)
  if (!releaseDate) return 0.5 // 출시일 정보가 없으면 중간값
  const now = new Date()
  const diffMs = now.getTime() - releaseDate.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  if (diffDays <= 0) return 1
  if (diffDays >= 365) return 0
  return (365 - diffDays) / 365
}

/**
 * 텍스트 내 특정 키워드 등장 횟수 세기
 */
function countOccurrences(text: string, sub: string): number {
  let count = 0
  let pos = 0
  const lowerText = text.toLowerCase()
  const lowerSub = sub.toLowerCase()
  while (true) {
    const idx = lowerText.indexOf(lowerSub, pos)
    if (idx === -1) break
    count++
    pos = idx + lowerSub.length
  }
  return count
}

/**
 * 0~1 값을 0~100으로 정규화
 */
function normalize01to100(val: number): number {
  if (val <= 0) return 0
  if (val >= 1) return 100
  return val * 100
}

/**
 * 카테고리 이름 정규화
 */
function getCategoryKey(category: string): string {
  const categoryMap: Record<string, string> = {
    cpu: "cpu",
    vga: "vga",
    memory: "memory",
    ssd: "ssd",
    mb: "mb",
    "m.b": "mb",
    power: "power",
    case: "case",
    cooler: "cooler",
  }
  return categoryMap[category.toLowerCase()] || category.toLowerCase()
}

/**
 * 6) 메인 인기도 점수 계산 함수 (0~100)
 */
export function calculatePopularityScore(component: FirebaseComponentData): number {
  let brandScoreRaw = 0
  let modelScoreRaw = 0
  let featureScoreRaw = 0
  let recencyScoreRaw = 0
  let valueScoreRaw = 0
  let pricePenalty = 0

  const name = (component.name || "").toLowerCase()
  const description = (component.description || "").toLowerCase()
  const specs = (component.specs || "").toLowerCase()
  const allText = `${name} ${description} ${specs}`
  const totalWords = allText.split(/\s+/).length

  const category = getCategoryKey(component.category || "")
  const price = component.price || 0
  const avgPrice = AVERAGE_CATEGORY_PRICE[category] || 0

  // -------------------------------
  // 1) 브랜드 점수 (0~100)
  // -------------------------------
  for (const [brand, w] of Object.entries(BRAND_POPULARITY)) {
    const lowerBrand = brand.toLowerCase()
    if (allText.includes(lowerBrand)) {
      brandScoreRaw = w
      break
    }
  }

  // -------------------------------
  // 2) 모델·시리즈 점수 (0~100)
  // -------------------------------
  for (const [modelKey, w] of Object.entries(MODEL_POPULARITY)) {
    const lowerKey = modelKey.toLowerCase()
    if (allText.includes(lowerKey)) {
      modelScoreRaw = Math.max(modelScoreRaw, w)
    }
  }

  // -------------------------------
  // 3) 기능/특징 키워드 점수 (TF×IDF 흉내) (0~100)
  // -------------------------------
  for (const [feature, rawWeight] of Object.entries(FEATURE_KEYWORDS)) {
    const occ = countOccurrences(allText, feature)
    if (occ > 0) {
      const tf = occ / Math.max(totalWords, 1)
      const idfApprox = rawWeight / 100
      featureScoreRaw += tf * idfApprox * 100
    }
  }
  if (featureScoreRaw > 100) featureScoreRaw = 100

  // -------------------------------
  // 4) Recency 점수 (0~100)
  // -------------------------------
  // Firebase 데이터에 releaseDate가 없으므로 기본값 사용
  const recency01 = recencyFactor(undefined) // 또는 component.releaseDate가 있다면 사용
  recencyScoreRaw = normalize01to100(recency01)

  // -------------------------------
  // 5) 가격 감점 (0~30)
  // -------------------------------
  if (price > 0) {
    if (price < 10000) pricePenalty = 20
    else if (price > 2000000) pricePenalty = 30
  }

  // -------------------------------
  // 6) Value for Money 점수 (0~100)
  // -------------------------------
  if (avgPrice > 0 && price > 0 && modelScoreRaw > 0) {
    const raw = modelScoreRaw * (avgPrice / price)
    valueScoreRaw = raw > 100 ? 100 : raw
  } else {
    valueScoreRaw = 0
  }

  // -------------------------------
  // 7) 최종 점수 계산 및 클램프 (0~100)
  // -------------------------------
  const rawScore =
    brandScoreRaw * WEIGHTS.brand +
    modelScoreRaw * WEIGHTS.model +
    featureScoreRaw * WEIGHTS.feature +
    recencyScoreRaw * WEIGHTS.recency +
    valueScoreRaw * WEIGHTS.value -
    pricePenalty * WEIGHTS.pricePenalty

  return Math.max(0, Math.min(100, rawScore))
}

/**
 * 8) 인기순 정렬 함수
 */
export function sortByPopularity(components: FirebaseComponentData[]): FirebaseComponentData[] {
  return [...components].sort((a, b) => calculatePopularityScore(b) - calculatePopularityScore(a))
}
