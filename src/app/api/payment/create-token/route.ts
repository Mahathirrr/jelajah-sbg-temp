// src/app/api/payment/create-token/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { midtrans } from "@/lib/midtrans"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      )
    }

    // Fetch booking details
    const booking = await prisma.booking.findUnique({
      where: { 
        id: bookingId,
        userId: (session.user as any).id
      },
      include: {
        accommodation: {
          select: {
            name: true,
            address: true
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    if (booking.paymentStatus === 'PAID') {
      return NextResponse.json(
        { error: "Booking already paid" },
        { status: 400 }
      )
    }

    // Prepare Midtrans transaction data
    const transactionDetails = {
      order_id: `booking-${booking.id}-${Date.now()}`,
      gross_amount: booking.totalPrice
    }

    const customerDetails = {
      first_name: booking.user.name || '',
      email: booking.user.email || '',
      phone: booking.user.phone || ''
    }

    const itemDetails = [
      {
        id: booking.accommodation.name.toLowerCase().replace(/\s+/g, '-'),
        price: booking.totalPrice,
        quantity: 1,
        name: `Booking: ${booking.accommodation.name}`,
        category: "accommodation"
      }
    ]

    const parameter = {
      transaction_details: transactionDetails,
      customer_details: customerDetails,
      item_details: itemDetails,
      credit_card: {
        secure: true
      },
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL}/booking/${booking.id}/success`
      }
    }

    // Create transaction token
    try {
      const token = await midtrans.createTransaction(parameter);
      
      // Update booking with payment token
      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentToken: token }
      });

      return NextResponse.json({ token });
    } catch (midtransError) {
      console.error("Midtrans error:", midtransError);
      return NextResponse.json(
        { error: "Failed to create payment token with Midtrans" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Payment token creation error:", error)
    return NextResponse.json(
      { error: "Failed to create payment token" },
      { status: 500 }
    )
  }
}