import { useState } from "react";
import { streamText, smoothStream, type JSONValue, type Tool } from "ai";
import { parsePartialJson } from "@ai-sdk/ui-utils";
import { openai } from "@ai-sdk/openai";
import { type GoogleGenerativeAIProviderMetadata } from "@ai-sdk/google";
import { useTranslation } from "react-i18next";
import Plimit from "p-limit";
import { toast } from "sonner";
import useModelProvider from "@/hooks/useAiProvider";
import useWebSearch from "@/hooks/useWebSearch";
import { useTaskStore } from "@/store/task";
import { useHistoryStore } from "@/store/history";
import { useSettingStore } from "@/store/setting";
import { useKnowledgeStore } from "@/store/knowledge";
import { outputGuidelinesPrompt } from "@/constants/prompts";
import {
  getSystemPrompt,
  generateQuestionsPrompt,
  writeReportPlanPrompt,
  generateSerpQueriesPrompt,
  processResultPrompt,
  processSearchResultPrompt,
  processSearchKnowledgeResultPrompt,
  reviewSerpQueriesPrompt,
  writeFinalReportPrompt,
  getSERPQuerySchema,
} from "@/utils/deep-research/prompts";
import { isNetworkingModel } from "@/utils/model";
import { ThinkTagStreamProcessor, removeJsonMarkdown } from "@/utils/text";
import { parseError } from "@/utils/error";
import { pick, flat, unique } from "radash";
import { createGeneResearchEngine } from "@/utils/gene-research";

type ProviderOptions = Record<string, Record<string, JSONValue>>;
type Tools = Record<string, Tool>;

function getResponseLanguagePrompt() {
  return `\n\n**Respond in the same language as the user's language**`;
}

function smoothTextStream(type: "character" | "word" | "line") {
  return smoothStream({
    chunking: type === "character" ? /./ : type,
    delayInMs: 0,
  });
}

function handleError(error: unknown) {
  console.log(error);
  const errorMessage = parseError(error);
  toast.error(errorMessage);
}

/**
 * Detect if a query is for gene research based on format
 * Format: "Gene research: {gene} in {organism}"
 */
function detectGeneResearch(query: string): boolean {
  return query.trim().toLowerCase().startsWith("gene research:");
}

/**
 * Extract gene information from formatted query
 */
function extractGeneInfo(query: string): {
  geneSymbol: string;
  organism: string;
  researchFocus?: string[];
  specificAspects?: string[];
  diseaseContext?: string;
  experimentalApproach?: string;
  userPrompt?: string;
} {
  // Extract main line and user prompt
  const parts = query.split('\n\nResearch Question:\n');
  const mainLine = parts[0];
  const userPrompt = parts[1] || undefined;

  // Parse main line: "Gene research: BRCA1 in Homo sapiens - Focus: disease - Aspects: protein - Disease: cancer - Method: CRISPR"
  const geneMatch = mainLine.match(/Gene research:\s*([A-Za-z0-9_-]+)\s+in\s+([^-\n]+)/i);

  if (!geneMatch) {
    return {
      geneSymbol: 'Unknown',
      organism: 'Escherichia coli',
      userPrompt
    };
  }

  const geneSymbol = geneMatch[1].trim();
  const organism = geneMatch[2].trim();

  // Extract optional fields
  const focusMatch = mainLine.match(/Focus:\s*([^-\n]+)/i);
  const aspectsMatch = mainLine.match(/Aspects:\s*([^-\n]+)/i);
  const diseaseMatch = mainLine.match(/Disease:\s*([^-\n]+)/i);
  const methodMatch = mainLine.match(/Method:\s*([^-\n]+)/i);

  const researchFocus = focusMatch
    ? focusMatch[1].split(',').map(s => s.trim())
    : undefined;

  const specificAspects = aspectsMatch
    ? aspectsMatch[1].split(',').map(s => s.trim())
    : undefined;

  const diseaseContext = diseaseMatch ? diseaseMatch[1].trim() : undefined;
  const experimentalApproach = methodMatch ? methodMatch[1].trim() : undefined;

  return {
    geneSymbol,
    organism,
    researchFocus,
    specificAspects,
    diseaseContext,
    experimentalApproach,
    userPrompt
  };
}

function useDeepResearch() {
  const { t } = useTranslation();
  const taskStore = useTaskStore();
  const { smoothTextStreamType } = useSettingStore();
  const { createModelProvider, getModel } = useModelProvider();
  const { search } = useWebSearch();
  const [status, setStatus] = useState<string>("");

  async function generateSearchSettings(searchModel: string) {
    const { provider, enableSearch, searchProvider, searchMaxResult } =
      useSettingStore.getState();

    if (enableSearch && searchProvider === "model") {
      const createModel = (model: string) => {
        // Enable Gemini's built-in search tool
        if (
          ["google", "google-vertex"].includes(provider) &&
          isNetworkingModel(model)
        ) {
          return createModelProvider(model, { useSearchGrounding: true });
        } else {
          return createModelProvider(model);
        }
      };
      const getTools = (model: string) => {
        // Enable OpenAI's built-in search tool
        if (
          ["openai", "azure", "openaicompatible"].includes(provider) &&
          model.startsWith("gpt-4o")
        ) {
          return {
            web_search_preview: openai.tools.webSearchPreview({
              // optional configuration:
              searchContextSize: searchMaxResult > 5 ? "high" : "medium",
            }),
          } as Tools;
        }
      };
      const getProviderOptions = (model: string) => {
        // Enable OpenRouter's built-in search tool
        if (provider === "openrouter") {
          return {
            openrouter: {
              plugins: [
                {
                  id: "web",
                  max_results: searchMaxResult, // Defaults to 5
                },
              ],
            },
          } as ProviderOptions;
        } else if (
          provider === "xai" &&
          model.startsWith("grok-3") &&
          !model.includes("mini")
        ) {
          return {
            xai: {
              search_parameters: {
                mode: "auto",
                max_search_results: searchMaxResult,
              },
            },
          } as ProviderOptions;
        }
      };

      return {
        model: await createModel(searchModel),
        tools: getTools(searchModel),
        providerOptions: getProviderOptions(searchModel),
      };
    } else {
      return {
        model: await createModelProvider(searchModel),
      };
    }
  }

  async function askQuestions() {
    const { question } = useTaskStore.getState();
    const { thinkingModel } = getModel();
    setStatus(t("research.common.thinking"));
    const thinkTagStreamProcessor = new ThinkTagStreamProcessor();
    const searchSettings = await generateSearchSettings(thinkingModel);
    const result = streamText({
      ...searchSettings,
      system: getSystemPrompt(),
      prompt: [
        generateQuestionsPrompt(question),
        getResponseLanguagePrompt(),
      ].join("\n\n"),
      experimental_transform: smoothTextStream(smoothTextStreamType),
      onError: handleError,
    });
    let content = "";
    let reasoning = "";
    taskStore.setQuestion(question);
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        thinkTagStreamProcessor.processChunk(
          part.textDelta,
          (data) => {
            content += data;
            taskStore.updateQuestions(content);
          },
          (data) => {
            reasoning += data;
          }
        );
      } else if (part.type === "reasoning") {
        reasoning += part.textDelta;
      }
    }
    if (reasoning) console.log(reasoning);
  }

  async function writeReportPlan() {
    const { query } = useTaskStore.getState();
    const { thinkingModel } = getModel();
    setStatus(t("research.common.thinking"));
    const thinkTagStreamProcessor = new ThinkTagStreamProcessor();
    const searchSettings = await generateSearchSettings(thinkingModel);
    const result = streamText({
      ...searchSettings,
      system: getSystemPrompt(),
      prompt: [writeReportPlanPrompt(query), getResponseLanguagePrompt()].join(
        "\n\n"
      ),
      experimental_transform: smoothTextStream(smoothTextStreamType),
      onError: handleError,
    });
    let content = "";
    let reasoning = "";
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        thinkTagStreamProcessor.processChunk(
          part.textDelta,
          (data) => {
            content += data;
            taskStore.updateReportPlan(content);
          },
          (data) => {
            reasoning += data;
          }
        );
      } else if (part.type === "reasoning") {
        reasoning += part.textDelta;
      }
    }
    if (reasoning) console.log(reasoning);
    return content;
  }

  async function searchLocalKnowledges(query: string, researchGoal: string) {
    const { resources } = useTaskStore.getState();
    const knowledgeStore = useKnowledgeStore.getState();
    const knowledges: Knowledge[] = [];

    for (const item of resources) {
      if (item.status === "completed") {
        const resource = knowledgeStore.get(item.id);
        if (resource) {
          knowledges.push(resource);
        }
      }
    }

    const { networkingModel } = getModel();
    const thinkTagStreamProcessor = new ThinkTagStreamProcessor();
    const searchResult = streamText({
      model: await createModelProvider(networkingModel),
      system: getSystemPrompt(),
      prompt: [
        processSearchKnowledgeResultPrompt(query, researchGoal, knowledges),
        getResponseLanguagePrompt(),
      ].join("\n\n"),
      experimental_transform: smoothTextStream(smoothTextStreamType),
      onError: handleError,
    });
    let content = "";
    let reasoning = "";
    for await (const part of searchResult.fullStream) {
      if (part.type === "text-delta") {
        thinkTagStreamProcessor.processChunk(
          part.textDelta,
          (data) => {
            content += data;
            taskStore.updateTask(query, { learning: content });
          },
          (data) => {
            reasoning += data;
          }
        );
      } else if (part.type === "reasoning") {
        reasoning += part.textDelta;
      }
    }
    if (reasoning) console.log(reasoning);
    return content;
  }

  async function runSearchTask(queries: SearchTask[]) {
    const {
      enableSearch,
      searchProvider,
      parallelSearch,
      references,
      onlyUseLocalResource,
    } = useSettingStore.getState();
    const { resources } = useTaskStore.getState();
    const { networkingModel } = getModel();
    setStatus(t("research.common.research"));
    const plimit = Plimit(parallelSearch);
    const thinkTagStreamProcessor = new ThinkTagStreamProcessor();
    await Promise.all(
      queries.map((item) => {
        plimit(async () => {
          let content = "";
          let reasoning = "";
          let searchResult;
          let sources: Source[] = [];
          let images: ImageSource[] = [];
          taskStore.updateTask(item.query, { state: "processing" });

          if (resources.length > 0) {
            const knowledges = await searchLocalKnowledges(
              item.query,
              item.researchGoal
            );
            content += [
              knowledges,
              `### ${t("research.searchResult.references")}`,
              resources.map((item) => `- ${item.name}`).join("\n"),
            ].join("\n\n");

            if (onlyUseLocalResource === "enable") {
              taskStore.updateTask(item.query, {
                state: "completed",
                learning: content,
                sources,
                images,
              });
              return content;
            } else {
              content += "\n\n---\n\n";
            }
          }

          if (enableSearch) {
            if (searchProvider !== "model") {
              try {
                const results = await search(item.query);
                sources = results.sources;
                images = results.images;

                if (sources.length === 0) {
                  throw new Error("Invalid Search Results");
                }
              } catch (err) {
                console.error(err);
                handleError(
                  `[${searchProvider}]: ${
                    err instanceof Error ? err.message : "Search Failed"
                  }`
                );
                return plimit.clearQueue();
              }
              const enableReferences =
                sources.length > 0 && references === "enable";
              searchResult = streamText({
                model: await createModelProvider(networkingModel),
                system: getSystemPrompt(),
                prompt: [
                  processSearchResultPrompt(
                    item.query,
                    item.researchGoal,
                    sources,
                    enableReferences
                  ),
                  getResponseLanguagePrompt(),
                ].join("\n\n"),
                experimental_transform: smoothTextStream(smoothTextStreamType),
                onError: handleError,
              });
            } else {
              const searchSettings = await generateSearchSettings(
                networkingModel
              );
              searchResult = streamText({
                ...searchSettings,
                system: getSystemPrompt(),
                prompt: [
                  processResultPrompt(item.query, item.researchGoal),
                  getResponseLanguagePrompt(),
                ].join("\n\n"),
                experimental_transform: smoothTextStream(smoothTextStreamType),
                onError: handleError,
              });
            }
          } else {
            searchResult = streamText({
              model: await createModelProvider(networkingModel),
              system: getSystemPrompt(),
              prompt: [
                processResultPrompt(item.query, item.researchGoal),
                getResponseLanguagePrompt(),
              ].join("\n\n"),
              experimental_transform: smoothTextStream(smoothTextStreamType),
              onError: (err) => {
                taskStore.updateTask(item.query, { state: "failed" });
                handleError(err);
              },
            });
          }
          for await (const part of searchResult.fullStream) {
            if (part.type === "text-delta") {
              thinkTagStreamProcessor.processChunk(
                part.textDelta,
                (data) => {
                  content += data;
                  taskStore.updateTask(item.query, { learning: content });
                },
                (data) => {
                  reasoning += data;
                }
              );
            } else if (part.type === "reasoning") {
              reasoning += part.textDelta;
            } else if (part.type === "source") {
              sources.push(part.source);
            } else if (part.type === "finish") {
              if (part.providerMetadata?.google) {
                const { groundingMetadata } = part.providerMetadata.google;
                const googleGroundingMetadata =
                  groundingMetadata as GoogleGenerativeAIProviderMetadata["groundingMetadata"];
                if (googleGroundingMetadata?.groundingSupports) {
                  googleGroundingMetadata.groundingSupports.forEach(
                    ({ segment, groundingChunkIndices }) => {
                      if (segment.text && groundingChunkIndices) {
                        const index = groundingChunkIndices.map(
                          (idx: number) => `[${idx + 1}]`
                        );
                        content = content.replaceAll(
                          segment.text,
                          `${segment.text}${index.join("")}`
                        );
                      }
                    }
                  );
                }
              } else if (part.providerMetadata?.openai) {
                // Fixed the problem that OpenAI cannot generate markdown reference link syntax properly in Chinese context
                content = content.replaceAll("【", "[").replaceAll("】", "]");
              }
            }
          }
          if (reasoning) console.log(reasoning);

          if (sources.length > 0) {
            content +=
              "\n\n" +
              sources
                .map(
                  (item, idx) =>
                    `[${idx + 1}]: ${item.url}${
                      item.title ? ` "${item.title.replaceAll('"', " ")}"` : ""
                    }`
                )
                .join("\n");
          }

          if (content.length > 0) {
            taskStore.updateTask(item.query, {
              state: "completed",
              learning: content,
              sources,
              images,
            });
            return content;
          } else {
            taskStore.updateTask(item.query, {
              state: "failed",
              learning: "",
              sources: [],
              images: [],
            });
            return "";
          }
        });
      })
    );
  }

  async function reviewSearchResult() {
    const { reportPlan, tasks, suggestion } = useTaskStore.getState();
    const { thinkingModel } = getModel();
    setStatus(t("research.common.research"));
    const learnings = tasks.map((item) => item.learning);
    const thinkTagStreamProcessor = new ThinkTagStreamProcessor();
    const result = streamText({
      model: await createModelProvider(thinkingModel),
      system: getSystemPrompt(),
      prompt: [
        reviewSerpQueriesPrompt(reportPlan, learnings, suggestion),
        getResponseLanguagePrompt(),
      ].join("\n\n"),
      experimental_transform: smoothTextStream(smoothTextStreamType),
      onError: handleError,
    });

    const querySchema = getSERPQuerySchema();
    let content = "";
    let reasoning = "";
    let queries: SearchTask[] = [];
    for await (const textPart of result.textStream) {
      thinkTagStreamProcessor.processChunk(
        textPart,
        (text) => {
          content += text;
          const data: PartialJson = parsePartialJson(
            removeJsonMarkdown(content)
          );
          if (
            querySchema.safeParse(data.value) &&
            data.state === "successful-parse"
          ) {
            if (data.value) {
              queries = data.value.map(
                (item: { query: string; researchGoal: string }) => ({
                  state: "unprocessed",
                  learning: "",
                  ...pick(item, ["query", "researchGoal"]),
                })
              );
            }
          }
        },
        (text) => {
          reasoning += text;
        }
      );
    }
    if (reasoning) console.log(reasoning);
    if (queries.length > 0) {
      taskStore.update([...tasks, ...queries]);
      await runSearchTask(queries);
    }
  }

  async function writeFinalReport() {
    const { citationImage, references } = useSettingStore.getState();
    const {
      reportPlan,
      tasks,
      setId,
      setTitle,
      setSources,
      requirement,
      updateFinalReport,
    } = useTaskStore.getState();
    const { save } = useHistoryStore.getState();
    const { thinkingModel } = getModel();
    setStatus(t("research.common.writing"));
    updateFinalReport("");
    setTitle("");
    setSources([]);
    const learnings = tasks.map((item) => item.learning);
    const sources: Source[] = unique(
      flat(tasks.map((item) => item.sources || [])),
      (item) => item.url
    );
    const images: ImageSource[] = unique(
      flat(tasks.map((item) => item.images || [])),
      (item) => item.url
    );
    const enableCitationImage = images.length > 0 && citationImage === "enable";
    const enableReferences = sources.length > 0 && references === "enable";
    const thinkTagStreamProcessor = new ThinkTagStreamProcessor();
    const result = streamText({
      model: await createModelProvider(thinkingModel),
      system: [getSystemPrompt(), outputGuidelinesPrompt].join("\n\n"),
      prompt: [
        writeFinalReportPrompt(
          reportPlan,
          learnings,
          enableReferences
            ? sources.map((item) => pick(item, ["title", "url"]))
            : [],
          enableCitationImage ? images : [],
          requirement,
          enableCitationImage,
          enableReferences
        ),
        getResponseLanguagePrompt(),
      ].join("\n\n"),
      temperature: 0.5,
      experimental_transform: smoothTextStream(smoothTextStreamType),
      onError: handleError,
    });
    let content = "";
    let reasoning = "";
    for await (const part of result.fullStream) {
      if (part.type === "text-delta") {
        thinkTagStreamProcessor.processChunk(
          part.textDelta,
          (data) => {
            content += data;
            updateFinalReport(content);
          },
          (data) => {
            reasoning += data;
          }
        );
      } else if (part.type === "reasoning") {
        reasoning += part.textDelta;
      }
    }
    if (reasoning) console.log(reasoning);
    if (content.length > 0) {
      const title = (content || "")
        .split("\n")[0]
        .replaceAll("#", "")
        .replaceAll("*", "")
        .trim();
      setTitle(title);
      setSources(sources);
      const id = save(taskStore.backup());
      setId(id);
      return content;
    } else {
      return "";
    }
  }

  /**
   * Conduct specialized gene research using GeneResearchEngine
   */
  async function conductGeneResearch(geneInfo: {
    geneSymbol: string;
    organism: string;
    researchFocus?: string[];
    specificAspects?: string[];
    diseaseContext?: string;
    experimentalApproach?: string;
    userPrompt?: string;
  }) {
    const {
      setId,
      setTitle,
      setSources,
      updateFinalReport,
    } = useTaskStore.getState();
    const { save } = useHistoryStore.getState();

    try {
      setStatus(t("research.common.research"));
      updateFinalReport("");
      setTitle("");
      setSources([]);

      // Create gene research engine with specialized settings
      const geneEngine = createGeneResearchEngine({
        geneSymbol: geneInfo.geneSymbol,
        organism: geneInfo.organism,
        researchFocus: geneInfo.researchFocus || ['general'],
        specificAspects: geneInfo.specificAspects || [],
        diseaseContext: geneInfo.diseaseContext,
        experimentalApproach: geneInfo.experimentalApproach,
        targetAudience: 'researchers',
        reportType: 'comprehensive',
        enableAPIIntegration: true,
        enableQualityControl: true,
        enableVisualization: true,
        maxSearchResults: 20,
        searchProviders: [
          'pubmed',
          'uniprot',
          'ncbi_gene',
          'geo',
          'pdb',
          'kegg',
          'string',
          'omim',
          'ensembl',
          'reactome'
        ]
      });

      setStatus(t("research.common.writing"));

      // Conduct comprehensive gene research
      const result = await geneEngine.conductResearch();

      // Convert gene research result to standard format for display
      const sources = result.workflow.literatureReview.map(ref => {
        const authors = ref.authors && ref.authors.length > 0
          ? (ref.authors.length === 1 ? ref.authors[0] : `${ref.authors[0]}, et al.`)
          : 'Anonymous';
        const formattedCitation = `${authors} ${ref.year}. ${ref.title}. ${ref.journal}${ref.pmid ? ` PMID:${ref.pmid}` : ''}`;

        return {
          title: ref.title,
          url: ref.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/` : '#',
          content: ref.abstract,
          database: 'pubmed',
          formattedCitation
        };
      });

      // Format the final report
      let finalReport = `# ${result.report.title}\n\n`;

      // Add executive summary if available
      if (result.report.executiveSummary) {
        finalReport += `## Executive Summary\n\n${result.report.executiveSummary}\n\n`;
      }

      // Add all sections
      result.report.sections.forEach((section: { title: string; content: string }) => {
        finalReport += `## ${section.title}\n\n${section.content}\n\n`;
      });

      // Add quality metrics as a note
      if (result.qualityMetrics) {
        const metrics = result.qualityMetrics as any; // Type mismatch between interfaces
        finalReport += `---\n\n`;
        finalReport += `**Research Quality Metrics:**\n`;

        // Check if it's the detailed QualityControlResult format
        if (metrics.overallScore !== undefined) {
          finalReport += `- Overall Score: ${metrics.overallScore}/100\n`;
          if (metrics.categoryScores) {
            finalReport += `- Literature Coverage: ${metrics.categoryScores.literatureCoverage}/100\n`;
            finalReport += `- Data Completeness: ${metrics.categoryScores.dataCompleteness}/100\n`;
            finalReport += `- Experimental Evidence: ${metrics.categoryScores.experimentalEvidence}/100\n`;
            finalReport += `- Scientific Rigor: ${metrics.categoryScores.scientificRigor}/100\n`;
          }
          if (metrics.recommendations && metrics.recommendations.length > 0) {
            finalReport += `\n**Recommendations for Further Research:**\n`;
            metrics.recommendations.forEach((rec: string) => {
              finalReport += `- ${rec}\n`;
            });
          }
        } else {
          // Simple GeneResearchQualityMetrics format
          finalReport += `- Overall Quality: ${Math.round((metrics.overallQuality || 0) * 100)}/100\n`;
          finalReport += `- Data Completeness: ${Math.round((metrics.dataCompleteness || 0) * 100)}/100\n`;
          finalReport += `- Literature Coverage: ${Math.round((metrics.literatureCoverage || 0) * 100)}/100\n`;
          finalReport += `- Experimental Evidence: ${Math.round((metrics.experimentalEvidence || 0) * 100)}/100\n`;
        }
      }

      // Update the UI with the results
      updateFinalReport(finalReport);
      setTitle(result.report.title);
      setSources(sources);

      const id = save(taskStore.backup());
      setId(id);

      toast.success("Gene research completed successfully!");

      return finalReport;
    } catch (err) {
      console.error('Gene research error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gene research failed';
      toast.error(`Gene research failed: ${errorMessage}`);
      throw err;
    }
  }

  async function deepResearch() {
    const { question, reportPlan } = useTaskStore.getState();

    // Check if this is a gene research query
    if (detectGeneResearch(question)) {
      try {
        const geneInfo = extractGeneInfo(question);
        await conductGeneResearch(geneInfo);
        return;
      } catch (err) {
        console.error('Gene research failed, falling back to general research:', err);
        toast.warning('Gene research failed, using general research mode');
        // Fall through to general research
      }
    }

    // General research workflow
    const { thinkingModel } = getModel();
    setStatus(t("research.common.thinking"));
    try {
      const thinkTagStreamProcessor = new ThinkTagStreamProcessor();
      const result = streamText({
        model: await createModelProvider(thinkingModel),
        system: getSystemPrompt(),
        prompt: [
          generateSerpQueriesPrompt(reportPlan),
          getResponseLanguagePrompt(),
        ].join("\n\n"),
        experimental_transform: smoothTextStream(smoothTextStreamType),
        onError: handleError,
      });

      const querySchema = getSERPQuerySchema();
      let content = "";
      let reasoning = "";
      let queries: SearchTask[] = [];
      for await (const textPart of result.textStream) {
        thinkTagStreamProcessor.processChunk(
          textPart,
          (text) => {
            content += text;
            const data: PartialJson = parsePartialJson(
              removeJsonMarkdown(content)
            );
            if (querySchema.safeParse(data.value)) {
              if (
                data.state === "repaired-parse" ||
                data.state === "successful-parse"
              ) {
                if (data.value) {
                  queries = data.value.map(
                    (item: { query: string; researchGoal: string }) => ({
                      state: "unprocessed",
                      learning: "",
                      ...pick(item, ["query", "researchGoal"]),
                    })
                  );
                  taskStore.update(queries);
                }
              }
            }
          },
          (text) => {
            reasoning += text;
          }
        );
      }
      if (reasoning) console.log(reasoning);
      await runSearchTask(queries);
    } catch (err) {
      console.error(err);
    }
  }

  return {
    status,
    deepResearch,
    askQuestions,
    writeReportPlan,
    runSearchTask,
    reviewSearchResult,
    writeFinalReport,
  };
}

export default useDeepResearch;
