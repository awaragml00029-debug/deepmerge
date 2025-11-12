"use client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  LoaderCircle,
  SquarePlus,
} from "lucide-react";
import ModeSwitch from "@/components/Research/ModeSwitch";
import GeneralResearch from "@/components/Research/GeneralResearch";
import GeneResearch from "@/components/Research/GeneResearch";
import { Button } from "@/components/Internal/Button";
import useDeepResearch from "@/hooks/useDeepResearch";
import useAiProvider from "@/hooks/useAiProvider";
import useAccurateTimer from "@/hooks/useAccurateTimer";
import { useGlobalStore } from "@/store/global";
import { useSettingStore } from "@/store/setting";
import { useTaskStore } from "@/store/task";
import { useHistoryStore } from "@/store/history";

interface TopicProps {
  urlGeneSymbol?: string;
  urlOrganism?: string;
}

function Topic({ urlGeneSymbol, urlOrganism }: TopicProps) {
  const { t } = useTranslation();
  const taskStore = useTaskStore();
  const { askQuestions } = useDeepResearch();
  const { hasApiKey } = useAiProvider();
  const { researchMode, update: updateSettings } = useSettingStore();
  const {
    formattedTime,
    start: accurateTimerStart,
    stop: accurateTimerStop,
  } = useAccurateTimer();
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [currentTopic, setCurrentTopic] = useState<string>(taskStore.question);
  const [geneConfig, setGeneConfig] = useState<any>(null);

  function handleCheck(): boolean {
    if (!hasApiKey()) {
      const { setOpenSetting } = useGlobalStore.getState();
      setOpenSetting(true);
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (handleCheck()) {
      const { id, setQuestion } = useTaskStore.getState();
      try {
        setIsThinking(true);
        accurateTimerStart();
        if (id !== "") {
          createNewResearch();
        }

        // Build the question based on research mode
        let question = currentTopic;
        if (researchMode === "gene" && geneConfig) {
          // Build gene research query - aligned with DeepGeneResearch format
          let query = `Gene research: ${geneConfig.geneSymbol} in ${geneConfig.organism}`;

          // Only show Focus if not 'general'
          if (geneConfig.researchFoci &&
              geneConfig.researchFoci.length > 0 &&
              !geneConfig.researchFoci.includes('general')) {
            query += ` - Focus: ${geneConfig.researchFoci.join(', ')}`;
          }

          // All optional fields use " - " separator (single-line format)
          if (geneConfig.specificAspects && geneConfig.specificAspects.length > 0) {
            query += ` - Aspects: ${geneConfig.specificAspects.join(', ')}`;
          }
          if (geneConfig.diseaseContext) {
            query += ` - Disease: ${geneConfig.diseaseContext}`;
          }
          if (geneConfig.experimentalApproach) {
            query += ` - Method: ${geneConfig.experimentalApproach}`;
          }

          // User prompt with placeholder replacement
          if (geneConfig.userPrompt && geneConfig.userPrompt.trim()) {
            const userPrompt = geneConfig.userPrompt
              .replace(/{geneSymbol}/g, geneConfig.geneSymbol)
              .replace(/{organism}/g, geneConfig.organism);
            query += `\n\nResearch Question:\n${userPrompt}`;
          }

          question = query;
        }

        setQuestion(question);
        await askQuestions();
      } finally {
        setIsThinking(false);
        accurateTimerStop();
      }
    }
  }

  function createNewResearch() {
    const { id, backup, reset } = useTaskStore.getState();
    const { update } = useHistoryStore.getState();
    if (id) update(id, backup());
    reset();
    setCurrentTopic("");
    setGeneConfig(null);
  }

  function handleModeChange(mode: "general" | "gene") {
    updateSettings({ researchMode: mode });
  }

  useEffect(() => {
    setCurrentTopic(taskStore.question);
  }, [taskStore.question]);

  return (
    <>
      <section className="p-4 border rounded-md mt-4 print:hidden">
        <div className="flex justify-between items-center border-b mb-2">
          <h3 className="font-semibold text-lg leading-10">
            {t("research.topic.title")}
          </h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => createNewResearch()}
              title={t("research.topic.newResearch")}
            >
              <SquarePlus />
            </Button>
          </div>
        </div>

        {/* Mode Switcher */}
        <ModeSwitch mode={researchMode} onChange={handleModeChange} />

        {/* Conditional Research Forms */}
        {researchMode === "general" ? (
          <GeneralResearch
            defaultTopic={currentTopic}
            onTopicChange={setCurrentTopic}
          />
        ) : (
          <GeneResearch
            urlGeneSymbol={urlGeneSymbol}
            urlOrganism={urlOrganism}
            onConfigChange={setGeneConfig}
          />
        )}

        {/* Start Research Button */}
        <Button
          className="w-full mt-4"
          disabled={isThinking}
          onClick={handleSubmit}
        >
          {isThinking ? (
            <>
              <LoaderCircle className="animate-spin" />
              <span>{t("research.common.thinkingQuestion")}</span>
              <small className="font-mono">{formattedTime}</small>
            </>
          ) : taskStore.questions === "" ? (
            t("research.common.startThinking")
          ) : (
            t("research.common.rethinking")
          )}
        </Button>
      </section>
    </>
  );
}

export default Topic;
