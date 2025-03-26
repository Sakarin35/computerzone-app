// /lib/fetch-components.ts
import { db } from "./firebase"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import type { ComponentType } from "../app/data/components"

// Firebase에서 가져온 컴포넌트 데이터를 위한 인터페이스
export interface FirebaseComponentData {
  id: string
  name: string
  price: number
  image: string
  description: string
  type: string
}

// 모든 컴포넌트 데이터를 가져오는 함수
export async function fetchComponents(): Promise<Record<string, FirebaseComponentData[]>> {
  try {
    const result: Record<string, FirebaseComponentData[]> = {}

    // 컴포넌트 타입 목록 가져오기
    const metadataDoc = await getDoc(doc(db, "metadata", "componentOrder"))
    const componentTypes = metadataDoc.exists()
      ? metadataDoc.data().order
      : ["vga", "cpu", "mb", "memory", "ssd", "case", "cooler", "power"]

    // 각 타입별로 컴포넌트 가져오기
    for (const type of componentTypes) {
      const q = query(collection(db, "components"), where("type", "==", type))
      const querySnapshot = await getDocs(q)

      if (!result[type]) {
        result[type] = []
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<FirebaseComponentData, "id">
        result[type].push({
          id: doc.id,
          ...data,
        })
      })
    }

    return result
  } catch (error) {
    console.error("Error fetching components:", error)
    return {}
  }
}

// 특정 타입의 컴포넌트만 가져오는 함수
export async function fetchComponentsByType(type: ComponentType): Promise<FirebaseComponentData[]> {
  try {
    const q = query(collection(db, "components"), where("type", "==", type))
    const componentsSnapshot = await getDocs(q)

    const components: FirebaseComponentData[] = []
    componentsSnapshot.forEach((doc) => {
      const data = doc.data() as Omit<FirebaseComponentData, "id">
      components.push({
        id: doc.id,
        ...data,
      })
    })

    return components
  } catch (error) {
    console.error(`Error fetching ${type} components:`, error)
    return []
  }
}

// 컴포넌트 ID로 단일 컴포넌트 가져오기
export async function fetchComponentById(id: string): Promise<FirebaseComponentData | null> {
  try {
    const docRef = doc(db, "components", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<FirebaseComponentData, "id">
      return {
        id: docSnap.id,
        ...data,
      }
    }

    return null
  } catch (error) {
    console.error(`Error fetching component with ID ${id}:`, error)
    return null
  }
}

