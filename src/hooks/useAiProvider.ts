import { useSettingStore } from "@/store/setting";

export default function useAiProvider() {
  function hasApiKey(mode: string): boolean {
    const {
      openaiApiKey,
      anthropicApiKey,
      googleApiKey,
      siliconflowApiKey,
    } = useSettingStore.getState();

    switch (mode) {
      case "openai":
        return !!openaiApiKey && openaiApiKey.trim().length > 0;
      case "anthropic":
        return !!anthropicApiKey && anthropicApiKey.trim().length > 0;
      case "google":
        return !!googleApiKey && googleApiKey.trim().length > 0;
      case "siliconflow":
        return !!siliconflowApiKey && siliconflowApiKey.trim().length > 0;
      default:
        return false;
    }
  }

  return {
    hasApiKey,
  };
}
