export default function useAiProvider() {
  function hasApiKey(mode: string): boolean {
    // TODO: Implement API key check
    return true; // For now, return true
  }

  return {
    hasApiKey,
  };
}
