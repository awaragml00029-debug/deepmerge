"use client";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
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
import useKnowledge from "@/hooks/useKnowledge";
import { useGlobalStore } from "@/store/global";
import { useTaskStore } from "@/store/task";

const formSchema = z.object({
  topic: z.string().min(2),
});

interface GeneralResearchProps {
  defaultTopic: string;
  onTopicChange: (topic: string) => void;
}

export default function GeneralResearch({
  defaultTopic,
  onTopicChange,
}: GeneralResearchProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const taskStore = useTaskStore();
  const { getKnowledgeFromFile } = useKnowledge();
  const [openCrawler, setOpenCrawler] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: defaultTopic,
    },
  });

  function openKnowledgeList() {
    const { setOpenKnowledge } = useGlobalStore.getState();
    setOpenKnowledge(true);
  }

  async function handleFileUpload(files: FileList | null) {
    if (files) {
      for await (const file of files) {
        await getKnowledgeFromFile(file);
      }
      // Clear the input file to avoid processing the previous file multiple times
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <Form {...form}>
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
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    onTopicChange(e.target.value);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormItem className="mt-2">
          <FormLabel className="mb-2 text-base font-semibold">
            {t("knowledge.localResourceTitle")}
          </FormLabel>
          <FormControl onSubmit={(ev) => ev.stopPropagation()}>
            <div>
              {taskStore.resources.length > 0 ? (
                <ResourceList
                  className="pb-2 mb-2 border-b"
                  resources={taskStore.resources}
                  onRemove={taskStore.removeResource}
                />
              ) : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="inline-flex border p-2 rounded-md text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                    <FilePlus className="w-5 h-5" />
                    <span className="ml-1">{t("knowledge.addResource")}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => openKnowledgeList()}>
                    <BookText />
                    <span>{t("knowledge.knowledge")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip />
                    <span>{t("knowledge.localFile")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpenCrawler(true)}>
                    <Link />
                    <span>{t("knowledge.webPage")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </FormControl>
        </FormItem>
      </Form>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(ev) => handleFileUpload(ev.target.files)}
      />
      <Crawler
        open={openCrawler}
        onClose={() => setOpenCrawler(false)}
      ></Crawler>
    </>
  );
}
