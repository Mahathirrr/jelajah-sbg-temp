// src/app/api/accommodations/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const accommodation = await prisma.accommodation.findUnique({
      where: { id: params.id },
      include: {
        bookings: {
          where: {
            OR: [
              { status: "CONFIRMED" },
              { status: "PENDING" }
            ]
          },
          select: {
            checkIn: true,
            checkOut: true
          }
        }
      }
    })

    if (!accommodation) {
      return NextResponse.json(
        { error: "Accommodation not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ accommodation })
  } catch (error) {
    console.error("Error fetching accommodation:", error)
    return NextResponse.json(
      { error: "Failed to fetch accommodation" },
      { status: 500 }
    )
  }
}