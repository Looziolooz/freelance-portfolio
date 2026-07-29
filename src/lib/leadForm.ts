// Free, backend-less lead delivery via Web3Forms: the form POSTs here and the key
// owner gets an email per submission (no server, no database). The access key is
// PUBLIC by design — that's how Web3Forms works — so it lives in a NEXT_PUBLIC env.
//
// Setup (30s, free): create a key at https://web3forms.com with your email, then
// set NEXT_PUBLIC_WEB3FORMS_KEY (in .env.local and on Vercel). Until it's set, the
// forms fall back to a mailto so no lead is ever lost.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

/** True when a real email backend is configured (else callers use the mailto fallback). */
export const hasLeadBackend = Boolean(WEB3FORMS_KEY);

/**
 * Send a lead to the inbox. Returns true on success; false means "not configured
 * or failed" — the caller should fall back to a mailto so nothing is dropped.
 */
export async function submitLead(fields: Record<string, string>): Promise<boolean> {
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
