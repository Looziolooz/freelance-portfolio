// Free, backend-less lead delivery. The forms POST to the in-house /api/lead
// route (Resend), which emails the lead to hello@looz.design.
// If that fails (no key, network error) it falls back to Web3Forms when a key is
// configured, then to a mailto so no lead is ever lost.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

// No hasLeadBackend export any more, and not by accident: this file runs in
// CLIENT components, where a server-only env like RESEND_API_KEY is always
// undefined, so a flag reading it would say "not configured" forever no matter
// what is set on Vercel. Whether the backend exists is answered at runtime:
// /api/lead replies 501 when unconfigured, submitLead returns false, and the
// caller falls back to mailto. Nothing is lost either way.

/**
 * Send a lead to the inbox. Returns true on success; false means "not configured
 * or failed" — the caller should fall back to a mailto so nothing is dropped.
 */
export async function submitLead(fields: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    if (res.ok) return true;
  } catch {
    // fall through to the Web3Forms path
  }

  if (!WEB3FORMS_KEY) return false;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...fields }),
    });
    const data = await res.json().catch(() => null);
    return Boolean(data?.success);
  } catch {
    return false;
  }
}
