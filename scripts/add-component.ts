// /scripts/add-component.ts
import { db } from "../lib/firebase"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"

async function addComponent(type: string, id: string, name: string, price: number, image: string, description: string) {
  try {
    const componentRef = doc(db, "components", type)
    await updateDoc(componentRef, {
      items: arrayUnion({
        id,
        name,
        price,
        image,
        description,
      }),
    })
    console.log(`Successfully added ${name} to ${type}`)
  } catch (error) {
    console.error("Error adding component:", error)
  }
}

/* 사용 예시
addComponent(
  "vga",
  "rtx-4090",
  "NVIDIA RTX 4090",
  2000000,
  "/images/rtx-4090.png",
  "NVIDIA의 최신 플래그십 그래픽 카드로, 최고의 게임 성능을 제공합니다.",
)*/

