import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { success, error } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return error("Email and password are required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return error("Invalid email or password", 401);
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return error("Invalid email or password", 401);
    }

    const token = await createSession({
      id: user.id,
      email: user.email,
      tier: user.tier,
    });
    await setSessionCookie(token);

    return success({
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
    });
  } catch (e) {
    console.error("Login error:", e);
    return error("Internal server error", 500);
  }
}
