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
import useDeepResearch from "@/hooks/useDeepResearch";
import useAiProvider from "@/hooks/useAiProvider";
import useKnowledge from "@/hooks/useKnowledge";
import useAccurateTimer from "@/hooks/useAccurateTimer";
import { useGlobalStore } from "@/store/global";
import { useSettingStore } from "@/store/setting";
import { useTaskStore } from "@/store/task";
import { useHistoryStore } from "@/store/history";

const formSchema = z.object({
  topic: z.string().min(2, "Topic must be at least 2 characters"),
});

export default function GeneralResearch() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const taskStore = useTaskStore();
  const { askQuestions } = useDeepResearch();
  const { hasApiKey } = useAiProvider();
  const { getKnowledgeFromFile } = useKnowledge();
  const {
    formattedTime,
    start: accurateTimerStart,
    stop: accurateTimerStop,
  } = useAccurateTimer();
  const [isThinking, setIsThinking] = useState<boolean>(false);
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
      const { id, setQuestion, reset, backup } = useTaskStore.getState();
      try {
        setIsThinking(true);
        accurateTimerStart();
        if (id !== "") {
          createNewResearch();
          form.setValue("topic", values.topic);
        }
        setQuestion(values.topic);
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
    form.reset();
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
          <Button className="w-full mt-4" disabled={isThinking} type="submit">
            {isThinking ? (
              <>
                <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                <span>{t("research.common.thinkingQuestion")}</span>
                <small className="font-mono ml-2">{formattedTime}</small>
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
