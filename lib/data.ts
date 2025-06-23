// /lib/data.ts
import { db } from './firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface ComponentData {
  id?: string;
  name: string;
  type: string;
  price: number;

  description: string;
  image: string;
}

export interface QuoteItem {
  category: string;
  name: string;
  price: number;
  quantity: number;
}

export interface QuoteData {
  id: string;
  createdAt: Date;
  items: QuoteItem[];
}

export interface UserData {
  id: string;
  email: string;
  password: string;
}

/**
 * ✅ 부품 정보 저장 함수
 */
export const saveComponent = async (component: ComponentData) => {
    try {
      const componentRef = doc(collection(db, 'components'), component.id);
      await setDoc(componentRef, component);
      console.log(`✅ Component saved: ${component.name}`);
    } catch (error) {
      console.error('❌ Error saving component:', error);
    }
  };

/**
 * ✅ 견적 정보 저장 함수
 */
export const saveQuote = async (quote: QuoteData) => {
  try {
    const quoteRef = doc(collection(db, 'quotes'), quote.id);
    await setDoc(quoteRef, quote);
    console.log(`✅ Quote saved: ${quote.id}`);
  } catch (error) {
    console.error('❌ Error saving quote:', error);
  }
};

/**
 * ✅ 사용자 정보 저장 함수
 */
export const saveUser = async (user: UserData) => {
  try {
    const userRef = doc(collection(db, 'users'), user.id);
    await setDoc(userRef, user);
    console.log(`✅ User saved: ${user.email}`);
  } catch (error) {
    console.error('❌ Error saving user:', error);
  }
};
/**
 * ✅ 부품 정보 읽기 함수
 */
export const getComponents = async (): Promise<ComponentData[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'components'));
      const components: ComponentData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as ComponentData[];
      return components;
    } catch (error) {
      console.error('❌ Error getting components:', error);
      return [];
    }
  };
  
  
  /**
   * ✅ 견적 정보 읽기 함수
   */
  export const getQuotes = async (): Promise<QuoteData[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'quotes'));
      const quotes: QuoteData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as QuoteData[];
      return quotes;
    } catch (error) {
      console.error('❌ Error getting quotes:', error);
      return [];
    }
  };
  
  /**
   * ✅ 사용자 정보 읽기 함수
   */
  export const getUsers = async (): Promise<UserData[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users: UserData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      return users;
    } catch (error) {
      console.error('❌ Error getting users:', error);
      return [];
    }
  };
 /**
 * ✅ 부품 수정 함수
 */
export const updateComponent = async (id: string, data: Partial<ComponentData>) => {
    try {
      await updateDoc(doc(db, 'components', id), data);
      console.log('✅ Component updated');
    } catch (error) {
      console.error('❌ Error updating component:', error);
    }
  };
  
 /**
 * ✅ 부품 삭제 함수
 */
export const deleteComponent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'components', id));
      console.log('✅ Component deleted');
    } catch (error) {
      console.error('❌ Error deleting component:', error);
    }
  };
