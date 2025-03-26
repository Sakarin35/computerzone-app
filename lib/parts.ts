// /lib/parts.ts
import { db } from './firebase';
import {
  collection,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';

// ✅ 컴포넌트 데이터 타입 정의
export interface ComponentData {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  description: string;
}

// ✅ 부품 추가 함수 (setDoc 사용)
export const addComponent = async (data: ComponentData) => {
  // 유효성 검사 추가
  if (
    !data.id || // ID는 필수값으로 설정
    !data.name ||
    !data.type ||
    !data.price ||
    !data.image ||
    !data.description
  ) {
    console.error('Invalid component data:', data);
    throw new Error('Invalid component data');
  }

  try {
    // 🔥 특정 ID를 기반으로 덮어쓰기 → setDoc 사용
    const componentRef = doc(db, 'components', data.id);
    await setDoc(componentRef, data); // ID 기반 덮어쓰기 수행
    console.log('Component saved with ID:', data.id);
  } catch (error) {
    console.error('Error adding component:', error);
  }
};

// ✅ 부품 읽기 함수
export const getComponents = async (): Promise<ComponentData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'components'));
    const components: ComponentData[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // undefined 필드를 기본 값으로 설정
      return {
        id: doc.id,
        name: data.name || '',
        type: data.type || '',
        price: data.price || 0,
        image: data.image || '',
        description: data.description || '',
      };
    });
    return components;
  } catch (error) {
    console.error('Error getting documents:', error);
    return [];
  }
};

// ✅ 부품 수정 함수
export const updateComponent = async (
  id: string,
  data: Partial<ComponentData>
) => {
  if (!id) {
    console.error('Invalid ID');
    return;
  }

  try {
    const componentRef = doc(db, 'components', id);
    await updateDoc(componentRef, data);
    console.log('Component updated');
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

// ✅ 부품 삭제 함수
export const deleteComponent = async (id: string) => {
  if (!id) {
    console.error('Invalid ID');
    return;
  }

  try {
    await deleteDoc(doc(db, 'components', id));
    console.log('Component deleted');
  } catch (error) {
    console.error('Error deleting document:', error);
  }
};
