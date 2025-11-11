"use client";

import { useTranslation } from "react-i18next";
import { Lightbulb, Dna } from "lucide-react";
import { Button } from "@/components/Internal/Button";
import type { ResearchMode } from "@/store/setting";

interface ModeSwitchProps {
  mode: ResearchMode;
  onChange: (mode: ResearchMode) => void;
}

export default function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 p-2 border rounded-lg mb-4 bg-slate-50 dark:bg-slate-900">
      <Button
        variant={mode === "general" ? "default" : "outline"}
        className="flex-1 flex items-center justify-center gap-2"
        onClick={() => onChange("general")}
      >
        <Lightbulb className="w-4 h-4" />
        <span>{t("research.mode.general")}</span>
      </Button>
      <Button
        variant={mode === "gene" ? "default" : "outline"}
        className="flex-1 flex items-center justify-center gap-2"
        onClick={() => onChange("gene")}
      >
        <Dna className="w-4 h-4" />
        <span>{t("research.mode.gene")}</span>
      </Button>
    </div>
  );
}
