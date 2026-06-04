import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("allows up to the limit, then blocks", () => {
    expect(rateLimit("rl-a", 3, 60_000)).toMatchObject({ ok: true, remaining: 2 });
    expect(rateLimit("rl-a", 3, 60_000)).toMatchObject({ ok: true, remaining: 1 });
    expect(rateLimit("rl-a", 3, 60_000)).toMatchObject({ ok: true, remaining: 0 });
    const blocked = rateLimit("rl-a", 3, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("isolates separate keys", () => {
    expect(rateLimit("rl-b", 1, 60_000).ok).toBe(true);
    expect(rateLimit("rl-b", 1, 60_000).ok).toBe(false);
    expect(rateLimit("rl-c", 1, 60_000).ok).toBe(true);
  });

  it("opens a fresh window after the previous one expires", async () => {
    expect(rateLimit("rl-d", 1, 1).ok).toBe(true);
    await new Promise((r) => setTimeout(r, 5));
    expect(rateLimit("rl-d", 1, 1).ok).toBe(true);
  });
});

describe("getClientIp", () => {
  it("uses the first x-forwarded-for entry", () => {
    const req = new NextRequest("http://localhost/", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to 'unknown' with no proxy headers", () => {
    const req = new NextRequest("http://localhost/");
    expect(getClientIp(req)).toBe("unknown");
  });
});
