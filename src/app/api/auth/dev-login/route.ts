import { createSession, setSessionCookie } from "@/lib/auth";
import { isPreviewUnlockAll } from "@/lib/preview";
import { success, error } from "@/lib/api-response";

// Dev-only convenience: log in as a throwaway PRO user without credentials, so
// gated SUPPORTER/PRO content is reviewable locally. Returns 404 in production
// (same NODE_ENV gate as the content preview). No DB user is created — the
// session JWT carries the tier and /api/auth/me reads straight from it.
export async function POST() {
  if (!isPreviewUnlockAll()) {
    return error("Not found", 404);
  }
  const devUser = { id: "dev-preview", email: "dev@local", tier: "PRO" };
  const token = await createSession(devUser);
  await setSessionCookie(token);
  return success({ ...devUser, name: "Dev (anteprima)" });
}
