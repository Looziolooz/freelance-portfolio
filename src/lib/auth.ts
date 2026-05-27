import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
);

const COOKIE_NAME = "session";

export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  tier: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: {
  id: string;
  email: string;
  tier: string;
}): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    tier: user.tier,
  } as SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);

  return token;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireTier(
  minTier: "FREE" | "SUPPORTER" | "PRO"
): Promise<SessionPayload> {
  const session = await requireAuth();
  const tiers = { FREE: 0, SUPPORTER: 1, PRO: 2 };
  if (tiers[session.tier as keyof typeof tiers] < tiers[minTier]) {
    throw new Error("Insufficient tier");
  }
  return session;
}

export function canAccess(
  userTier: string | undefined | null,
  requiredTier: string
): boolean {
  const tiers: Record<string, number> = { FREE: 0, SUPPORTER: 1, PRO: 2 };
  return (tiers[userTier ?? "FREE"] ?? 0) >= (tiers[requiredTier] ?? 0);
}
