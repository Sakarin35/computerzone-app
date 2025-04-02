import { db } from "./firebase"
import { collection, getDocs, doc, getDoc, query, limit } from "firebase/firestore"
import { componentOptions } from "@/app/data/components"

export interface FirebaseComponentData {
  id: string
  name: string
  price: number
  description?: string
  image?: string
  specs?: string
  [key: string]: any
}

// Firebase 연결 상태 확인
async function checkFirebaseConnection(): Promise<boolean> {
  try {
    // 간단한 테스트 쿼리 실행
    const testCollection = collection(db, "test")
    await getDocs(query(testCollection, limit(1)))
    return true
  } catch (error) {
    console.error("Firebase connection test failed:", error)
    return false
  }
}

// 모든 컴포넌트 가져오기
export async function fetchComponents(): Promise<Record<string, FirebaseComponentData[]>> {
  const result: Record<string, FirebaseComponentData[]> = {}

  try {
    // Firebase 연결 확인
    const isConnected = await checkFirebaseConnection()
    if (!isConnected) {
      console.warn("Firebase connection failed, using local data")
      // 로컬 데이터 사용
      return Object.keys(componentOptions).reduce(
        (acc, type) => {
          acc[type] = componentOptions[type]
          return acc
        },
        {} as Record<string, FirebaseComponentData[]>,
      )
    }

    // 각 컴포넌트 타입에 대해 컬렉션 가져오기
    for (const type of Object.keys(componentOptions)) {
      try {
        console.log(`Fetching components for ${type}...`)
        const componentsCollection = collection(db, `components/${type}/items`)
        const componentsQuery = query(componentsCollection)
        const snapshot = await getDocs(componentsQuery)

        if (!snapshot.empty) {
          result[type] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            price: Number(doc.data().price || 0), // 가격이 문자열로 저장되어 있을 경우 숫자로 변환
          })) as FirebaseComponentData[]
          console.log(`Fetched ${result[type].length} components for ${type}`)
        } else {
          // Firebase에 데이터가 없으면 로컬 데이터 사용
          console.log(`No Firebase data for ${type}, using local data`)
          result[type] = componentOptions[type]
        }
      } catch (error) {
        console.error(`Error fetching components for ${type}:`, error)
        // 오류 발생 시 로컬 데이터 사용
        result[type] = componentOptions[type]
      }
    }

    return result
  } catch (error) {
    console.error("Error fetching components:", error)
    // 오류 발생 시 로컬 데이터 반환
    return Object.keys(componentOptions).reduce(
      (acc, type) => {
        acc[type] = componentOptions[type]
        return acc
      },
      {} as Record<string, FirebaseComponentData[]>,
    )
  }
}

// ID로 특정 컴포넌트 가져오기
export async function fetchComponentById(type: string, id: string): Promise<FirebaseComponentData | null> {
  try {
    console.log(`Fetching component ${type}/${id}...`)

    // Firebase 연결 확인
    const isConnected = await checkFirebaseConnection()
    if (!isConnected) {
      console.warn("Firebase connection failed, using local data")
      // 로컬 데이터에서 찾기
      const localComponent = componentOptions[type]?.find((c) => c.id === id)
      return (localComponent as FirebaseComponentData) || null
    }

    try {
      const componentDoc = doc(db, `components/${type}/items/${id}`)
      const snapshot = await getDoc(componentDoc)

      if (snapshot.exists()) {
        const data = snapshot.data()
        return {
          id: snapshot.id,
          ...data,
          price: Number(data.price || 0), // 가격이 문자열로 저장되어 있을 경우 숫자로 변환
        } as FirebaseComponentData
      }
    } catch (error) {
      console.error(`Error fetching component ${type}/${id} from Firebase:`, error)
    }

    // Firebase에서 찾지 못한 경우 로컬 데이터에서 찾기
    console.log(`Component ${type}/${id} not found in Firebase, using local data`)
    const localComponent = componentOptions[type]?.find((c) => c.id === id)
    if (localComponent) {
      return localComponent as FirebaseComponentData
    }

    return null
  } catch (error) {
    console.error(`Error in fetchComponentById for ${type}/${id}:`, error)

    // 오류 발생 시 로컬 데이터에서 찾기
    const localComponent = componentOptions[type]?.find((c) => c.id === id)
    if (localComponent) {
      return localComponent as FirebaseComponentData
    }

    return null
  }
}

// 카테고리별 컴포넌트 가져오기
export async function fetchComponentsByCategory(category: string): Promise<FirebaseComponentData[]> {
  try {
    console.log(`Fetching components for category ${category}...`)

    // Firebase 연결 확인
    const isConnected = await checkFirebaseConnection()
    if (!isConnected) {
      console.warn("Firebase connection failed, using local data")
      return componentOptions[category] || []
    }

    try {
      const componentsCollection = collection(db, `components/${category}/items`)
      const componentsQuery = query(componentsCollection)
      const snapshot = await getDocs(componentsQuery)

      if (!snapshot.empty) {
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          price: Number(doc.data().price || 0),
        })) as FirebaseComponentData[]
        console.log(`Fetched ${result.length} components for category ${category}`)
        return result
      }
    } catch (error) {
      console.error(`Error fetching components for category ${category} from Firebase:`, error)
    }

    // Firebase에 데이터가 없으면 로컬 데이터 사용
    console.log(`No Firebase data for category ${category}, using local data`)
    return componentOptions[category] || []
  } catch (error) {
    console.error(`Error in fetchComponentsByCategory for ${category}:`, error)
    // 오류 발생 시 로컬 데이터 반환
    return componentOptions[category] || []
  }
}

