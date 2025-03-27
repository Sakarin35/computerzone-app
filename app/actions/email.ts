"use server"

import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function sendEmailWithQuote(
  email: string,
  imageUrl: string,
  quoteName: string,
  totalPrice: number,
  items: any[],
) {
  try {
    // 이메일 전송 기록을 Firestore에 저장
    await addDoc(collection(db, "emails"), {
      to: email,
      imageUrl,
      quoteName,
      totalPrice,
      items,
      sentAt: serverTimestamp(),
      status: "pending",
    })

    // 실제 프로덕션에서는 여기에 이메일 전송 서비스(SendGrid, Nodemailer 등)를 연동해야 합니다.
    // 현재는 시뮬레이션만 수행합니다.

    return { success: true, message: `이메일이 ${email}로 전송되었습니다.` }
  } catch (error) {
    console.error("이메일 전송 오류:", error)
    return { success: false, error: "이메일 전송에 실패했습니다." }
  }
}

