// Research Capabilities Component
// Displays capabilities overview based on research mode

"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Lightbulb, Dna } from "lucide-react";
import { useSettingStore } from "@/store/setting";
import { useTranslation } from "react-i18next";

export default function ResearchCapabilities() {
  const { t } = useTranslation();
  const { researchMode } = useSettingStore();

  const generalCapabilities = [
    {
      title: t("research.capabilities.general.multiSource"),
      description: t("research.capabilities.general.multiSourceDesc"),
    },
    {
      title: t("research.capabilities.general.intelligentQA"),
      description: t("research.capabilities.general.intelligentQADesc"),
    },
    {
      title: t("research.capabilities.general.deepAnalysis"),
      description: t("research.capabilities.general.deepAnalysisDesc"),
    },
    {
      title: t("research.capabilities.general.autoReport"),
      description: t("research.capabilities.general.autoReportDesc"),
    },
    {
      title: t("research.capabilities.general.knowledgeGraph"),
      description: t("research.capabilities.general.knowledgeGraphDesc"),
    },
    {
      title: t("research.capabilities.general.multiLanguage"),
      description: t("research.capabilities.general.multiLanguageDesc"),
    },
  ];

  const geneCapabilities = [
    {
      title: t("research.capabilities.gene.molecular"),
      description: t("research.capabilities.gene.molecularDesc"),
    },
    {
      title: t("research.capabilities.gene.structure"),
      description: t("research.capabilities.gene.structureDesc"),
    },
    {
      title: t("research.capabilities.gene.expression"),
      description: t("research.capabilities.gene.expressionDesc"),
    },
    {
      title: t("research.capabilities.gene.interactions"),
      description: t("research.capabilities.gene.interactionsDesc"),
    },
    {
      title: t("research.capabilities.gene.disease"),
      description: t("research.capabilities.gene.diseaseDesc"),
    },
    {
      title: t("research.capabilities.gene.evolution"),
      description: t("research.capabilities.gene.evolutionDesc"),
    },
  ];

  const capabilities = researchMode === "gene" ? geneCapabilities : generalCapabilities;
  const icon = researchMode === "gene" ? Dna : Lightbulb;
  const Icon = icon;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {t("research.capabilities.title")}
        </CardTitle>
        <CardDescription>
          {researchMode === "gene"
            ? t("research.capabilities.geneDescription")
            : t("research.capabilities.generalDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((capability, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium">{capability.title}</h4>
              <p className="text-sm text-muted-foreground">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
