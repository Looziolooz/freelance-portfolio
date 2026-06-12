import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
)

const COOKIE_NAME = "barberia_admin"

export async function verifyBarberiaPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.BARBERIA_ADMIN_PASSWORD || "barberia123"
  return password === adminPassword
}

export async function createBarberiaSession(): Promise<string> {
  return await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET)
}

export async function setBarberiaSession(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/barberia",
  })
}

export async function clearBarberiaSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getBarberiaSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  try {
    await jwtVerify(token, SECRET)
    return true
  } catch {
    return false
  }
}

export async function requireBarberiaAdmin(): Promise<void> {
  const authed = await getBarberiaSession()
  if (!authed) throw new Error("Unauthorized")
}
