import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ResearchMode = "general" | "gene";

export interface SettingStore {
  // Research Mode
  researchMode: ResearchMode;
  setResearchMode: (mode: ResearchMode) => void;

  // API Keys
  openaiApiKey: string;
  openaiApiProxy: string;
  anthropicApiKey: string;
  anthropicApiProxy: string;
  googleApiKey: string;
  googleApiProxy: string;
  mistralApiKey: string;
  mistralApiProxy: string;
  siliconflowApiKey: string;
  siliconflowApiProxy: string;

  // Models
  openaiThinkingModel: string;
  openaiNetworkingModel: string;
  anthropicThinkingModel: string;
  anthropicNetworkingModel: string;
  googleThinkingModel: string;
  googleNetworkingModel: string;
  mistralThinkingModel: string;
  mistralNetworkingModel: string;
  siliconflowThinkingModel: string;
  siliconflowNetworkingModel: string;

  // Mode Selection
  mode: "openai" | "anthropic" | "google" | "mistral" | "siliconflow";

  // Search Provider
  searchProvider: "tavily" | "serper" | "searxng" | "exa";
  tavilyApiKey: string;
  serperApiKey: string;
  searxngBaseUrl: string;
  exaApiKey: string;

  // MCP Settings
  mcpEnabled: boolean;
  mcpConfig: string;

  // UI Settings
  language: string;
  theme: "system" | "dark" | "light";
  password: string;

  // Setters
  setOpenaiApiKey: (key: string) => void;
  setOpenaiApiProxy: (proxy: string) => void;
  setAnthropicApiKey: (key: string) => void;
  setAnthropicApiProxy: (proxy: string) => void;
  setGoogleApiKey: (key: string) => void;
  setGoogleApiProxy: (proxy: string) => void;
  setMistralApiKey: (key: string) => void;
  setMistralApiProxy: (proxy: string) => void;
  setSiliconflowApiKey: (key: string) => void;
  setSiliconflowApiProxy: (proxy: string) => void;

  setOpenaiThinkingModel: (model: string) => void;
  setOpenaiNetworkingModel: (model: string) => void;
  setAnthropicThinkingModel: (model: string) => void;
  setAnthropicNetworkingModel: (model: string) => void;
  setGoogleThinkingModel: (model: string) => void;
  setGoogleNetworkingModel: (model: string) => void;
  setMistralThinkingModel: (model: string) => void;
  setMistralNetworkingModel: (model: string) => void;
  setSiliconflowThinkingModel: (model: string) => void;
  setSiliconflowNetworkingModel: (model: string) => void;

  setMode: (
    mode: "openai" | "anthropic" | "google" | "mistral" | "siliconflow"
  ) => void;

  setSearchProvider: (
    provider: "tavily" | "serper" | "searxng" | "exa"
  ) => void;
  setTavilyApiKey: (key: string) => void;
  setSerperApiKey: (key: string) => void;
  setSearxngBaseUrl: (url: string) => void;
  setExaApiKey: (key: string) => void;

  setMcpEnabled: (enabled: boolean) => void;
  setMcpConfig: (config: string) => void;

  setLanguage: (language: string) => void;
  setTheme: (theme: "system" | "dark" | "light") => void;
  setPassword: (password: string) => void;
}

const defaultValues: Omit<
  SettingStore,
  | "setResearchMode"
  | "setOpenaiApiKey"
  | "setOpenaiApiProxy"
  | "setAnthropicApiKey"
  | "setAnthropicApiProxy"
  | "setGoogleApiKey"
  | "setGoogleApiProxy"
  | "setMistralApiKey"
  | "setMistralApiProxy"
  | "setSiliconflowApiKey"
  | "setSiliconflowApiProxy"
  | "setOpenaiThinkingModel"
  | "setOpenaiNetworkingModel"
  | "setAnthropicThinkingModel"
  | "setAnthropicNetworkingModel"
  | "setGoogleThinkingModel"
  | "setGoogleNetworkingModel"
  | "setMistralThinkingModel"
  | "setMistralNetworkingModel"
  | "setSiliconflowThinkingModel"
  | "setSiliconflowNetworkingModel"
  | "setMode"
  | "setSearchProvider"
  | "setTavilyApiKey"
  | "setSerperApiKey"
  | "setSearxngBaseUrl"
  | "setExaApiKey"
  | "setMcpEnabled"
  | "setMcpConfig"
  | "setLanguage"
  | "setTheme"
  | "setPassword"
> = {
  researchMode: "general",

  openaiApiKey: "",
  openaiApiProxy: "",
  anthropicApiKey: "",
  anthropicApiProxy: "",
  googleApiKey: "",
  googleApiProxy: "",
  mistralApiKey: "",
  mistralApiProxy: "",
  siliconflowApiKey: "",
  siliconflowApiProxy: "",

  openaiThinkingModel: "",
  openaiNetworkingModel: "",
  anthropicThinkingModel: "",
  anthropicNetworkingModel: "",
  googleThinkingModel: "",
  googleNetworkingModel: "",
  mistralThinkingModel: "",
  mistralNetworkingModel: "",
  siliconflowThinkingModel: "",
  siliconflowNetworkingModel: "",

  mode: "openai",

  searchProvider: "tavily",
  tavilyApiKey: "",
  serperApiKey: "",
  searxngBaseUrl: "",
  exaApiKey: "",

  mcpEnabled: false,
  mcpConfig: "",

  language: "en-US",
  theme: "system",
  password: "",
};

export const useSettingStore = create<SettingStore>()(
  persist(
    (set) => ({
      ...defaultValues,

      setResearchMode: (mode: ResearchMode) => set({ researchMode: mode }),

      setOpenaiApiKey: (key: string) => set({ openaiApiKey: key }),
      setOpenaiApiProxy: (proxy: string) => set({ openaiApiProxy: proxy }),
      setAnthropicApiKey: (key: string) => set({ anthropicApiKey: key }),
      setAnthropicApiProxy: (proxy: string) =>
        set({ anthropicApiProxy: proxy }),
      setGoogleApiKey: (key: string) => set({ googleApiKey: key }),
      setGoogleApiProxy: (proxy: string) => set({ googleApiProxy: proxy }),
      setMistralApiKey: (key: string) => set({ mistralApiKey: key }),
      setMistralApiProxy: (proxy: string) => set({ mistralApiProxy: proxy }),
      setSiliconflowApiKey: (key: string) => set({ siliconflowApiKey: key }),
      setSiliconflowApiProxy: (proxy: string) =>
        set({ siliconflowApiProxy: proxy }),

      setOpenaiThinkingModel: (model: string) =>
        set({ openaiThinkingModel: model }),
      setOpenaiNetworkingModel: (model: string) =>
        set({ openaiNetworkingModel: model }),
      setAnthropicThinkingModel: (model: string) =>
        set({ anthropicThinkingModel: model }),
      setAnthropicNetworkingModel: (model: string) =>
        set({ anthropicNetworkingModel: model }),
      setGoogleThinkingModel: (model: string) =>
        set({ googleThinkingModel: model }),
      setGoogleNetworkingModel: (model: string) =>
        set({ googleNetworkingModel: model }),
      setMistralThinkingModel: (model: string) =>
        set({ mistralThinkingModel: model }),
      setMistralNetworkingModel: (model: string) =>
        set({ mistralNetworkingModel: model }),
      setSiliconflowThinkingModel: (model: string) =>
        set({ siliconflowThinkingModel: model }),
      setSiliconflowNetworkingModel: (model: string) =>
        set({ siliconflowNetworkingModel: model }),

      setMode: (
        mode: "openai" | "anthropic" | "google" | "mistral" | "siliconflow"
      ) => set({ mode }),

      setSearchProvider: (
        provider: "tavily" | "serper" | "searxng" | "exa"
      ) => set({ searchProvider: provider }),
      setTavilyApiKey: (key: string) => set({ tavilyApiKey: key }),
      setSerperApiKey: (key: string) => set({ serperApiKey: key }),
      setSearxngBaseUrl: (url: string) => set({ searxngBaseUrl: url }),
      setExaApiKey: (key: string) => set({ exaApiKey: key }),

      setMcpEnabled: (enabled: boolean) => set({ mcpEnabled: enabled }),
      setMcpConfig: (config: string) => set({ mcpConfig: config }),

      setLanguage: (language: string) => set({ language }),
      setTheme: (theme: "system" | "dark" | "light") => set({ theme }),
      setPassword: (password: string) => set({ password }),
    }),
    {
      name: "setting-storage",
    }
  )
);
