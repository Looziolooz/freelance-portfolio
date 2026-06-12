import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireBarberiaAdmin } from "@/lib/barberia/auth"

export async function GET() {
  try {
    await requireBarberiaAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const products = await prisma.barberiaProduct.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ products })
}

export async function POST(req: NextRequest) {
  try {
    await requireBarberiaAdmin()
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const product = await prisma.barberiaProduct.create({
      data: {
        name: body.name,
        category: body.category,
        price: parseFloat(body.price),
        image: body.image || "",
        description: body.description || "",
        stock: parseInt(body.stock) || 0,
        threshold: parseInt(body.threshold) || 5,
      },
    })
    return NextResponse.json({ success: true, product })
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
