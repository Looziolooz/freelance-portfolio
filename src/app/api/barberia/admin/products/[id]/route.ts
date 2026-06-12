import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireBarberiaAdmin } from "@/lib/barberia/auth"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireBarberiaAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const data: Record<string, unknown> = { ...body }
    if (body.price) data.price = parseFloat(body.price)
    if (body.stock) data.stock = parseInt(body.stock)
    if (body.threshold) data.threshold = parseInt(body.threshold)

    const product = await prisma.barberiaProduct.update({
      where: { id },
      data,
    })
    return NextResponse.json({ success: true, product })
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireBarberiaAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.barberiaProduct.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
