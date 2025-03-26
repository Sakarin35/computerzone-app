// /scripts/initialize-firebase.ts
const { doc, setDoc } = require("firebase/firestore");
const { adminDb } = require("./firebase-admin");
const { componentOrder, componentNames } = require("../app/data/components");

async function initializeFirestore() {
  try {
    // metadata 컬렉션의 componentOrder 문서 생성
    await setDoc(doc(adminDb, "metadata", "componentOrder"), {
      order: Array.from(componentOrder) // readonly 배열을 일반 배열로 변환
    });

    // metadata 컬렉션의 componentNames 문서 생성
    await setDoc(doc(adminDb, "metadata", "componentNames"), {
      ...componentNames // readonly 객체를 일반 객체로 변환
    });

    // components 컬렉션의 각 컴포넌트 타입별 빈 문서 생성
    for (const type of componentOrder) {
      await setDoc(doc(adminDb, "components", type), {
        items: []
      });
    }

    console.log("Firebase 초기 설정이 완료되었습니다!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Firebase 초기 설정 중 오류 발생:", error.message);
      console.error(error.stack);
    } else {
      console.error("알 수 없는 오류 발생:", error);
    }
  }
}

initializeFirestore();

