// src/components/BookingForm.tsx
"use client"
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface BookingFormProps {
  accommodation: {
    id: string
    name: string
    price: number
  }
  existingBookings: {
    checkIn: Date
    checkOut: Date
  }[]
}

export default function BookingForm({ accommodation, existingBookings }: BookingFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guestCount: 1
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'guestCount' ? parseInt(value) || 1 : value
    }))
  }

  const calculateNights = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0
    
    const checkIn = new Date(bookingData.checkIn)
    const checkOut = new Date(bookingData.checkOut)
    const diffTime = checkOut.getTime() - checkIn.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays > 0 ? diffDays : 0
  }

  const calculateTotalPrice = () => {
    const nights = calculateNights()
    return nights * accommodation.price
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const isDateAvailable = (checkIn: string, checkOut: string) => {
    const newCheckIn = new Date(checkIn)
    const newCheckOut = new Date(checkOut)
    
    // Check against existing bookings
    return !existingBookings.some((booking: any) => {
      const existingCheckIn = new Date(booking.checkIn)
      const existingCheckOut = new Date(booking.checkOut)
      
      // Check if dates overlap
      return (newCheckIn < existingCheckOut && newCheckOut > existingCheckIn)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session || !session.user) {
      router.push('/auth/signin')
      return
    }

    setIsLoading(true)
    setError('')

    // Validation
    if (!bookingData.checkIn || !bookingData.checkOut) {
      setError('Please select check-in and check-out dates')
      setIsLoading(false)
      return
    }

    const checkInDate = new Date(bookingData.checkIn)
    const checkOutDate = new Date(bookingData.checkOut)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (checkInDate < today) {
      setError('Check-in date cannot be in the past')
      setIsLoading(false)
      return
    }

    if (checkOutDate <= checkInDate) {
      setError('Check-out date must be after check-in date')
      setIsLoading(false)
      return
    }

    if (!isDateAvailable(bookingData.checkIn, bookingData.checkOut)) {
      setError('Selected dates are not available')
      setIsLoading(false)
      return
    }

    const nights = calculateNights()
    if (nights <= 0) {
      setError('Invalid date selection')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accommodationId: accommodation.id,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guestCount: bookingData.guestCount,
          totalPrice: calculateTotalPrice()
        })
      })

      const result = await response.json()

      if (response.ok) {
        // Redirect to payment
        router.push(`/booking/${result.booking.id}/payment`)
      } else {
        setError(result.error || 'Booking failed')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const nights = calculateNights()
  const totalPrice = calculateTotalPrice()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking {accommodation.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="checkIn">Check-in Date</Label>
            <Input
              id="checkIn"
              name="checkIn"
              type="date"
              value={bookingData.checkIn}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="checkOut">Check-out Date</Label>
            <Input
              id="checkOut"
              name="checkOut"
              type="date"
              value={bookingData.checkOut}
              onChange={handleInputChange}
              min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="guestCount">Number of Guests</Label>
            <Input
              id="guestCount"
              name="guestCount"
              type="number"
              min="1"
              max="10"
              value={bookingData.guestCount}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>

          {/* Booking Summary */}
          {nights > 0 && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>{formatPrice(accommodation.price)} x {nights} night{nights > 1 ? 's' : ''}</span>
                <span>{formatPrice(accommodation.price * nights)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total</span>
                <span className="text-blue-600">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || nights <= 0}
            className="w-full"
          >
            {isLoading ? 'Processing...' : session ? 'Book Now' : 'Login to Book'}
          </Button>

          {!session && (
            <p className="text-sm text-gray-500 text-center">
              Please log in to make a booking
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}