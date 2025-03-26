// /scripts/initialize-component.ts
import { db } from '../lib/firebase';
import { collection, setDoc, doc } from 'firebase/firestore';

const componentData = [
  {
    id: '1',
    name: 'Intel Core i9-13900K',
    type: 'CPU',
    price: 650,
    stock: 10,
    description: '13th Gen Intel Core i9 Processor'
  },
  {
    id: '2',
    name: 'NVIDIA GeForce RTX 4090',
    type: 'GPU',
    price: 1600,
    stock: 5,
    description: 'High-end gaming GPU with ray tracing support'
  },
  {
    id: '3',
    name: 'Samsung 980 Pro 1TB',
    type: 'Storage',
    price: 150,
    stock: 20,
    description: '1TB NVMe SSD with high read/write speeds'
  },
  {
    id: '4',
    name: 'Corsair Vengeance LPX 32GB',
    type: 'RAM',
    price: 120,
    stock: 15,
    description: 'High-performance DDR4 memory'
  }
];

const initializeComponents = async () => {
  try {
    for (const component of componentData) {
      await setDoc(doc(collection(db, 'components'), component.id), component);
      console.log(`Uploaded ${component.name}`);
    }
    console.log('All components uploaded successfully!');
  } catch (error) {
    console.error('Error uploading components:', error);
  }
};

initializeComponents();
