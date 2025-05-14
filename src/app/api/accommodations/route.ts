// src/app/api/accommodations/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const accommodations = await prisma.accommodation.findMany({
      where: { available: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ accommodations })
  } catch (error) {
    console.error("Error fetching accommodations:", error)
    return NextResponse.json(
      { error: "Failed to fetch accommodations" },
      { status: 500 }
    )
  }
}