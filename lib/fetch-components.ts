// lib/fetch-components.ts
import { db } from "./firebase"
import { collection, getDocs, doc, getDoc, query, limit } from "firebase/firestore"

// Define the interface for component data from Firebase
export interface FirebaseComponentData {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  specs?: string
  category?: string
  url?: string
  createdAt?: any
}

// ——— 여기에 실제 DB에 있는 카테고리 ID들을 넣어두세요 ———
// (첫 글자만 대문자, 나머지 소문자 형태로)
const FALLBACK_CATEGORY_IDS = [
  "Ssd",
  "Cpu",
  "Memory",
  "SSD",
  "Case",
  "Cooler",
  "Power",
  "Vga",
  "M.B",
]

/** Fetch all components from all categories */
export async function fetchComponents(): Promise<Record<string, FirebaseComponentData[]>> {
  console.log("Fetching all components from Firebase...")

  let categoryIds: string[]
  try {
    const categoriesSnapshot = await getDocs(collection(db, "crawled_components"))
    console.log(`컬렉션 'crawled_components' 확인: ${categoriesSnapshot.size}개 문서 발견`)

    // 빈 배열이거나 에러 없이도 문서가 없으면 Fallback
    if (categoriesSnapshot.empty) {
      console.warn("루트 스캔 결과 카테고리가 없습니다. Static fallback 사용")
      categoryIds = FALLBACK_CATEGORY_IDS
    } else {
      // 정상적으로 읽어왔다면, 실제 ID 그대로 사용
      categoryIds = categoriesSnapshot.docs.map((d) => d.id)
    }
  } catch (e) {
    console.error("루트 컬렉션 조회 실패, Static fallback 사용:", e)
    categoryIds = FALLBACK_CATEGORY_IDS
  }

  const result: Record<string, FirebaseComponentData[]> = {}

  for (const categoryId of categoryIds) {
    // ★ 여기만 바뀌었습니다: key를 toLowerCase() 하지 않고, 실제 ID 그대로 사용
    const key = categoryId
    console.log(`Fetching components for category: ${categoryId}`)

    try {
      const itemsCollectionRef = collection(db, "crawled_components", categoryId, "items")
      const itemsQuery = query(itemsCollectionRef, limit(300))
      const componentsSnapshot = await getDocs(itemsQuery)

      console.log(
        `카테고리 '${categoryId}'의 items 컬렉션 확인: ${componentsSnapshot.size}개 문서 발견`
      )

      if (!componentsSnapshot.empty) {
        const components = componentsSnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || "Unknown",
            price: typeof data.price === "number" ? data.price : 0,
            image: data.image || "/placeholder.svg",
            description: data.description || "",
            specs: data.specs || "",
            category: categoryId,
            url: data.url || "",
            createdAt: data.createdAt,
          } as FirebaseComponentData
        })

        result[key] = components
      } else {
        result[key] = []
      }
    } catch (error) {
      console.error(`Error fetching components for category ${categoryId}:`, error)
      result[key] = []
    }
  }

  return result
}

/** Fetch components for a specific category */
export async function fetchComponentsByCategory(
  category: string
): Promise<FirebaseComponentData[]> {
  console.log(`Fetching components for category ${category}...`)

  try {
    // category는 이제 fetchComponents()에서 나온 실제 ID (예: "Ssd" 등) 그대로입니다
    const itemsCollectionRef = collection(db, "crawled_components", category, "items")
    const componentsSnapshot = await getDocs(itemsCollectionRef)

    console.log(
      `카테고리 '${category}'의 items 컬렉션 확인: ${componentsSnapshot.size}개 문서 발견`
    )

    if (componentsSnapshot.empty) {
      console.log(`No components found for category ${category}`)
      return []
    }

    return componentsSnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name || "Unknown",
        price: typeof data.price === "number" ? data.price : 0,
        image: data.image || "/placeholder.svg",
        description: data.description || "",
        specs: data.specs || "",
        category: category,
        url: data.url || "",
        createdAt: data.createdAt,
      } as FirebaseComponentData
    })
  } catch (error) {
    console.error(`Error fetching components for category ${category}:`, error)
    return []
  }
}

/** Fetch a specific component by ID */
export async function fetchComponentById(
  category: string,
  id: string
): Promise<FirebaseComponentData | null> {
  console.log(`Fetching component ${id} from category ${category}...`)

  try {
    const componentDoc = await getDoc(
      doc(db, "crawled_components", category, "items", id)
    )

    if (!componentDoc.exists()) {
      console.log(`Component ${id} not found in category ${category}`)
      return null
    }

    const data = componentDoc.data()
    return {
      id: componentDoc.id,
      name: data.name || "Unknown",
      price: typeof data.price === "number" ? data.price : 0,
      image: data.image || "/placeholder.svg",
      description: data.description || "",
      specs: data.specs || "",
      category: category,
      url: data.url || "",
      createdAt: data.createdAt,
    }
  } catch (error) {
    console.error(`Error fetching component ${id} from category ${category}:`, error)
    return null
  }
}
