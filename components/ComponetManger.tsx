// /components/ComponentManger.tsx
import { useEffect, useState } from 'react';
import { getComponents, saveComponent } from '@/lib/data';

interface ComponentData {
  id?: string;
  name: string;
  type: string;
  price: number;
  description: string;
  image: string;
}

export default function ComponentManager() {
  const [components, setComponents] = useState<ComponentData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    setLoading(true);
    const data = await getComponents();
    setComponents(data);
    setLoading(false);
  };

  const handleAddComponent = async () => {
    await saveComponent({
      id: '4070',
      name: 'RTX 4070',
      type: 'vga',
      price: 800000,
      description: '고성능 그래픽 카드',
      image: '/images/RTX 4070.png'
    });
    fetchComponents(); // 상태 업데이트
  };

  return (
    <div>
      <h2>Component Manager</h2>
      {loading ? <p>Loading...</p> : null}
      <ul>
        {components.map((component) => (
          <li key={component.id}>
            {component.name} - {component.price}원
          </li>
        ))}
      </ul>
      <button onClick={handleAddComponent}>Add Component</button>
    </div>
  );
}
