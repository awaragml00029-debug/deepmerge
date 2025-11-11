"use client";

import { useTranslation } from "react-i18next";
import { Download, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useResearchStore } from "@/store/research";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/Internal/Button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

export default function ResearchResults() {
  const { t } = useTranslation();
  const { currentResearch } = useResearchStore();
  const [copied, setCopied] = useState(false);

  if (!currentResearch || currentResearch.status !== "completed" || !currentResearch.finalReport) {
    return null;
  }

  const { question, finalReport, sources, mode, startTime, endTime } = currentResearch;
  const duration = endTime ? Math.floor((endTime - startTime) / 1000) : 0;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(finalReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([finalReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `research-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Research Report */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("research.results.title")}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {mode === "gene" ? t("research.mode.gene") : t("research.mode.general")}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{question}</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t("research.results.copied")}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  {t("research.results.copy")}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              {t("research.results.exportMarkdown")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
            >
              <Download className="w-4 h-4 mr-2" />
              {t("research.results.exportPDF")}
            </Button>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{finalReport}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      {sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("research.results.sources")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1">{source.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {source.snippet}
                      </p>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        {source.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <Badge variant="secondary" className="flex-shrink-0">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
