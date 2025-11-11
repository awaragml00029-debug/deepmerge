import { useSettingStore } from "@/store/setting";
import { useResearchStore } from "@/store/research";
import { useHistoryStore } from "@/store/history";
import { callAIProvider, getDefaultModel, AIMessage } from "@/lib/ai-providers";
import { callSearchProvider, SearchResult } from "@/lib/search-providers";

export interface ResearchConfig {
  question: string;
  mode: "general" | "gene";
  resources?: any[];
  geneConfig?: {
    geneSymbol: string;
    organism: string;
    researchFocus: string[];
    specificAspects: string[];
    diseaseContext?: string;
    experimentalApproach?: string;
    userPrompt?: string;
  };
}

export default function useDeepResearch() {
  const {
    mode: aiProvider,
    openaiApiKey,
    anthropicApiKey,
    googleApiKey,
    siliconflowApiKey,
    searchProvider,
    tavilyApiKey,
    serperApiKey,
    exaApiKey,
  } = useSettingStore();

  const {
    startResearch,
    addStep,
    updateStep,
    completeResearch,
    failResearch,
    addSources,
  } = useResearchStore();

  const { addHistory } = useHistoryStore();

  /**
   * Get API key for current AI provider
   */
  function getApiKey(): string {
    const keys: Record<string, string> = {
      openai: openaiApiKey,
      anthropic: anthropicApiKey,
      google: googleApiKey,
      siliconflow: siliconflowApiKey,
    };
    return keys[aiProvider] || "";
  }

  /**
   * Get API key for current search provider
   */
  function getSearchApiKey(): string {
    const keys: Record<string, string> = {
      tavily: tavilyApiKey,
      serper: serperApiKey,
      exa: exaApiKey,
    };
    return keys[searchProvider] || "";
  }

  /**
   * Generate search queries based on the research question
   */
  async function generateSearchQueries(question: string, mode: "general" | "gene"): Promise<string[]> {
    const stepId = Date.now().toString();
    addStep({
      type: "analysis",
      status: "running",
      title: "Generating Search Queries",
      description: "Analyzing the question to create targeted search queries...",
    });

    try {
      const systemPrompt =
        mode === "gene"
          ? "You are a bioinformatics research assistant. Generate 3-5 specific search queries to research a gene."
          : "You are a research assistant. Generate 3-5 diverse search queries to thoroughly research a topic.";

      const userPrompt = `Question: ${question}\n\nGenerate 3-5 search queries (one per line) that will help research this comprehensively.`;

      const response = await callAIProvider(
        {
          provider: aiProvider as any,
          apiKey: getApiKey(),
          model: getDefaultModel(aiProvider),
        },
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ]
      );

      const queries = response.content
        .split("\n")
        .filter((q) => q.trim())
        .map((q) => q.replace(/^\d+\.\s*/, "").trim())
        .filter((q) => q.length > 0)
        .slice(0, 5);

      updateStep(stepId, {
        status: "completed",
        result: queries.join("\n"),
      });

      return queries;
    } catch (error: any) {
      updateStep(stepId, {
        status: "error",
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Perform web search using generated queries
   */
  async function performSearch(queries: string[]): Promise<SearchResult[]> {
    const stepId = Date.now().toString();
    addStep({
      type: "search",
      status: "running",
      title: "Searching the Web",
      description: `Performing ${queries.length} searches to gather information...`,
    });

    try {
      const searchApiKey = getSearchApiKey();
      if (!searchApiKey) {
        throw new Error("Search API key not configured");
      }

      const allResults: SearchResult[] = [];
      const seenUrls = new Set<string>();

      for (const query of queries) {
        try {
          const response = await callSearchProvider(
            {
              provider: searchProvider as any,
              apiKey: searchApiKey,
            },
            query
          );

          for (const result of response.results) {
            if (!seenUrls.has(result.url)) {
              seenUrls.add(result.url);
              allResults.push(result);
            }
          }
        } catch (error) {
          console.error(`Search failed for query "${query}":`, error);
        }
      }

      updateStep(stepId, {
        status: "completed",
        result: `Found ${allResults.length} unique sources`,
      });

      addSources(allResults);
      return allResults;
    } catch (error: any) {
      updateStep(stepId, {
        status: "error",
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Analyze search results
   */
  async function analyzeResults(
    question: string,
    results: SearchResult[],
    mode: "general" | "gene"
  ): Promise<string> {
    const stepId = Date.now().toString();
    addStep({
      type: "analysis",
      status: "running",
      title: "Analyzing Information",
      description: `Processing ${results.length} sources to extract key insights...`,
    });

    try {
      const context = results
        .slice(0, 20)
        .map((r, i) => `[${i + 1}] ${r.title}\n${r.snippet}\nSource: ${r.url}`)
        .join("\n\n");

      const systemPrompt =
        mode === "gene"
          ? "You are an expert bioinformatics researcher. Analyze scientific sources about genes and provide accurate, detailed insights."
          : "You are an expert researcher. Analyze sources and extract key insights, trends, and important information.";

      const userPrompt = `Research Question: ${question}\n\nSources:\n${context}\n\nAnalyze these sources and provide:\n1. Key findings and insights\n2. Important patterns or themes\n3. Contradictions or controversies\n4. Gaps in information\n\nBe thorough and cite sources using [number] notation.`;

      const response = await callAIProvider(
        {
          provider: aiProvider as any,
          apiKey: getApiKey(),
          model: getDefaultModel(aiProvider),
        },
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ]
      );

      updateStep(stepId, {
        status: "completed",
        result: response.content.substring(0, 200) + "...",
      });

      return response.content;
    } catch (error: any) {
      updateStep(stepId, {
        status: "error",
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Generate final research report
   */
  async function generateReport(
    question: string,
    analysis: string,
    mode: "general" | "gene"
  ): Promise<string> {
    const stepId = Date.now().toString();
    addStep({
      type: "report",
      status: "running",
      title: "Generating Research Report",
      description: "Synthesizing all information into a comprehensive report...",
    });

    try {
      const systemPrompt =
        mode === "gene"
          ? "You are an expert bioinformatics researcher. Write comprehensive, scientifically accurate research reports about genes."
          : "You are an expert research writer. Create well-structured, comprehensive research reports.";

      const userPrompt = `Research Question: ${question}\n\nAnalysis:\n${analysis}\n\nWrite a comprehensive research report in Markdown format with:\n\n1. **Executive Summary** - Brief overview of key findings\n2. **Introduction** - Background and context\n3. **Key Findings** - Detailed analysis organized by themes\n4. **Implications** - What this means and why it matters\n5. **Conclusion** - Summary and future directions\n6. **References** - Cite sources using [number] notation\n\nUse clear headers, bullet points, and formatting. Be thorough but concise.`;

      const response = await callAIProvider(
        {
          provider: aiProvider as any,
          apiKey: getApiKey(),
          model: getDefaultModel(aiProvider),
        },
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ]
      );

      updateStep(stepId, {
        status: "completed",
        result: "Report generated successfully",
      });

      return response.content;
    } catch (error: any) {
      updateStep(stepId, {
        status: "error",
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Main research function
   */
  async function askQuestions(config: ResearchConfig) {
    const { question, mode, geneConfig } = config;

    // Validate API keys
    if (!getApiKey()) {
      throw new Error("AI API key not configured");
    }
    if (!getSearchApiKey()) {
      throw new Error("Search API key not configured");
    }

    try {
      // Start research
      startResearch(question, mode);

      // Enhance question for gene mode
      let enhancedQuestion = question;
      if (mode === "gene" && geneConfig) {
        enhancedQuestion = geneConfig.userPrompt
          ? geneConfig.userPrompt
              .replace("{geneSymbol}", geneConfig.geneSymbol)
              .replace("{organism}", geneConfig.organism)
          : `Research the ${geneConfig.geneSymbol} gene in ${geneConfig.organism}. Focus on: ${geneConfig.researchFocus.join(", ")}. Include: ${geneConfig.specificAspects.join(", ")}.${geneConfig.diseaseContext ? ` Disease context: ${geneConfig.diseaseContext}` : ""}`;
      }

      // Step 1: Generate search queries
      const queries = await generateSearchQueries(enhancedQuestion, mode);

      // Step 2: Perform searches
      const results = await performSearch(queries);

      if (results.length === 0) {
        throw new Error("No search results found");
      }

      // Step 3: Analyze results
      const analysis = await analyzeResults(enhancedQuestion, results, mode);

      // Step 4: Generate final report
      const report = await generateReport(enhancedQuestion, analysis, mode);

      // Complete research
      completeResearch(report);

      // Save to history
      addHistory({
        id: Date.now().toString(),
        question: enhancedQuestion,
        answer: report,
        mode,
        timestamp: Date.now(),
      });
    } catch (error: any) {
      console.error("Research failed:", error);
      failResearch(error.message);
      throw error;
    }
  }

  return {
    askQuestions,
  };
}
