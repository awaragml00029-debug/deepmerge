/**
 * AI Provider API Integration
 * Supports OpenAI, Anthropic, Google, and SiliconFlow
 */

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIProviderConfig {
  provider: "openai" | "anthropic" | "google" | "siliconflow";
  apiKey: string;
  model?: string;
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  messages: AIMessage[],
  apiKey: string,
  model: string = "gpt-4-turbo-preview"
): Promise<AIResponse> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    usage: data.usage,
  };
}

/**
 * Call Anthropic (Claude) API
 */
async function callAnthropic(
  messages: AIMessage[],
  apiKey: string,
  model: string = "claude-3-sonnet-20240229"
): Promise<AIResponse> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      messages: messages.filter((m) => m.role !== "system"),
      system: messages.find((m) => m.role === "system")?.content || "",
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.content[0].text,
    usage: data.usage,
  };
}

/**
 * Call Google (Gemini) API
 */
async function callGoogle(
  messages: AIMessage[],
  apiKey: string,
  model: string = "gemini-pro"
): Promise<AIResponse> {
  const prompt = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Google API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.candidates[0].content.parts[0].text,
  };
}

/**
 * Call SiliconFlow API
 */
async function callSiliconFlow(
  messages: AIMessage[],
  apiKey: string,
  model: string = "Qwen/Qwen2-72B-Instruct"
): Promise<AIResponse> {
  const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`SiliconFlow API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    usage: data.usage,
  };
}

/**
 * Main function to call AI provider
 */
export async function callAIProvider(
  config: AIProviderConfig,
  messages: AIMessage[]
): Promise<AIResponse> {
  const { provider, apiKey, model } = config;

  try {
    switch (provider) {
      case "openai":
        return await callOpenAI(messages, apiKey, model);
      case "anthropic":
        return await callAnthropic(messages, apiKey, model);
      case "google":
        return await callGoogle(messages, apiKey, model);
      case "siliconflow":
        return await callSiliconFlow(messages, apiKey, model);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error calling ${provider}:`, error);
    throw error;
  }
}

/**
 * Get model name based on provider
 */
export function getDefaultModel(provider: string): string {
  const models: Record<string, string> = {
    openai: "gpt-4-turbo-preview",
    anthropic: "claude-3-sonnet-20240229",
    google: "gemini-pro",
    siliconflow: "Qwen/Qwen2-72B-Instruct",
  };
  return models[provider] || models.openai;
}
