"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  LoaderCircle,
  FilePlus,
  BookText,
  Paperclip,
  Link,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ResourceList from "@/components/Knowledge/ResourceList";
import Crawler from "@/components/Knowledge/Crawler";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/Internal/Button";
import useAiProvider from "@/hooks/useAiProvider";
import useKnowledge from "@/hooks/useKnowledge";
import { useGlobalStore } from "@/store/global";
import { useSettingStore } from "@/store/setting";
import { useTaskStore } from "@/store/task";

const formSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters"),
});

interface GeneralResearchProps {
  onStartResearch: (question: string, resources?: any[]) => Promise<void>;
  isResearching: boolean;
}

export default function GeneralResearch({ onStartResearch, isResearching }: GeneralResearchProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const taskStore = useTaskStore();
  const { hasApiKey } = useAiProvider();
  const { getKnowledgeFromFile } = useKnowledge();
  const [openCrawler, setOpenCrawler] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: taskStore.question || "",
    },
  });

  function handleCheck(): boolean {
    const { mode } = useSettingStore.getState();
    if (!hasApiKey(mode)) {
      alert(t("setting.apiKeyRequired"));
      return false;
    }
    return true;
  }

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    if (handleCheck()) {
      await onStartResearch(values.topic, taskStore.resources);
    }
  }

  function openKnowledgeList() {
    const { setOpenKnowledge } = useGlobalStore.getState();
    setOpenKnowledge(true);
  }

  async function handleFileUpload(files: FileList | null) {
    if (files) {
      for (const file of Array.from(files)) {
        await getKnowledgeFromFile(file);
      }
      // Clear the input file to avoid processing the previous file multiple times
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  useEffect(() => {
    form.setValue("topic", taskStore.question);
  }, [taskStore.question, form]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2 text-base font-semibold">
                  {t("research.topic.topicLabel")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder={t("research.topic.topicPlaceholder")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormItem className="mt-4">
            <FormLabel className="mb-2 text-base font-semibold">
              {t("knowledge.localResourceTitle")}
            </FormLabel>
            <FormControl onSubmit={(ev) => ev.stopPropagation()}>
              <div>
                {taskStore.resources && taskStore.resources.length > 0 ? (
                  <ResourceList
                    className="pb-2 mb-2 border-b"
                    resources={taskStore.resources}
                    onRemove={taskStore.removeResource}
                  />
                ) : null}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="inline-flex border p-2 rounded-md text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <FilePlus className="w-5 h-5" />
                      <span className="ml-1">{t("knowledge.addResource")}</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => openKnowledgeList()}>
                      <BookText className="w-4 h-4 mr-2" />
                      <span>{t("knowledge.knowledge")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        handleCheck() && fileInputRef.current?.click()
                      }
                    >
                      <Paperclip className="w-4 h-4 mr-2" />
                      <span>{t("knowledge.localFile")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCheck() && setOpenCrawler(true)}
                    >
                      <Link className="w-4 h-4 mr-2" />
                      <span>{t("knowledge.webPage")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </FormControl>
          </FormItem>
          <Button className="w-full mt-4" disabled={isResearching} type="submit">
            {isResearching ? (
              <>
                <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                <span>{t("research.common.thinkingQuestion")}</span>
              </>
            ) : taskStore.questions === "" ? (
              t("research.common.startThinking")
            ) : (
              t("research.common.rethinking")
            )}
          </Button>
        </form>
      </Form>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(ev) => handleFileUpload(ev.target.files)}
      />
      <Crawler open={openCrawler} onClose={() => setOpenCrawler(false)} />
    </div>
  );
}
