import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Contact } from '@/src/types';

const KEY = 'contacts_search_history_v1';
const MAX_ITEMS = 12;

type Api = {
  items: Contact[];
  load: () => Promise<void>;
  add: (c: Contact) => Promise<void>;
  clear: () => Promise<void>;
};

function useSearchHistory(): Api {
  const [items, setItems] = useState<Contact[]>([]);
console.log('items', items);
  const load = async (): Promise<void> => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (!raw) {
        setItems([]);
        return;
      }
      const parsed = JSON.parse(raw) as Contact[];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  };

  const persist = async (next: Contact[]): Promise<void> => {
    setItems(next);
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const add = async (c: Contact): Promise<void> => {
    const normalize = (x: Contact) => ({
      id: x.id,
      name: x.name,
      email: x.email,
      avatar: x.avatar,
      isFavorite: !!x.isFavorite,
    });

    const next = [normalize(c), ...items.filter(x => x.id !== c.id)].slice(0, MAX_ITEMS);
    await persist(next);
  };

  const clear = async (): Promise<void> => {
    await persist([]);
    try {
      await AsyncStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  };

  return { items, load, add, clear };
}

export default useSearchHistory;
