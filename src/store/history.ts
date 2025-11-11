import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HistoryItem {
  id: string;
  question: string;
  timestamp: number;
}

interface HistoryStore {
  items: HistoryItem[];
  update: (id: string, data: any) => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      items: [],
      update: (id: string, data: any) =>
        set((state) => ({
          items: [...state.items, { id, ...data, timestamp: Date.now() }],
        })),
    }),
    {
      name: "history-storage",
    }
  )
);
