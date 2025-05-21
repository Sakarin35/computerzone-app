import { db } from "./firebase"
import { collection, getDocs, doc, setDoc, writeBatch } from "firebase/firestore"

// Firebase 연결 및 데이터 구조 확인 함수
export async function checkFirebaseConnection() {
  console.log("Firebase 연결 확인 중...")

  try {
    // 기본 컬렉션 확인
    const collections = ["crawled_components", "components", "quotes", "users"]
    const results = {}

    for (const collectionName of collections) {
      try {
        const snapshot = await getDocs(collection(db, collectionName))
        console.log(`컬렉션 '${collectionName}' 확인: ${snapshot.size}개 문서 발견`)
        results[collectionName] = snapshot.size
      } catch (error) {
        console.error(`컬렉션 '${collectionName}' 접근 오류:`, error)
        results[collectionName] = `오류: ${error.message}`
      }
    }

    return {
      success: true,
      results,
    }
  } catch (error) {
    console.error("Firebase 연결 확인 실패:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Firebase 보안 규칙 확인 함수
export async function checkFirebaseRules() {
  console.log("Firebase 보안 규칙 확인 중...")

  try {
    // 간단한 읽기 작업으로 권한 확인
    const testSnapshot = await getDocs(collection(db, "crawled_components"))
    console.log(`crawled_components 컬렉션 접근 성공: ${testSnapshot.size}개 문서`)

    // 첫 번째 카테고리의 items 서브컬렉션 접근 시도
    if (!testSnapshot.empty) {
      const firstCategory = testSnapshot.docs[0].id
      const itemsSnapshot = await getDocs(collection(db, "crawled_components", firstCategory, "items"))
      console.log(`${firstCategory}/items 서브컬렉션 접근 성공: ${itemsSnapshot.size}개 문서`)
    }

    return true
  } catch (error) {
    console.error("Firebase 보안 규칙 확인 실패:", error)
    return false
  }
}

// 테스트 데이터 생성 함수 - 개선된 버전
export async function createTestData() {
  console.log("테스트 데이터 생성 중...")

  try {
    const batch = writeBatch(db)

    // 카테고리 생성
    const categories = ["vga", "cpu", "mb", "memory", "ssd", "case", "cooler", "power"]
    const createdDocs = []

    for (const category of categories) {
      // 카테고리 문서 생성 - 직접 문서 ID 지정
      const categoryDocRef = doc(db, "crawled_components", category)
      batch.set(categoryDocRef, {
        name: category,
        createdAt: new Date(),
      })
      createdDocs.push(`crawled_components/${category}`)

      // 각 카테고리에 3개의 테스트 아이템 추가
      for (let i = 1; i <= 3; i++) {
        const itemId = `test-${category}-${i}`
        const itemDocRef = doc(db, "crawled_components", category, "items", itemId)
        batch.set(itemDocRef, {
          id: itemId,
          name: `테스트 ${category.toUpperCase()} ${i}`,
          price: 100000 * i,
          image: "/placeholder.svg",
          description: `${category.toUpperCase()} 테스트 제품 ${i}입니다.`,
          specs: `${category.toUpperCase()} 테스트 스펙 ${i}`,
          category: category,
          url: "#",
          createdAt: new Date(),
        })
        createdDocs.push(`crawled_components/${category}/items/${itemId}`)
      }
    }

    // 배치 커밋
    await batch.commit()
    console.log("테스트 데이터 생성 완료:", createdDocs.length, "개의 문서 생성됨")

    return {
      success: true,
      message: `${createdDocs.length}개의 테스트 문서가 생성되었습니다.`,
      docs: createdDocs,
    }
  } catch (error) {
    console.error("테스트 데이터 생성 실패:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// 데이터 구조 확인 함수 - 개선된 버전
export async function checkDataStructure() {
  console.log("Firebase 데이터 구조 확인 중...")

  try {
    // crawled_components 컬렉션 확인
    const categoriesSnapshot = await getDocs(collection(db, "crawled_components"))

    if (categoriesSnapshot.empty) {
      console.log("crawled_components 컬렉션이 비어 있습니다.")
      return {
        success: false,
        message: "crawled_components 컬렉션이 비어 있습니다.",
      }
    }

    console.log(`crawled_components 컬렉션에 ${categoriesSnapshot.size}개의 카테고리가 있습니다.`)

    const categories = []

    // 각 카테고리 문서 확인
    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryId = categoryDoc.id
      console.log(`카테고리 '${categoryId}' 확인 중...`)

      // items 서브컬렉션 확인
      const itemsSnapshot = await getDocs(collection(db, "crawled_components", categoryId, "items"))
      console.log(`카테고리 '${categoryId}'에 ${itemsSnapshot.size}개의 아이템이 있습니다.`)

      const categoryInfo = {
        id: categoryId,
        itemCount: itemsSnapshot.size,
        items: [],
      }

      // 첫 번째 아이템의 구조 확인 (있는 경우)
      if (!itemsSnapshot.empty) {
        const firstItem = itemsSnapshot.docs[0].data()
        console.log(`첫 번째 아이템 구조:`, firstItem)
        categoryInfo.items.push({
          id: itemsSnapshot.docs[0].id,
          ...firstItem,
        })
      }

      categories.push(categoryInfo)
    }

    return {
      success: true,
      categories,
    }
  } catch (error) {
    console.error("데이터 구조 확인 실패:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// 직접 문서 생성 테스트 함수
export async function testDirectDocumentCreation() {
  try {
    console.log("직접 문서 생성 테스트 중...")

    // 테스트 카테고리 문서 생성
    const testCategoryRef = doc(db, "crawled_components", "test-category")
    await setDoc(testCategoryRef, {
      name: "테스트 카테고리",
      createdAt: new Date(),
    })

    // 테스트 아이템 문서 생성
    const testItemRef = doc(db, "crawled_components", "test-category", "items", "test-item")
    await setDoc(testItemRef, {
      id: "test-item",
      name: "테스트 아이템",
      price: 99999,
      image: "/placeholder.svg",
      description: "테스트 아이템입니다.",
      createdAt: new Date(),
    })

    console.log("직접 문서 생성 테스트 완료")
    return {
      success: true,
      message: "테스트 문서가 성공적으로 생성되었습니다.",
      paths: ["crawled_components/test-category", "crawled_components/test-category/items/test-item"],
    }
  } catch (error) {
    console.error("직접 문서 생성 테스트 실패:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}
