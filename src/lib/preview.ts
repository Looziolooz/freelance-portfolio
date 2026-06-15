// Dev-only paywall bypass. In development every tier is viewable, so you can
// review gated SUPPORTER/PRO guides without a membership. Production stays gated
// unless you explicitly opt in with NEXT_PUBLIC_PREVIEW_UNLOCK_ALL=1 (e.g. on a
// private staging site). Works on both server (API route) and client (it only
// reads process.env, which Next inlines in both).
export function isPreviewUnlockAll(): boolean {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_PREVIEW_UNLOCK_ALL === "1"
  );
}
