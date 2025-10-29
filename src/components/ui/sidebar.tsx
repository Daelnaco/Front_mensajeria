import { useState, useEffect } from 'react';
import { ScrollArea } from './scroll-area';
import { apiService } from '../../services/api.service';

interface SidebarItem {
  id: string;
  title: string;
}

export function Sidebar() {
  const [items, setItems] = useState<SidebarItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSidebarData = async () => {
      try {
        const data = await apiService.get('/sidebar-items');
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Error cargando datos');
        console.error(err);
      }
    };

    loadSidebarData();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4 space-y-2">
        {items.map((item) => (
          <div 
            key={item.id}
            className="p-3 rounded-lg bg-card hover:bg-accent cursor-pointer"
          >
            {item.title}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}