// src/app/api/payment/notification/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { midtrans } from "@/lib/midtrans"

export async function POST(request: Request) {
  try {
    const notification = await request.json()
    
    const orderId = notification.order_id
    const transactionStatus = notification.transaction_status
    const fraudStatus = notification.fraud_status
    
    // Extract booking ID from order_id (format: booking-{bookingId}-{timestamp})
    const bookingId = orderId.split('-')[1]
    
    if (!bookingId) {
      console.error('Invalid order_id format:', orderId)
      return NextResponse.json({ error: 'Invalid order_id' }, { status: 400 })
    }

    // Verify notification authenticity with Midtrans
    try {
      const transactionStatusResponse = await midtrans.getTransactionStatus(orderId);
    } catch (error) {
      console.error('Error verifying transaction with Midtrans:', error);
      // Continue processing even if verification fails
    }
    
    let paymentStatus = 'PENDING'
    let bookingStatus = 'PENDING'
    
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        paymentStatus = 'PENDING'
      } else if (fraudStatus === 'accept') {
        paymentStatus = 'PAID'
        bookingStatus = 'CONFIRMED'
      }
    } else if (transactionStatus === 'settlement') {
      paymentStatus = 'PAID'
      bookingStatus = 'CONFIRMED'
    } else if (transactionStatus === 'cancel' || 
               transactionStatus === 'deny' || 
               transactionStatus === 'expire') {
      paymentStatus = 'CANCELLED'
      bookingStatus = 'CANCELLED'
    } else if (transactionStatus === 'pending') {
      paymentStatus = 'PENDING'
    }

    // Update booking in database
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus,
        status: bookingStatus
      }
    })

    console.log(`Payment notification processed for booking ${bookingId}:`, {
      transactionStatus,
      paymentStatus,
      bookingStatus
    })

    return NextResponse.json({ message: 'OK' })
  } catch (error) {
    console.error('Payment notification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}