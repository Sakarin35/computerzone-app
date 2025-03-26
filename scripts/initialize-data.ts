// /scripts/initialize-data.ts

// 경로를 절대 경로로 지정하여 dotenv 설정
const path = require("path")
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.local") })

import { initializeApp, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { componentOptions, componentOrder } from "../app/data/components"

// Firebase Admin 초기화
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
}

// Firebase Admin SDK 초기화
if (!initializeApp.length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  })
}

const db = getFirestore()

const init = async () => {
  console.log("Firebase Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)

  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error("Firebase Project ID is missing! Check your .env.local file.")
    process.exit(1)
  }

  try {
    console.log("Starting component data upload...")

    // 모든 컴포넌트 타입에 대해 반복
    for (const type of componentOrder) {
      console.log(`Uploading ${type} components...`)

      // 각 타입의 모든 컴포넌트에 대해 반복
      for (const component of componentOptions[type]) {
        // 컴포넌트 데이터 생성
        const componentData = {
          id: component.id,
          name: component.name,
          type: type,
          price: component.price,
          description: component.description,
          image: component.image,
        }

        // Firestore에 저장
        await db.collection("components").doc(component.id).set(componentData)
        console.log(`  - Saved ${component.name}`)
      }
    }

    // 컴포넌트 타입 순서 저장
    await db.collection("metadata").doc("componentOrder").set({
      order: componentOrder,
    })

    // 컴포넌트 이름 매핑 저장
    const { componentNames } = await import("../app/data/components")
    await db.collection("metadata").doc("componentNames").set(componentNames)

    console.log("Data initialization complete.")
  } catch (error) {
    console.error("Error initializing data:", error)
  }
}

init()

