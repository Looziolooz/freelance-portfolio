import { NextResponse } from "next/server"
import { clearBarberiaSession } from "@/lib/barberia/auth"

export async function POST() {
  await clearBarberiaSession()
  return NextResponse.json({ success: true })
}
