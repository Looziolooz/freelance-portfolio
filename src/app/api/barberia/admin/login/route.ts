import { NextRequest, NextResponse } from "next/server"
import { verifyBarberiaPassword, createBarberiaSession, setBarberiaSession } from "@/lib/barberia/auth"

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 })
    }

    const valid = await verifyBarberiaPassword(password)
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const token = await createBarberiaSession()
    await setBarberiaSession(token)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
