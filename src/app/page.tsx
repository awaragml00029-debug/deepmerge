"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Topic from "@/components/Research/Topic";
import ResearchCapabilities from "@/components/Research/ResearchCapabilities";

function TopicWithParams() {
  const searchParams = useSearchParams();

  const urlGeneSymbol = searchParams.get('gene') || searchParams.get('geneSymbol') || undefined;
  const urlOrganism = searchParams.get('organism') || searchParams.get('organismName') || undefined;

  return (
    <Topic
      urlGeneSymbol={urlGeneSymbol}
      urlOrganism={urlOrganism}
    />
  );
}

export default function Home() {
  return (
    <div className="max-lg:max-w-screen-md max-w-screen-lg mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Deep Research Platform</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Unified platform for general and specialized gene research
        </p>
      </header>

      <ResearchCapabilities />

      <main>
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <TopicWithParams />
        </Suspense>
      </main>
    </div>
  );
}
