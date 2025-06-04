import { fetchComponents, type FirebaseComponentData } from "./fetch-components"
import { calculatePopularityScore } from "./popularity-utils"
import type { ComponentType, ComponentOption } from "@/app/data/components"

// Firebase 카테고리를 Custom 페이지 카테고리로 매핑 (더 포괄적으로)
const CATEGORY_MAPPING: Record<string, ComponentType> = {
  cpu: "cpu",
  vga: "vga",
  memory: "memory",
  ssd: "ssd",
  mb: "mb",
  motherboard: "mb", // 메인보드 추가 매핑
  mainboard: "mb", // 메인보드 추가 매핑
  마더보드: "mb", // 한글 메인보드
  메인보드: "mb", // 한글 메인보드
  power: "power",
  psu: "power", // 파워 추가 매핑
  case: "case",
  cooler: "cooler",
  cooling: "cooler", // 쿨러 추가 매핑
}

// Firebase 데이터를 ComponentOption 형식으로 변환
function convertFirebaseToComponentOption(item: FirebaseComponentData): ComponentOption {
  return {
    id: item.id || `fb-${Date.now()}-${Math.random()}`,
    name: item.name || "이름 없음",
    price: item.price || 0,
    image: item.image || "/placeholder.svg?height=400&width=400",
    description: item.description || item.specs || "상세 정보가 없습니다.",
  }
}

// Firebase에서 카테고리별 컴포넌트 데이터 가져오기 (인기순 정렬)
export async function fetchCustomComponentData(): Promise<Record<ComponentType, ComponentOption[]>> {
  try {
    console.log("Firebase에서 커스텀 페이지용 데이터 로딩 중...")

    const firebaseResponse = await fetchComponents()
    const customData: Record<ComponentType, ComponentOption[]> = {
      cpu: [],
      vga: [],
      memory: [],
      ssd: [],
      mb: [],
      power: [],
      case: [],
      cooler: [],
    }

    let allFirebaseData: FirebaseComponentData[] = []

    // fetchComponents가 배열을 반환하는 경우
    if (Array.isArray(firebaseResponse)) {
      allFirebaseData = firebaseResponse
    }
    // fetchComponents가 객체를 반환하는 경우
    else if (firebaseResponse && typeof firebaseResponse === "object") {
      const firebaseData = firebaseResponse as Record<string, FirebaseComponentData[]>
      // 모든 카테고리의 데이터를 하나의 배열로 합치기
      allFirebaseData = Object.values(firebaseData).flat()
    }

    console.log(`총 ${allFirebaseData.length}개의 Firebase 데이터 로드됨`)

    // 모든 고유한 카테고리 확인 (디버깅용)
    const uniqueCategories = [
      ...new Set(allFirebaseData.map((item) => (item as any).category?.toLowerCase() || "unknown")),
    ]
    console.log("Firebase에서 발견된 카테고리들:", uniqueCategories)

    // 카테고리별로 데이터 그룹화 및 인기순 정렬
    Object.entries(CATEGORY_MAPPING).forEach(([firebaseCategory, customCategory]) => {
      const categoryData = allFirebaseData.filter((item) => {
        const itemCategory = (item as any).category?.toLowerCase() || ""
        return itemCategory === firebaseCategory.toLowerCase()
      })

      if (categoryData.length > 0) {
        // 기존 데이터에 추가 (중복 방지)
        const existingIds = new Set(customData[customCategory].map((item) => item.id))
        const newData = categoryData.filter((item) => !existingIds.has(item.id || ""))

        if (newData.length > 0) {
          // 인기순으로 정렬
          const sortedData = newData
            .map((item) => ({
              ...item,
              popularityScore: calculatePopularityScore(item as any),
            }))
            .sort((a, b) => b.popularityScore - a.popularityScore)

          // ComponentOption 형식으로 변환하여 추가
          customData[customCategory].push(...sortedData.map(convertFirebaseToComponentOption))
        }

        console.log(`${firebaseCategory} → ${customCategory}: ${categoryData.length}개 제품 추가`)
      }
    })

    // 각 카테고리별 최종 인기순 정렬
    Object.keys(customData).forEach((category) => {
      const categoryKey = category as ComponentType
      if (customData[categoryKey].length > 0) {
        // 전체 데이터를 다시 인기순으로 정렬
        customData[categoryKey] = customData[categoryKey]
          .map((item) => ({
            ...item,
            popularityScore: calculatePopularityScore(item as any),
          }))
          .sort((a, b) => (b as any).popularityScore - (a as any).popularityScore)
          .map(({ popularityScore, ...item }) => item) // popularityScore 제거
      }
    })

    // 최종 결과 로그
    Object.entries(customData).forEach(([category, items]) => {
      console.log(`📦 최종 ${category}: ${items.length}개 제품`)
    })

    console.log("Firebase 데이터 로딩 및 인기순 정렬 완료")
    return customData
  } catch (error) {
    console.error("Firebase 데이터 로딩 실패:", error)
    return {
      cpu: [],
      vga: [],
      memory: [],
      ssd: [],
      mb: [],
      power: [],
      case: [],
      cooler: [],
    }
  }
}

// 로컬 데이터와 Firebase 데이터 병합 (Firebase 우선)
export function mergeComponentData(
  localData: Partial<Record<ComponentType, readonly ComponentOption[]>>,
  firebaseData: Record<ComponentType, ComponentOption[]>,
): Record<ComponentType, ComponentOption[]> {
  const mergedData: Record<ComponentType, ComponentOption[]> = {
    cpu: [],
    vga: [],
    memory: [],
    ssd: [],
    mb: [],
    power: [],
    case: [],
    cooler: [],
  }

  // 모든 카테고리 처리
  const allCategories: ComponentType[] = ["cpu", "vga", "memory", "ssd", "mb", "power", "case", "cooler"]

  allCategories.forEach((category) => {
    const firebase = firebaseData[category] || []
    const local = localData[category] ? [...localData[category]!] : []

    // Firebase 데이터가 있으면 Firebase 우선, 없으면 로컬 데이터 사용
    if (firebase.length > 0) {
      mergedData[category] = firebase
      console.log(`${category}: Firebase 데이터 ${firebase.length}개 사용`)
    } else {
      mergedData[category] = local
      console.log(`${category}: 로컬 데이터 ${local.length}개 사용 (Firebase 데이터 없음)`)
    }
  })

  return mergedData
}
