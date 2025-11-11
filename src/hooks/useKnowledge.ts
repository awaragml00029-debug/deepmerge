export default function useKnowledge() {
  async function getKnowledgeFromFile(file: File) {
    // TODO: Implement file processing logic
    console.log("Processing file:", file.name);
  }

  return {
    getKnowledgeFromFile,
  };
}
