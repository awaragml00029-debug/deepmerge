"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ORGANISMS = [
  { value: "Escherichia coli", label: "E. coli (Escherichia coli)" },
  { value: "Homo sapiens", label: "Human (Homo sapiens)" },
  { value: "Mus musculus", label: "Mouse (Mus musculus)" },
  { value: "Rattus norvegicus", label: "Rat (Rattus norvegicus)" },
  { value: "Drosophila melanogaster", label: "Fruit fly (Drosophila melanogaster)" },
  { value: "Caenorhabditis elegans", label: "C. elegans (Caenorhabditis elegans)" },
  { value: "Saccharomyces cerevisiae", label: "Yeast (Saccharomyces cerevisiae)" },
  { value: "Arabidopsis thaliana", label: "Thale cress (Arabidopsis thaliana)" },
  { value: "Danio rerio", label: "Zebrafish (Danio rerio)" },
  { value: "Xenopus laevis", label: "African clawed frog (Xenopus laevis)" },
  { value: "Gallus gallus", label: "Chicken (Gallus gallus)" },
  { value: "Canis lupus familiaris", label: "Dog (Canis lupus familiaris)" },
];

const RESEARCH_FOCI = [
  { value: "general", label: "General Gene Function" },
  { value: "disease", label: "Disease Association" },
  { value: "molecular", label: "Molecular Function" },
  { value: "expression", label: "Expression Patterns" },
  { value: "structure", label: "Protein Structure" },
  { value: "interactions", label: "Protein Interactions" },
  { value: "evolution", label: "Evolutionary Conservation" },
];

const SPECIFIC_ASPECTS = [
  { value: "catalytic", label: "Catalytic Activity" },
  { value: "binding", label: "Binding Sites & Partners" },
  { value: "localization", label: "Subcellular Localization" },
  { value: "regulation", label: "Gene Regulation" },
  { value: "pathways", label: "Biological Pathways" },
  { value: "mutations", label: "Mutations & Variants" },
  { value: "orthologs", label: "Orthologs & Paralogs" },
  { value: "modifications", label: "Post-translational Modifications" },
];

const formSchema = z.object({
  geneSymbol: z.string().min(1, "Gene symbol is required"),
  organism: z.string().min(1, "Please select an organism"),
  researchFoci: z.array(z.string()).min(1, "Select at least one research focus"),
  specificAspects: z.array(z.string()),
  diseaseContext: z.string().optional(),
  experimentalApproach: z.string().optional(),
  userPrompt: z.string().optional(),
});

interface GeneResearchProps {
  urlGeneSymbol?: string;
  urlOrganism?: string;
  onConfigChange: (config: z.infer<typeof formSchema>) => void;
}

export default function GeneResearch({
  urlGeneSymbol,
  urlOrganism,
  onConfigChange,
}: GeneResearchProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      geneSymbol: urlGeneSymbol || "",
      organism: urlOrganism || "Homo sapiens",
      researchFoci: ["general"],
      specificAspects: [],
      diseaseContext: "",
      experimentalApproach: "",
      userPrompt: "",
    },
  });

  // Watch all form values and notify parent of changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.geneSymbol && value.organism && value.researchFoci) {
        onConfigChange(value as z.infer<typeof formSchema>);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onConfigChange]);

  return (
    <Form {...form}>
      <div className="space-y-4">
        {/* Gene Symbol Input */}
        <FormField
          control={form.control}
          name="geneSymbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {t("research.topic.geneSymbolLabel")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., TP53, BRCA1, INS"
                  {...field}
                  className="font-mono"
                />
              </FormControl>
              <FormDescription>
                Enter the gene symbol or name (e.g., TP53, EGFR, APOE)
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Organism Selection */}
        <FormField
          control={form.control}
          name="organism"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                {t("research.topic.organismLabel")}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organism" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ORGANISMS.map((org) => (
                    <SelectItem key={org.value} value={org.value}>
                      {org.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the model organism for your research
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Research Focus Selection */}
        <FormField
          control={form.control}
          name="researchFoci"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Research Focus
              </FormLabel>
              <FormDescription className="mb-2">
                Select one or more research areas (at least one required)
              </FormDescription>
              <div className="grid grid-cols-2 gap-2">
                {RESEARCH_FOCI.map((focus) => (
                  <FormField
                    key={focus.value}
                    control={form.control}
                    name="researchFoci"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(focus.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, focus.value])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== focus.value
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <Label className="font-normal cursor-pointer">
                          {focus.label}
                        </Label>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        {/* Specific Aspects (Optional) */}
        <FormField
          control={form.control}
          name="specificAspects"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Specific Aspects (Optional)
              </FormLabel>
              <FormDescription className="mb-2">
                Select specific biological aspects to investigate
              </FormDescription>
              <div className="grid grid-cols-2 gap-2">
                {SPECIFIC_ASPECTS.map((aspect) => (
                  <FormField
                    key={aspect.value}
                    control={form.control}
                    name="specificAspects"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(aspect.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, aspect.value])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== aspect.value
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <Label className="font-normal cursor-pointer">
                          {aspect.label}
                        </Label>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        {/* Disease Context (Optional) */}
        <FormField
          control={form.control}
          name="diseaseContext"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Disease Context (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Cancer, Alzheimer's disease, Diabetes"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Specify disease context if researching clinical relevance
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Experimental Approach (Optional) */}
        <FormField
          control={form.control}
          name="experimentalApproach"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Experimental Methods (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., CRISPR, RNA-seq, ChIP-seq, Immunofluorescence"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Specify experimental techniques or methodologies of interest
              </FormDescription>
            </FormItem>
          )}
        />

        {/* Custom Prompt (Optional) */}
        <FormField
          control={form.control}
          name="userPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Additional Instructions (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={3}
                  placeholder="Enter any additional research questions or specific areas you want to explore..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide custom instructions or specific questions for your research
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
}
