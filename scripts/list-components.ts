// scripts/list-components.ts
// 경로를 절대 경로로 지정하여 dotenv 설정
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { componentOrder } from '../app/data/components';

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const listComponents = async () => {
  console.log('Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error('Firebase Project ID is missing! Check your .env.local file.');
    process.exit(1);
  }

  try {
    console.log('Fetching components from Firebase...\n');
    
    // 모든 컴포넌트 타입에 대해 반복
    for (const type of componentOrder) {
      console.log(`\n=== ${type.toUpperCase()} 컴포넌트 ===`);
      
      // 해당 타입의 컴포넌트 컬렉션 가져오기
      const q = query(collection(db, 'components'), where('type', '==', type));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log(`  No ${type} components found.`);
        continue;
      }
      
      // 각 컴포넌트 정보 출력
      querySnapshot.forEach(doc => {
        const component = doc.data();
        console.log(`  - ID: ${component.id}`);
        console.log(`    Name: ${component.name}`);
        console.log(`    Price: ${component.price.toLocaleString()}원`);
        console.log(`    Image: ${component.image}`);
        console.log('    ---');
      });
    }

    console.log('\nComponent listing complete.');
  } catch (error) {
    console.error('Error listing components:', error);
  }
};

listComponents();