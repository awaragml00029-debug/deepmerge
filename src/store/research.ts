import { create } from "zustand";
import { SearchResult } from "@/lib/search-providers";

export interface ResearchStep {
  id: string;
  type: "search" | "analysis" | "synthesis" | "report";
  status: "pending" | "running" | "completed" | "error";
  title: string;
  description: string;
  result?: string;
  error?: string;
  timestamp: number;
}

export interface ResearchResult {
  id: string;
  question: string;
  mode: "general" | "gene";
  steps: ResearchStep[];
  finalReport: string;
  sources: SearchResult[];
  startTime: number;
  endTime?: number;
  status: "running" | "completed" | "error";
}

interface ResearchStore {
  currentResearch: ResearchResult | null;
  isResearching: boolean;

  // Actions
  startResearch: (question: string, mode: "general" | "gene") => void;
  addStep: (step: Omit<ResearchStep, "id" | "timestamp">) => void;
  updateStep: (id: string, updates: Partial<ResearchStep>) => void;
  completeResearch: (finalReport: string) => void;
  failResearch: (error: string) => void;
  addSources: (sources: SearchResult[]) => void;
  reset: () => void;
}

const initialState = {
  currentResearch: null,
  isResearching: false,
};

export const useResearchStore = create<ResearchStore>((set, get) => ({
  ...initialState,

  startResearch: (question: string, mode: "general" | "gene") => {
    set({
      isResearching: true,
      currentResearch: {
        id: Date.now().toString(),
        question,
        mode,
        steps: [],
        finalReport: "",
        sources: [],
        startTime: Date.now(),
        status: "running",
      },
    });
  },

  addStep: (step) => {
    const state = get();
    if (!state.currentResearch) return;

    const newStep: ResearchStep = {
      ...step,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    set({
      currentResearch: {
        ...state.currentResearch,
        steps: [...state.currentResearch.steps, newStep],
      },
    });
  },

  updateStep: (id, updates) => {
    const state = get();
    if (!state.currentResearch) return;

    set({
      currentResearch: {
        ...state.currentResearch,
        steps: state.currentResearch.steps.map((step) =>
          step.id === id ? { ...step, ...updates } : step
        ),
      },
    });
  },

  completeResearch: (finalReport) => {
    const state = get();
    if (!state.currentResearch) return;

    set({
      isResearching: false,
      currentResearch: {
        ...state.currentResearch,
        finalReport,
        endTime: Date.now(),
        status: "completed",
      },
    });
  },

  failResearch: (error) => {
    const state = get();
    if (!state.currentResearch) return;

    set({
      isResearching: false,
      currentResearch: {
        ...state.currentResearch,
        endTime: Date.now(),
        status: "error",
      },
    });

    // Add error step
    get().addStep({
      type: "report",
      status: "error",
      title: "Research Failed",
      description: error,
      error,
    });
  },

  addSources: (sources) => {
    const state = get();
    if (!state.currentResearch) return;

    set({
      currentResearch: {
        ...state.currentResearch,
        sources: [...state.currentResearch.sources, ...sources],
      },
    });
  },

  reset: () => set(initialState),
}));
