// 클라이언트 사이드에서 사용할 수 있는 Firebase Admin 대체 기능
import { db } from "./firebase"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore"

// 관리자 권한 확인 함수
export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      return userData.role === "admin"
    }
    return false
  } catch (error) {
    console.error("Admin 권한 확인 오류:", error)
    return false
  }
}

// 다른 필요한 관리자 기능들을 여기에 추가할 수 있습니다
export { db, collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc, serverTimestamp }

