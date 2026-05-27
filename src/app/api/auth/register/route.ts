import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession, setSessionCookie } from "@/lib/auth";
import { success, error } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return error("Email and password are required");
    }

    if (password.length < 6) {
      return error("Password must be at least 6 characters");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return error("Email already registered", 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name: name || null },
    });

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
    }, 201);
  } catch (e) {
    console.error("Register error:", e);
    return error("Internal server error", 500);
  }
}
