import { NextRequest, NextResponse } from "next/server";
import { error, success } from "@/lib/api-response";
import { complete, LLMConfigError, LLMProviderError } from "@/lib/llm";
import { buildAgentContext } from "@/lib/agent-context";
import {
  AGENT_MAX_INPUT_CHARS,
  buildSystemPrompt,
  normalizeAgentType,
  toConversation,
} from "@/lib/agent-prompts";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import type { Lang } from "@/generated/prisma/client";

// Native in-process replacement for the Python/Flask agent backend (localhost:5001).
// Node runtime is mandatory: Prisma (better-sqlite3 native addon) cannot run on Edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function coerceLang(raw: unknown): Lang {
  const s = typeof raw === "string" ? raw.toUpperCase() : "IT";
  return (["IT", "EN", "SV"].includes(s) ? s : "IT") as Lang;
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ type: string }> },
) {
  try {
    const { type } = await ctx.params;
    const agent = normalizeAgentType(type);
    if (!agent) return error("Unknown agent", 404);

    // Abuse / cost control before any model call.
    const rl = rateLimit(`agent:${getClientIp(req)}`);
    if (!rl.ok) {
      const retryAfter = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded" },
        { status: 429, headers: { "Retry-After": String(retryAfter) } },
      );
    }

    let body: { message?: unknown; lang?: unknown; history?: unknown };
    try {
      body = await req.json();
    } catch {
      return error("Invalid request body", 400);
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message) return error("Message required", 400);
    if (message.length > AGENT_MAX_INPUT_CHARS) return error("Message too long", 400);

    const lang = coerceLang(body.lang);
    // Pass the message so the context is retrieved around what they actually
    // asked (curated KB + live catalog), not a generic dump.
    const contextBlock = await buildAgentContext(lang, message);
    const system = buildSystemPrompt(agent, lang, contextBlock);

    const { text, provider } = await complete({
      system,
      // Pass the recent exchange so replies have continuity, not a cold restart.
      messages: toConversation(body.history, message),
      temperature: 0.75,
      signal: req.signal,
    });

    if (!text) return error("Agent returned an empty response", 502);
    return success({ response: text, agent, provider });
  } catch (e) {
    // Client disconnected mid-request (closed tab / navigated away / new send).
    // Not an error — don't log it as a provider outage or bill a fallback.
    if (
      req.signal.aborted ||
      (e instanceof Error && (e.name === "AbortError" || e.name === "APIUserAbortError"))
    ) {
      return new NextResponse(null, { status: 499 });
    }
    // Never surface provider error text/keys to the client; log server-side only.
    if (e instanceof LLMConfigError) {
      console.error("Agent LLM not configured:", e.message);
      return error("AI is not configured", 503);
    }
    if (e instanceof LLMProviderError) {
      console.error("Agent LLM provider error:", e.provider, e.status, e.message);
      return error("Agent temporarily unavailable", 502);
    }
    console.error("Agent route error:", e);
    return error("Internal server error", 500);
  }
}

export async function GET() {
  return error("Method not allowed", 405);
}
