import { NextRequest } from "next/server";
import { success, error } from "@/lib/api-response";

// Lead delivery to hello@looz.design via Resend (https://resend.com).
// Resend is the chosen transport because Brevo blocks every key (API and SMTP)
// by IP address, which cannot work from Vercel's serverless functions. Resend
// has no IP allowlisting and is free on the hobby plan.
//
// Requirements: the sending domain (looz.design) must be verified in Resend and
// its DNS records live in the Vercel zone, or Resend rejects the send. replyTo
// is the lead's own address, so replying to the notification goes straight back
// to the person who asked.
const RESEND_KEY = process.env.RESEND_API_KEY;
const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL ?? "hello@looz.design";

export async function POST(req: NextRequest) {
  try {
    if (!RESEND_KEY) return error("Email backend not configured", 501);

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return error("Invalid JSON", 400);
    }

    // Honeypot: real visitors never see the field, so any value is a bot.
    if (body.honey) return error("Spam rejected", 400);

    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const text = typeof body.message === "string" ? body.message.trim() : "";
    const replyto = typeof body.replyto === "string" ? body.replyto.trim() : "";
    const fromName =
      typeof body.from_name === "string" && body.from_name.trim() ? body.from_name.trim() : "Lead dal sito";

    if (!subject || !text) return error("Missing subject or message", 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyto)) return error("Invalid reply address", 400);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `LOoz.design <${SENDER_EMAIL}>`,
        to: [SENDER_EMAIL],
        reply_to: `${fromName} <${replyto}>`,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Resend lead send failed:", res.status, detail.slice(0, 300));
      return error("Delivery failed", 502);
    }

    return success({ ok: true });
  } catch (e) {
    console.error("Lead endpoint error:", e);
    return error("Internal server error", 500);
  }
}