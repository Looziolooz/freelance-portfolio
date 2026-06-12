import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { SERVICES, BARBERIA_HOURS, getDayKey, generateTimeSlots } from "@/lib/barberia/config"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")
  const serviceId = searchParams.get("service")
  const barber = searchParams.get("barber")

  if (!date || !serviceId) {
    return NextResponse.json({ error: "Missing date or service" }, { status: 400 })
  }

  const service = SERVICES.find((s) => s.id === serviceId)
  if (!service) return NextResponse.json({ error: "Invalid service" }, { status: 400 })

  const dayKey = getDayKey(new Date(date))
  const hours = BARBERIA_HOURS[dayKey as keyof typeof BARBERIA_HOURS]
  if (!hours) return NextResponse.json({ slots: [] })

  const allSlots = generateTimeSlots(hours, service.duration)

  const existing = await prisma.barberiaBooking.findMany({
    where: { date, status: { not: "cancelled" }, ...(barber && barber !== "any" ? { barber } : {}) },
    select: { time: true },
  })

  const bookedTimes = new Set(existing.map((b) => b.time))
  const slots = allSlots.filter((t) => !bookedTimes.has(t))

  return NextResponse.json({ slots })
}
