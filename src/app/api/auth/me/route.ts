import { getSession, clearSessionCookie } from "@/lib/auth";
import { success, error } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      // Logged-out is a normal state, not an error — return 200 with a null user
      // so the browser doesn't log a 401 to the console (AuthProvider reads
      // `data` and treats null as "no user").
      return success(null);
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
