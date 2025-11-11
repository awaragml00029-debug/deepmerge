"use client";

import { useTranslation } from "react-i18next";
import {
  FileText,
  MessageSquare,
  BookOpen,
  FileCheck,
  Network,
  Languages,
  Microscope,
  Atom,
  BarChart,
  Users,
  AlertCircle,
  GitBranch,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ResearchMode } from "@/store/setting";

interface ResearchCapabilitiesProps {
  mode: ResearchMode;
}

export default function ResearchCapabilities({ mode }: ResearchCapabilitiesProps) {
  const { t } = useTranslation();

  const generalCapabilities = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: t("research.capabilities.general.multiSource"),
      description: t("research.capabilities.general.multiSourceDesc"),
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: t("research.capabilities.general.intelligentQA"),
      description: t("research.capabilities.general.intelligentQADesc"),
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: t("research.capabilities.general.deepAnalysis"),
      description: t("research.capabilities.general.deepAnalysisDesc"),
    },
    {
      icon: <FileCheck className="w-5 h-5" />,
      title: t("research.capabilities.general.autoReport"),
      description: t("research.capabilities.general.autoReportDesc"),
    },
    {
      icon: <Network className="w-5 h-5" />,
      title: t("research.capabilities.general.knowledgeGraph"),
      description: t("research.capabilities.general.knowledgeGraphDesc"),
    },
    {
      icon: <Languages className="w-5 h-5" />,
      title: t("research.capabilities.general.multiLanguage"),
      description: t("research.capabilities.general.multiLanguageDesc"),
    },
  ];

  const geneCapabilities = [
    {
      icon: <Microscope className="w-5 h-5" />,
      title: t("research.capabilities.gene.molecular"),
      description: t("research.capabilities.gene.molecularDesc"),
    },
    {
      icon: <Atom className="w-5 h-5" />,
      title: t("research.capabilities.gene.structure"),
      description: t("research.capabilities.gene.structureDesc"),
    },
    {
      icon: <BarChart className="w-5 h-5" />,
      title: t("research.capabilities.gene.expression"),
      description: t("research.capabilities.gene.expressionDesc"),
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: t("research.capabilities.gene.interactions"),
      description: t("research.capabilities.gene.interactionsDesc"),
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: t("research.capabilities.gene.disease"),
      description: t("research.capabilities.gene.diseaseDesc"),
    },
    {
      icon: <GitBranch className="w-5 h-5" />,
      title: t("research.capabilities.gene.evolution"),
      description: t("research.capabilities.gene.evolutionDesc"),
    },
  ];

  const capabilities = mode === "general" ? generalCapabilities : geneCapabilities;
  const description =
    mode === "general"
      ? t("research.capabilities.generalDescription")
      : t("research.capabilities.geneDescription");

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{t("research.capabilities.title")}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <div className="flex-shrink-0 text-primary">{capability.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">{capability.title}</h4>
                <p className="text-xs text-muted-foreground">{capability.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
