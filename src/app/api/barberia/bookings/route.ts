import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { SERVICES, BARBERS } from "@/lib/barberia/config"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { service, barber, date, time, name, email, phone, notes } = body

    if (!service || !barber || !date || !time || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const svc = SERVICES.find((s) => s.id === service)
    const brb = BARBERS.find((b) => b.slug === barber)

    const booking = await prisma.barberiaBooking.create({
      data: {
        service,
        serviceName: svc?.name.en ?? service,
        barber,
        barberName: brb?.name.en ?? barber,
        date,
        time,
        name,
        email,
        phone,
        notes: notes || "",
      },
    })

    return NextResponse.json({ success: true, booking })
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
