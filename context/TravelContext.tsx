import { createContext, ReactNode, useCallback, useState } from 'react';
import * as travelService from '@/service/travelService';
import { TravelEntry } from '@/types';

interface TravelContextType {
  entries: TravelEntry[];
  loading: boolean;
  error: string | null;
  loadEntries: (userId: string) => Promise<void>;
  addEntry: (entry: Omit<TravelEntry, 'id'>) => Promise<void>;
  editEntry: (id: string, entry: Partial<TravelEntry>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
}

export const TravelContext = createContext<TravelContextType>({
  entries: [],
  loading: false,
  error: null,
  loadEntries: async () => {},
  addEntry: async () => {},
  editEntry: async () => {},
  removeEntry: async () => {},
});

export const TravelProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await travelService.fetchEntries(userId);
      setEntries(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEntry = async (entry: Omit<TravelEntry, 'id'>) => {
    await travelService.createEntry(entry);
    await loadEntries(entry.userId);
  };

  const editEntry = async (id: string, entry: Partial<TravelEntry>) => {
    await travelService.updateEntry(id, entry);
    if (entry.userId) await loadEntries(entry.userId);
  };

  const removeEntry = async (id: string) => {
    await travelService.deleteEntry(id);
  };

  return (
    <TravelContext.Provider value={{ entries, loading, error, loadEntries, addEntry, editEntry, removeEntry }}>
      {children}
    </TravelContext.Provider>
  );
};