// Gene Research Integration Layer
// Connects GeneResearchEngine with the existing deep research workflow

import { GeneResearchEngine, GeneResearchConfig } from './gene-research';
import { createGeneQueryGenerator } from './gene-research/query-generator';
import { GeneDataExtractor } from './gene-research/data-extractor';
import { LiteratureValidator } from './gene-research/literature-validator';
import { LiteratureReference } from '@/types/gene-research';

/**
 * Extract gene symbol and organism from a research query
 * @param query The research query
 * @returns Extracted gene symbol and organism, or null if not a gene query
 */
export function parseGeneQuery(query: string): { geneSymbol: string; organism: string } | null {
  // Pattern: "Gene research: {gene} in {organism}"
  const genePattern = /Gene research:\s*([A-Za-z0-9-]+)\s+in\s+(.+)/i;
  const match = query.match(genePattern);

  if (match) {
    return {
      geneSymbol: match[1].trim(),
      organism: match[2].trim()
    };
  }

  return null;
}

/**
 * Generate enhanced search queries for gene research
 * Supplements AI-generated queries with gene-specific database queries
 * @param query The research query
 * @param plan The research plan
 * @returns Enhanced list of search queries including gene-specific databases
 */
export async function generateGeneEnhancedQueries(
  query: string,
  plan: string
): Promise<Array<{ query: string; database?: string }>> {
  const geneInfo = parseGeneQuery(query);

  if (!geneInfo) {
    return [];
  }

  const queryGenerator = createGeneQueryGenerator({
    geneSymbol: geneInfo.geneSymbol,
    organism: geneInfo.organism,
    researchFocus: extractResearchFocus(plan)
  });

  // Generate comprehensive gene-specific queries
  const geneQueries = queryGenerator.generateComprehensiveQueries();

  // Convert to format compatible with existing search system
  return geneQueries.map(task => ({
    query: task.query,
    database: task.database
  }));
}

/**
 * Extract research focus areas from the research plan
 * @param plan The research plan text
 * @returns Array of research focus areas
 */
function extractResearchFocus(plan: string): string[] | undefined {
  const focuses: string[] = [];
  const planLower = plan.toLowerCase();

  // Detect common research focuses
  if (planLower.includes('function') || planLower.includes('molecular')) {
    focuses.push('molecular_function');
  }
  if (planLower.includes('expression') || planLower.includes('tissue')) {
    focuses.push('expression_patterns');
  }
  if (planLower.includes('disease') || planLower.includes('pathology')) {
    focuses.push('disease_associations');
  }
  if (planLower.includes('interaction') || planLower.includes('pathway')) {
    focuses.push('protein_interactions');
  }
  if (planLower.includes('structure') || planLower.includes('domain')) {
    focuses.push('protein_structure');
  }
  if (planLower.includes('evolution') || planLower.includes('ortholog')) {
    focuses.push('evolutionary_conservation');
  }

  return focuses.length > 0 ? focuses : undefined;
}

/**
 * Extract gene-specific data from search results
 * Supplements AI processing with structured gene data extraction
 * @param sources The search results
 * @param query The research query
 * @returns Structured gene data extraction result
 */
export async function extractGeneDataFromSources(
  sources: Source[],
  query: string
): Promise<any> {
  const geneInfo = parseGeneQuery(query);

  if (!geneInfo) {
    return null;
  }

  const dataExtractor = new GeneDataExtractor(
    geneInfo.geneSymbol,
    geneInfo.organism
  );

  // Extract data from each source
  let combinedData: any = null;

  for (const source of sources) {
    try {
      const content = `${source.title}\n${source.content}`;
      const extracted = await dataExtractor.extractFromContent(
        content,
        source.url || 'unknown'
      );

      if (!combinedData) {
        combinedData = extracted;
      } else {
        // Merge extracted data (simplified merge)
        Object.assign(combinedData, extracted);
      }
    } catch (error) {
      console.error('Error extracting gene data from source:', error);
    }
  }

  return combinedData;
}

/**
 * Validate and enhance literature references from research results
 * Uses PubMed API for verification and deduplication
 * @param sources The search results containing references
 * @returns Validated and enhanced references
 */
export async function validateGeneReferences(
  sources: Source[]
): Promise<Source[]> {
  const validator = new LiteratureValidator();

  // Extract literature references from sources
  const references: Array<LiteratureReference & { source?: string }> = [];

  for (const source of sources) {
    // Try to extract PMID from source
    const pmidMatch = source.url?.match(/pubmed\.ncbi\.nlm\.nih\.gov\/(\d+)/);
    if (pmidMatch) {
      references.push({
        title: source.title || 'Untitled',
        authors: [], // Will be filled by validator
        journal: source.url || '',
        year: new Date().getFullYear(),
        pmid: pmidMatch[1],
        abstract: source.content || '',
        relevance: 'medium' as const,
        studyType: 'experimental' as const,
        organism: '',
        methodology: [],
        source: source.url
      });
    } else if (source.url?.includes('pubmed') || source.url?.includes('ncbi')) {
      // Try to extract PMID from content
      const contentPmidMatch = source.content?.match(/PMID:\s*(\d+)/i);
      if (contentPmidMatch) {
        references.push({
          title: source.title || 'Untitled',
          authors: [],
          journal: source.url || '',
          year: new Date().getFullYear(),
          pmid: contentPmidMatch[1],
          abstract: source.content || '',
          relevance: 'medium' as const,
          studyType: 'experimental' as const,
          organism: '',
          methodology: [],
          source: source.url
        });
      }
    }
  }

  if (references.length === 0) {
    return sources;
  }

  try {
    // Process and validate references
    const processedResult = await validator.processReferences(references);

    // Enhance sources with validated references
    const enhancedSources = sources.map(source => {
      const matchingRef = processedResult.uniqueReferences.find(
        ref => ref.sourceTracking?.extractedFrom === source.url
      );

      if (matchingRef && matchingRef.doi) {
        return {
          ...source,
          formattedCitation: formatReferenceCitation(matchingRef)
        };
      }

      return source;
    });

    return enhancedSources;
  } catch (error) {
    console.error('Error validating gene references:', error);
    return sources;
  }
}

/**
 * Format a validated reference for citation
 * @param reference The validated reference
 * @returns Formatted citation string
 */
function formatReferenceCitation(reference: any): string {
  let authors = 'Anonymous';
  if (reference.authors && reference.authors.length > 0) {
    if (reference.authors.length === 1) {
      authors = reference.authors[0];
    } else {
      authors = `${reference.authors[0]}, et al.`;
    }
  }

  let citation = `${authors} ${reference.year}. ${reference.title}. ${reference.journal}`;

  if (reference.volume) {
    citation += ` ${reference.volume}`;
    if (reference.issue) {
      citation += `(${reference.issue})`;
    }
    if (reference.pages) {
      citation += `:${reference.pages}`;
    }
  }

  if (reference.doi) {
    citation += ` DOI:[${reference.doi}](https://doi.org/${reference.doi})`;
  } else if (reference.pmid) {
    citation += ` PMID:[${reference.pmid}](https://pubmed.ncbi.nlm.nih.gov/${reference.pmid}/)`;
  }

  return citation;
}

/**
 * Conduct comprehensive gene research using GeneResearchEngine
 * This can be used as an alternative to the AI-driven research flow
 * @param query The gene research query
 * @param config Additional configuration
 * @returns Complete gene research result
 */
export async function conductComprehensiveGeneResearch(
  query: string,
  config?: Partial<GeneResearchConfig>
): Promise<any> {
  const geneInfo = parseGeneQuery(query);

  if (!geneInfo) {
    throw new Error('Invalid gene research query format');
  }

  const researchConfig: GeneResearchConfig = {
    geneSymbol: geneInfo.geneSymbol,
    organism: geneInfo.organism,
    enableAPIIntegration: true,
    enableQualityControl: true,
    enableVisualization: true,
    maxSearchResults: 20,
    ...config
  };

  const engine = new GeneResearchEngine(researchConfig);
  return await engine.conductResearch();
}
