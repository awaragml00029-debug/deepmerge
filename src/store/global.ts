import { create } from "zustand";

interface GlobalStore {
  openKnowledge: boolean;
  setOpenKnowledge: (open: boolean) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  openKnowledge: false,
  setOpenKnowledge: (open: boolean) => set({ openKnowledge: open }),
}));
