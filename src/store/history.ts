import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HistoryItem {
  id: string;
  question: string;
  answer?: string;
  mode?: "general" | "gene";
  timestamp: number;
}

interface HistoryStore {
  items: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  update: (id: string, data: any) => void;
}

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set) => ({
      items: [],
      addHistory: (item: HistoryItem) =>
        set((state) => ({
          items: [...state.items, item],
        })),
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
