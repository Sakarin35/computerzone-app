import { NextResponse } from "next/server"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Firebase Admin 초기화
if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  })
}

const db = getFirestore()

export async function POST(request: Request) {
  try {
    const { email, imageUrl, quoteName, totalPrice, items } = await request.json()

    if (!email || !imageUrl) {
      return NextResponse.json({ error: "이메일과 이미지 URL이 필요합니다." }, { status: 400 })
    }

    // 이메일 전송 기록을 Firestore에 저장
    await db.collection("emails").add({
      to: email,
      imageUrl,
      quoteName,
      totalPrice,
      items,
      sentAt: new Date(),
      status: "pending",
    })

    // 실제 프로덕션에서는 여기에 이메일 전송 서비스(SendGrid, Nodemailer 등)를 연동해야 합니다.
    // 현재는 시뮬레이션만 수행합니다.

    return NextResponse.json({ success: true, message: `이메일이 ${email}로 전송되었습니다.` })
  } catch (error) {
    console.error("이메일 전송 오류:", error)
    return NextResponse.json({ error: "이메일 전송에 실패했습니다." }, { status: 500 })
  }
}

