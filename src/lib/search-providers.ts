/**
 * Search Provider API Integration
 * Supports Tavily, Serper, and Exa
 */

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  content?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
}

export interface SearchProviderConfig {
  provider: "tavily" | "serper" | "exa";
  apiKey: string;
}

/**
 * Call Tavily Search API
 */
async function callTavily(query: string, apiKey: string): Promise<SearchResponse> {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "advanced",
      include_answer: true,
      include_raw_content: false,
      max_results: 10,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Tavily API Error: ${error.error || response.statusText}`);
  }

  const data = await response.json();
  return {
    query,
    results: data.results.map((r: any) => ({
      title: r.title,
      url: r.url,
      snippet: r.content,
      content: r.raw_content,
    })),
  };
}

/**
 * Call Serper (Google) Search API
 */
async function callSerper(query: string, apiKey: string): Promise<SearchResponse> {
  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: query,
      num: 10,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Serper API Error: ${error.error || response.statusText}`);
  }

  const data = await response.json();
  const results: SearchResult[] = [];

  // Add organic results
  if (data.organic) {
    results.push(
      ...data.organic.map((r: any) => ({
        title: r.title,
        url: r.link,
        snippet: r.snippet || "",
      }))
    );
  }

  // Add knowledge graph if available
  if (data.knowledgeGraph) {
    results.unshift({
      title: data.knowledgeGraph.title,
      url: data.knowledgeGraph.website || "",
      snippet: data.knowledgeGraph.description || "",
    });
  }

  return {
    query,
    results,
  };
}

/**
 * Call Exa Search API
 */
async function callExa(query: string, apiKey: string): Promise<SearchResponse> {
  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      query,
      num_results: 10,
      use_autoprompt: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Exa API Error: ${error.error || response.statusText}`);
  }

  const data = await response.json();
  return {
    query,
    results: data.results.map((r: any) => ({
      title: r.title,
      url: r.url,
      snippet: r.text || "",
    })),
  };
}

/**
 * Main function to call search provider
 */
export async function callSearchProvider(
  config: SearchProviderConfig,
  query: string
): Promise<SearchResponse> {
  const { provider, apiKey } = config;

  try {
    switch (provider) {
      case "tavily":
        return await callTavily(query, apiKey);
      case "serper":
        return await callSerper(query, apiKey);
      case "exa":
        return await callExa(query, apiKey);
      default:
        throw new Error(`Unsupported search provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error calling ${provider}:`, error);
    throw error;
  }
}

/**
 * Perform multiple searches and combine results
 */
export async function performDeepSearch(
  config: SearchProviderConfig,
  queries: string[]
): Promise<SearchResult[]> {
  const allResults: SearchResult[] = [];
  const seenUrls = new Set<string>();

  for (const query of queries) {
    try {
      const response = await callSearchProvider(config, query);
      for (const result of response.results) {
        if (!seenUrls.has(result.url)) {
          seenUrls.add(result.url);
          allResults.push(result);
        }
      }
    } catch (error) {
      console.error(`Search failed for query "${query}":`, error);
    }
  }

  return allResults;
}
