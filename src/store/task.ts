import { create } from "zustand";

interface Resource {
  id: string;
  name: string;
  type: string;
}

interface TaskStore {
  id: string;
  question: string;
  questions: string;
  resources: Resource[];
  setQuestion: (question: string) => void;
  removeResource: (id: string) => void;
  reset: () => void;
  backup: () => any;
}

const initialState = {
  id: "",
  question: "",
  questions: "",
  resources: [],
};

export const useTaskStore = create<TaskStore>((set, get) => ({
  ...initialState,

  setQuestion: (question: string) => set({ question, id: Date.now().toString() }),

  removeResource: (id: string) =>
    set((state) => ({
      resources: state.resources.filter((r) => r.id !== id),
    })),

  reset: () => set(initialState),

  backup: () => {
    const state = get();
    return {
      id: state.id,
      question: state.question,
      questions: state.questions,
      resources: state.resources,
    };
  },
}));
