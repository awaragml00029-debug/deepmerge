"use client";
import { useTranslation } from "react-i18next";
import { Dna, Lightbulb } from "lucide-react";
import { ResearchMode } from "@/store/setting";

interface ModeSwitchProps {
  mode: ResearchMode;
  onChange: (mode: ResearchMode) => void;
}

export default function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {t("research.mode.title")}
        </h3>
      </div>
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          type="button"
          onClick={() => onChange("general")}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
            text-sm font-medium transition-all duration-200
            ${
              mode === "general"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }
          `}
        >
          <Lightbulb className="w-4 h-4" />
          <span>{t("research.mode.general")}</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("gene")}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md
            text-sm font-medium transition-all duration-200
            ${
              mode === "gene"
                ? "bg-white dark:bg-slate-700 text-green-600 dark:text-green-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }
          `}
        >
          <Dna className="w-4 h-4" />
          <span>{t("research.mode.gene")}</span>
        </button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {mode === "general"
          ? t("research.mode.generalDescription")
          : t("research.mode.geneDescription")}
      </p>
    </div>
  );
}
