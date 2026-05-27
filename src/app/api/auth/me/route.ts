import { getSession, clearSessionCookie } from "@/lib/auth";
import { success, error } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return error("Not authenticated", 401);
    }
    return success({
      id: session.userId,
      email: session.email,
      tier: session.tier,
    });
  } catch (e) {
    console.error("Me error:", e);
    return error("Internal server error", 500);
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return success({ message: "Logged out" });
}
