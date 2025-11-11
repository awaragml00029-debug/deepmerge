"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SquarePlus } from "lucide-react";
import ModeSwitch from "@/components/Research/ModeSwitch";
import GeneralResearch from "@/components/Research/GeneralResearch";
import GeneResearch from "@/components/Research/GeneResearch";
import { Button } from "@/components/Internal/Button";
import useDeepResearch from "@/hooks/useDeepResearch";
import useAiProvider from "@/hooks/useAiProvider";
import useAccurateTimer from "@/hooks/useAccurateTimer";
import { useSettingStore } from "@/store/setting";
import { useTaskStore } from "@/store/task";
import { useHistoryStore } from "@/store/history";

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
    start: accurateTimerStart,
    stop: accurateTimerStop,
  } = useAccurateTimer();
  const [isThinking, setIsThinking] = useState<boolean>(false);

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
      const { id, setQuestion, reset, backup } = useTaskStore.getState();
      try {
        setIsThinking(true);
        accurateTimerStart();

        // Create a gene research query
        let query = `Gene research: ${config.geneSymbol} in ${config.organism}`;
        if (
          config.researchFocus &&
          config.researchFocus.length > 0 &&
          !config.researchFocus.includes("general")
        ) {
          query += ` - Focus: ${config.researchFocus.join(", ")}`;
        }
        if (config.specificAspects && config.specificAspects.length > 0) {
          query += ` - Aspects: ${config.specificAspects.join(", ")}`;
        }
        if (config.diseaseContext) {
          query += ` - Disease: ${config.diseaseContext}`;
        }
        if (config.experimentalApproach) {
          query += ` - Method: ${config.experimentalApproach}`;
        }

        // Add user prompt if provided
        if (config.userPrompt && config.userPrompt.trim()) {
          // Replace placeholders in user prompt
          const userPrompt = config.userPrompt
            .replace(/{geneSymbol}/g, config.geneSymbol)
            .replace(/{organism}/g, config.organism);
          query += `\n\nResearch Question:\n${userPrompt}`;
        }

        if (id !== "") {
          createNewResearch();
        }
        setQuestion(query);
        await askQuestions();
      } finally {
        setIsThinking(false);
        accurateTimerStop();
      }
    }
  }

  function createNewResearch() {
    const { reset, backup, id } = useTaskStore.getState();
    const { update } = useHistoryStore.getState();
    if (id) update(id, backup());
    reset();
  }

  return (
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
            disabled={isThinking}
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
        <GeneralResearch />
      ) : (
        <GeneResearch
          onStartResearch={handleGeneResearch}
          isResearching={isThinking}
          urlGeneSymbol={urlGeneSymbol}
          urlOrganism={urlOrganism}
        />
      )}
    </section>
  );
}

export default Topic;
