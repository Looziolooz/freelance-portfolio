import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

// Swappable, provider-agnostic LLM layer for the on-site agents.
// Non-streaming on purpose: collecting the full reply lets us fall back from
// Anthropic to OpenAI on error (impossible once a stream has started). Keys are
// read lazily and the module fails closed when none is configured.

export type LLMRole = "user" | "assistant";

export interface LLMMessage {
  role: LLMRole;
  content: string;
}

export type LLMProviderName = "anthropic" | "openai";

export interface CompleteParams {
  /** Full system prompt (identity + language directive + portfolio context). */
  system: string;
  /** Conversation turns, oldest-first, starting with a "user" turn. */
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
  /** Forwarded to the SDK so a client disconnect cancels the upstream call. */
  signal?: AbortSignal;
}

/** No API key for the resolved provider — fail closed, surfaces as 503 upstream. */
export class LLMConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMConfigError";
  }
}

/** The upstream provider call failed (network / 4xx / 5xx). */
export class LLMProviderError extends Error {
  constructor(
    message: string,
    readonly provider: LLMProviderName,
    readonly status?: number,
  ) {
    super(message);
    this.name = "LLMProviderError";
  }
}

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
const DEFAULT_MAX_TOKENS = 800;
const DEFAULT_TEMPERATURE = 0.6;

function hasKey(provider: LLMProviderName): boolean {
  return provider === "anthropic"
    ? Boolean(process.env.ANTHROPIC_API_KEY)
    : Boolean(process.env.OPENAI_API_KEY);
}

/** Pick the active provider: explicit LLM_PROVIDER, else Anthropic, else OpenAI. */
export function resolveProvider(): LLMProviderName {
  const forced = process.env.LLM_PROVIDER as LLMProviderName | undefined;
  if (forced === "anthropic" || forced === "openai") {
    if (!hasKey(forced)) {
      throw new LLMConfigError(`LLM_PROVIDER=${forced} but its API key is missing`);
    }
    return forced;
  }
  if (hasKey("anthropic")) return "anthropic";
  if (hasKey("openai")) return "openai";
  throw new LLMConfigError(
    "No LLM API key configured (set ANTHROPIC_API_KEY or OPENAI_API_KEY)",
  );
}

function fallbackOf(provider: LLMProviderName): LLMProviderName | null {
  const other: LLMProviderName = provider === "anthropic" ? "openai" : "anthropic";
  return hasKey(other) ? other : null;
}

function statusOf(e: unknown): number | undefined {
  if (e && typeof e === "object" && "status" in e) {
    const s = (e as { status: unknown }).status;
    if (typeof s === "number") return s;
  }
  return undefined;
}

function messageOf(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

/** A client-disconnect / cancellation, not a provider failure. */
function isAbortError(e: unknown): boolean {
  return e instanceof Error && (e.name === "AbortError" || e.name === "APIUserAbortError");
}

/** Only transient failures are worth retrying on the other provider. */
function isRetryable(status?: number): boolean {
  // No status = network/timeout; 429 = rate limited; 5xx = upstream. NOT 4xx.
  return status === undefined || status === 429 || status >= 500;
}

async function callAnthropic(params: CompleteParams): Promise<string> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  try {
    const msg = await client.messages.create(
      {
        model: ANTHROPIC_MODEL,
        max_tokens: params.maxTokens ?? DEFAULT_MAX_TOKENS,
        temperature: params.temperature ?? DEFAULT_TEMPERATURE,
        system: params.system,
        messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
      },
      { signal: params.signal },
    );
    return msg.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();
  } catch (e) {
    if (isAbortError(e)) throw e;
    throw new LLMProviderError(messageOf(e), "anthropic", statusOf(e));
  }
}

async function callOpenAI(params: CompleteParams): Promise<string> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const res = await client.chat.completions.create(
      {
        model: OPENAI_MODEL,
        max_tokens: params.maxTokens ?? DEFAULT_MAX_TOKENS,
        temperature: params.temperature ?? DEFAULT_TEMPERATURE,
        messages: [
          { role: "system", content: params.system },
          ...params.messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      },
      { signal: params.signal },
    );
    return (res.choices[0]?.message?.content ?? "").trim();
  } catch (e) {
    if (isAbortError(e)) throw e;
    throw new LLMProviderError(messageOf(e), "openai", statusOf(e));
  }
}

function callProvider(provider: LLMProviderName, params: CompleteParams): Promise<string> {
  return provider === "anthropic" ? callAnthropic(params) : callOpenAI(params);
}

/**
 * Complete a prompt. Resolves the provider from env, and on a provider error
 * transparently retries with the other provider when its key is present.
 * Returns the text plus the provider that actually answered.
 */
export async function complete(
  params: CompleteParams,
): Promise<{ text: string; provider: LLMProviderName }> {
  const primary = resolveProvider();
  try {
    return { text: await callProvider(primary, params), provider: primary };
  } catch (e) {
    const fb = fallbackOf(primary);
    if (fb && e instanceof LLMProviderError && isRetryable(e.status)) {
      return { text: await callProvider(fb, params), provider: fb };
    }
    throw e;
  }
}
