"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Circle, Loader2, XCircle, Search, Brain, FileText, Sparkles } from "lucide-react";
import { useResearchStore, ResearchStep } from "@/store/research";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function StepIcon({ type, status }: { type: ResearchStep["type"]; status: ResearchStep["status"] }) {
  if (status === "error") {
    return <XCircle className="w-5 h-5 text-destructive" />;
  }

  if (status === "completed") {
    return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  }

  if (status === "running") {
    return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
  }

  const icons = {
    search: Search,
    analysis: Brain,
    synthesis: Sparkles,
    report: FileText,
  };

  const Icon = icons[type] || Circle;
  return <Icon className="w-5 h-5 text-muted-foreground" />;
}

function StepItem({ step }: { step: ResearchStep }) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0 mt-0.5">
        <StepIcon type={step.type} status={step.status} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm">{step.title}</h4>
          <Badge
            variant={
              step.status === "completed"
                ? "default"
                : step.status === "error"
                ? "destructive"
                : "secondary"
            }
            className="text-xs"
          >
            {step.status === "completed"
              ? t("research.progress.completed")
              : step.status === "error"
              ? t("research.progress.error")
              : step.status === "running"
              ? t("research.progress.running")
              : t("research.progress.pending")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{step.description}</p>
        {step.error && (
          <p className="text-sm text-destructive mt-1">Error: {step.error}</p>
        )}
        {step.result && (
          <div className="mt-2 p-2 bg-muted rounded text-xs">
            <p className="line-clamp-3">{step.result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResearchProgress() {
  const { t } = useTranslation();
  const { currentResearch, isResearching } = useResearchStore();
  const progressRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new steps are added
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.scrollTop = progressRef.current.scrollHeight;
    }
  }, [currentResearch?.steps.length]);

  if (!currentResearch) {
    return null;
  }

  const { question, mode, steps, startTime } = currentResearch;
  const duration = Date.now() - startTime;
  const durationSeconds = Math.floor(duration / 1000);

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {isResearching
              ? t("research.progress.researching")
              : t("research.progress.completed")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {mode === "gene" ? t("research.mode.gene") : t("research.mode.general")}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {Math.floor(durationSeconds / 60)}:{String(durationSeconds % 60).padStart(2, "0")}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{question}</p>
      </CardHeader>
      <CardContent>
        <div
          ref={progressRef}
          className="space-y-2 max-h-96 overflow-y-auto"
        >
          {steps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>{t("research.progress.initializing")}</p>
            </div>
          ) : (
            steps.map((step) => <StepItem key={step.id} step={step} />)
          )}
        </div>
      </CardContent>
    </Card>
  );
}
