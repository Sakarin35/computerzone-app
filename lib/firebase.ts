// /lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Firebase 설정 로깅 추가 (디버깅용)
console.log("Firebase Config:", {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "exists" : "missing",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "exists" : "missing",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "exists" : "missing",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "exists" : "missing",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "exists" : "missing",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "exists" : "missing",
})

// 실제 Firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// 초기화 후 Firebase 연결 상태 확인
console.log("Firebase 초기화 완료:", {
  app: app ? "성공" : "실패",
  auth: auth ? "성공" : "실패",
  db: db ? "성공" : "실패",
  storage: storage ? "성공" : "실패",
  projectId: app.options.projectId || "알 수 없음",
})

export { app, auth, db, storage }
export const googleProvider = new GoogleAuthProvider()
