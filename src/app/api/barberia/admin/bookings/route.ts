import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireBarberiaAdmin } from "@/lib/barberia/auth"

export async function GET(req: NextRequest) {
  try {
    await requireBarberiaAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const date = searchParams.get("date")

  const where: Record<string, unknown> = {}
  if (status && status !== "all") where.status = status
  if (date) where.date = date

  const bookings = await prisma.barberiaBooking.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ bookings })
}
