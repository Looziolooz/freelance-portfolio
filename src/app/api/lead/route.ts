import { NextRequest } from "next/server";
import { success, error } from "@/lib/api-response";
import { leadEmailHtml } from "@/lib/email-template";

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
// Where the notification actually lands. Defaulting to hello@ meant every lead
// took the long way round: Resend sends AS hello@ TO hello@, ImprovMX catches
// it and forwards to Gmail. That forwarding hop is the fragile link (same
// domain as sender and recipient, a re-delivery Gmail loves to junk or drop),
// and it is where "the form says Ricevuto but no mail arrives" lived. With
// LEAD_TO_EMAIL set to the real mailbox, Resend delivers direct with its own
// DKIM and no forward in between.
const TO_EMAIL = process.env.LEAD_TO_EMAIL ?? SENDER_EMAIL;

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
        to: [TO_EMAIL],
        reply_to: `${fromName} <${replyto}>`,
        subject,
        // Both parts on purpose: html is the branded card, text keeps the mail
        // readable in clients that strip it and keeps spam scores honest.
        text,
        html: leadEmailHtml({ subject, message: text, replyto, fromName }),
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