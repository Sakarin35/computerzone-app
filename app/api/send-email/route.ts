// 이메일 전송 시 사용자 이름 처리 부분 수정
import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { email, imageUrl, quoteName, totalPrice, items, userName } = await request.json()

    if (!email || !imageUrl) {
      return NextResponse.json({ error: "이메일과 이미지 URL이 필요합니다." }, { status: 400 })
    }

    // Gmail SMTP 설정
    // 참고: Gmail을 사용하려면 "앱 비밀번호"를 생성해야 합니다
    // https://myaccount.google.com/apppasswords
    const transporter = nodemailer.createTransport({
      service: "gmail", // Gmail 사용
      auth: {
        user: process.env.EMAIL_USER, // Gmail 계정
        pass: process.env.EMAIL_PASSWORD, // Gmail 앱 비밀번호
      },
    })

    // 이메일 내용 구성
    const itemsList = items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${item.category}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.price.toLocaleString()}원</td>
          </tr>`,
      )
      .join("")

    // Base64 이미지 데이터를 이메일에 첨부
    // imageUrl이 "data:image/png;base64,..." 형식인지 확인
    const attachments = []

    if (imageUrl.startsWith("data:image/")) {
      // Base64 데이터에서 헤더 제거
      const base64Data = imageUrl.split(";base64,").pop()

      attachments.push({
        filename: `${quoteName || "PC견적서"}.png`,
        content: base64Data,
        encoding: "base64",
      })
    }

    // 이메일 전송 시 사용자 이름 처리 부분 수정 - "님" 추가
    // 사용자 이름 처리
    const displayName = userName || `${email.split("@")[0]} 님` || "고객님"

    // 이메일 전송
    const info = await transporter.sendMail({
      from: `"PC 견적 서비스" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `[PC 견적] ${quoteName} 견적서`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
          <h1 style="color: #333;">${quoteName}</h1>
          <p>안녕하세요 ${displayName}님, 요청하신 PC 견적서를 보내드립니다.</p>
          
          <p>견적서 이미지는 첨부파일로 보내드립니다.</p>
          
          <h2 style="color: #333;">견적 상세 내역</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">분류</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">상품명</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">수량</th>
                <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">가격</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
              <tr style="font-weight: bold; background-color: #f9f9f9;">
                <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right;">총 예상금액</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${totalPrice.toLocaleString()}원</td>
              </tr>
            </tbody>
          </table>
          
          <p>감사합니다.</p>
          <p style="color: #777; font-size: 12px;">본 이메일은 자동으로 발송되었습니다.</p>
        </div>
      `,
      attachments: attachments,
    })

    return NextResponse.json({
      success: true,
      message: `이메일이 ${email}로 전송되었습니다.`,
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("이메일 전송 오류:", error)
    return NextResponse.json(
      {
        error: "이메일 전송에 실패했습니다.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

