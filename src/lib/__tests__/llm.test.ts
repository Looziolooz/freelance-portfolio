import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock both SDKs at the network boundary. vi.hoisted lets the mock factories
// reference the spies even though vi.mock is hoisted above the imports.
const { anthropicCreate, openaiCreate } = vi.hoisted(() => ({
  anthropicCreate: vi.fn(),
  openaiCreate: vi.fn(),
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = { create: anthropicCreate };
  },
}));
vi.mock("openai", () => ({
  default: class {
    chat = { completions: { create: openaiCreate } };
  },
}));

import { complete, resolveProvider, LLMConfigError, LLMProviderError } from "@/lib/llm";

beforeEach(() => {
  anthropicCreate.mockReset();
  openaiCreate.mockReset();
});

describe("resolveProvider", () => {
  it("fails closed when no API key is configured", () => {
    expect(() => resolveProvider()).toThrow(LLMConfigError);
  });

  it("prefers anthropic when its key is present", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test");
    expect(resolveProvider()).toBe("anthropic");
  });

  it("honors the LLM_PROVIDER override", () => {
    vi.stubEnv("OPENAI_API_KEY", "sk-openai-test");
    vi.stubEnv("LLM_PROVIDER", "openai");
    expect(resolveProvider()).toBe("openai");
  });
});

describe("complete", () => {
  it("returns text + provider from the primary (anthropic) and never calls the fallback", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test");
    anthropicCreate.mockResolvedValue({ content: [{ type: "text", text: "ciao" }] });

    const out = await complete({ system: "s", messages: [{ role: "user", content: "hi" }] });

    expect(out).toEqual({ text: "ciao", provider: "anthropic" });
    expect(openaiCreate).not.toHaveBeenCalled();
  });

  it("falls back to openai when anthropic errors and the openai key exists", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test");
    vi.stubEnv("OPENAI_API_KEY", "sk-openai-test");
    anthropicCreate.mockRejectedValue(Object.assign(new Error("upstream 503"), { status: 503 }));
    openaiCreate.mockResolvedValue({ choices: [{ message: { content: "hello" } }] });

    const out = await complete({ system: "s", messages: [{ role: "user", content: "hi" }] });

    expect(out).toEqual({ text: "hello", provider: "openai" });
  });

  it("rethrows a provider error when there is no fallback key", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test");
    anthropicCreate.mockRejectedValue(new Error("boom"));

    await expect(
      complete({ system: "s", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toBeInstanceOf(LLMProviderError);
    expect(openaiCreate).not.toHaveBeenCalled();
  });

  it("does NOT fall back on a non-retryable 4xx (e.g. a bad API key)", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test");
    vi.stubEnv("OPENAI_API_KEY", "sk-openai-test");
    anthropicCreate.mockRejectedValue(Object.assign(new Error("invalid api key"), { status: 401 }));

    await expect(
      complete({ system: "s", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toBeInstanceOf(LLMProviderError);
    expect(openaiCreate).not.toHaveBeenCalled();
  });

  it("propagates a client abort without wrapping it or paying a fallback", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test");
    vi.stubEnv("OPENAI_API_KEY", "sk-openai-test");
    anthropicCreate.mockRejectedValue(
      Object.assign(new Error("aborted"), { name: "APIUserAbortError" }),
    );

    await expect(
      complete({ system: "s", messages: [{ role: "user", content: "hi" }] }),
    ).rejects.toThrow("aborted");
    expect(openaiCreate).not.toHaveBeenCalled();
  });
});
