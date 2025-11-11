"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SquarePlus } from "lucide-react";
import ModeSwitch from "@/components/Research/ModeSwitch";
import GeneralResearch from "@/components/Research/GeneralResearch";
import GeneResearch from "@/components/Research/GeneResearch";
import ResearchProgress from "@/components/Research/ResearchProgress";
import ResearchResults from "@/components/Research/ResearchResults";
import { Button } from "@/components/Internal/Button";
import useDeepResearch, { ResearchConfig } from "@/hooks/useDeepResearch";
import useAiProvider from "@/hooks/useAiProvider";
import useAccurateTimer from "@/hooks/useAccurateTimer";
import { useSettingStore } from "@/store/setting";
import { useTaskStore } from "@/store/task";
import { useHistoryStore } from "@/store/history";
import { useResearchStore } from "@/store/research";

interface TopicProps {
  urlGeneSymbol?: string;
  urlOrganism?: string;
}

function Topic({ urlGeneSymbol, urlOrganism }: TopicProps) {
  const { t } = useTranslation();
  const { researchMode, setResearchMode } = useSettingStore();
  const { askQuestions } = useDeepResearch();
  const { hasApiKey } = useAiProvider();
  const {
    formattedTime,
    start: accurateTimerStart,
    stop: accurateTimerStop,
  } = useAccurateTimer();
  const { isResearching, reset: resetResearch } = useResearchStore();

  // Auto-switch to gene mode if URL parameters are present
  useEffect(() => {
    if ((urlGeneSymbol || urlOrganism) && researchMode !== "gene") {
      setResearchMode("gene");
    }
  }, [urlGeneSymbol, urlOrganism, researchMode, setResearchMode]);

  function handleCheck(): boolean {
    const { mode } = useSettingStore.getState();
    if (!hasApiKey(mode)) {
      alert(t("setting.apiKeyRequired"));
      return false;
    }
    return true;
  }

  async function handleGeneResearch(config: any) {
    if (handleCheck()) {
      try {
        accurateTimerStart();

        // Create a gene research query
        let query = `Research ${config.geneSymbol} gene in ${config.organism}`;

        // Build research config
        const researchConfig: ResearchConfig = {
          question: query,
          mode: "gene",
          geneConfig: {
            geneSymbol: config.geneSymbol,
            organism: config.organism,
            researchFocus: config.researchFocus || [],
            specificAspects: config.specificAspects || [],
            diseaseContext: config.diseaseContext,
            experimentalApproach: config.experimentalApproach,
            userPrompt: config.userPrompt,
          },
        };

        await askQuestions(researchConfig);
      } catch (error) {
        console.error("Gene research failed:", error);
      } finally {
        accurateTimerStop();
      }
    }
  }

  async function handleGeneralResearch(question: string, resources?: any[]) {
    if (handleCheck()) {
      try {
        accurateTimerStart();

        const researchConfig: ResearchConfig = {
          question,
          mode: "general",
          resources,
        };

        await askQuestions(researchConfig);
      } catch (error) {
        console.error("General research failed:", error);
      } finally {
        accurateTimerStop();
      }
    }
  }

  function createNewResearch() {
    const { reset, backup, id } = useTaskStore.getState();
    const { update } = useHistoryStore.getState();
    if (id) update(id, backup());
    reset();
    resetResearch();
  }

  return (
    <>
      <section className="p-4 border rounded-md mt-4 print:hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {t("research.topic.title")}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={createNewResearch}
              disabled={isResearching}
            >
              <SquarePlus className="w-4 h-4 mr-1" />
              {t("research.topic.newResearch")}
            </Button>
          </div>
        </div>

        {/* Mode Switch */}
        <ModeSwitch mode={researchMode} onChange={setResearchMode} />

        {/* Conditional Rendering based on Research Mode */}
        {researchMode === "general" ? (
          <GeneralResearch
            onStartResearch={handleGeneralResearch}
            isResearching={isResearching}
            formattedTime={formattedTime}
          />
        ) : (
          <GeneResearch
            onStartResearch={handleGeneResearch}
            isResearching={isResearching}
            urlGeneSymbol={urlGeneSymbol}
            urlOrganism={urlOrganism}
          />
        )}
      </section>

      {/* Research Progress */}
      <ResearchProgress />

      {/* Research Results */}
      <ResearchResults />
    </>
  );
}

export default Topic;
