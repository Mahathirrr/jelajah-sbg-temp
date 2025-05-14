// src/components/PaymentComponent.tsx
"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PaymentComponentProps {
  booking: {
    id: string
    totalPrice: number
    paymentStatus: string
    accommodation: {
      name: string
    }
  }
}

declare global {
  interface Window {
    snap: any;
  }
}

export default function PaymentComponent({ booking }: PaymentComponentProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSnapLoaded, setIsSnapLoaded] = useState(false)

  // Load Midtrans Snap script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '')
    script.onload = () => setIsSnapLoaded(true)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handlePayment = async () => {
    if (!isSnapLoaded) {
      setError('Payment system is still loading. Please try again.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Create payment token
      const response = await fetch('/api/payment/create-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create payment')
      }

      // Open Midtrans Snap
      window.snap.pay(result.token, {
        onSuccess: function(result: any) {
          console.log('Payment success:', result)
          router.push(`/booking/${booking.id}/success`)
        },
        onPending: function(result: any) {
          console.log('Payment pending:', result)
          router.push(`/booking/${booking.id}/pending`)
        },
        onError: function(result: any) {
          console.log('Payment error:', result)
          setError('Payment failed. Please try again.')
        },
        onClose: function() {
          console.log('Payment popup closed')
        }
      })
    } catch (error) {
      console.error('Payment error:', error)
      setError(error instanceof Error ? error.message : 'Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (booking.paymentStatus === 'PAID') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Payment Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your booking for {booking.accommodation.name} has been confirmed.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              View My Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Payment Details</h3>
            <p className="text-blue-800">
              Amount to pay: <span className="font-bold">{formatPrice(booking.totalPrice)}</span>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Supported Payment Methods:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>• Credit/Debit Card</div>
              <div>• Bank Transfer</div>
              <div>• E-Wallet (GoPay, OVO, Dana)</div>
              <div>• Virtual Account</div>
            </div>
          </div>

          <Button
            onClick={handlePayment}
            disabled={isLoading || !isSnapLoaded}
            className="w-full"
            size="lg"
          >
            {isLoading 
              ? 'Processing...' 
              : !isSnapLoaded 
              ? 'Loading Payment System...' 
              : `Pay ${formatPrice(booking.totalPrice)}`
            }
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Powered by Midtrans - Your payment is secured with 256-bit SSL encryption
          </p>
        </div>
      </CardContent>
    </Card>
  )
}