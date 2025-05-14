// src/app/akomodasi/[id]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BookingForm from '@/components/BookingForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PageProps {
  params: { id: string }
}

export default async function AccommodationDetailPage({ params }: PageProps) {
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
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Accommodation Details */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-8 relative">
              <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                <h1 className="text-4xl font-bold text-white text-center">
                  {accommodation.name}
                </h1>
              </div>
            </div>

            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Detail Akomodasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informasi Umum</h3>
                  <p className="text-gray-700 mb-2">{accommodation.description}</p>
                  <p className="text-gray-600">
                    <strong>Alamat:</strong> {accommodation.address}
                  </p>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rating</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(accommodation.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-lg font-semibold">
                      {accommodation.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Fasilitas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {accommodation.amenities.map((amenity: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-gray-700"
                      >
                        <svg
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="border-t pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {formatPrice(accommodation.price)}
                    </p>
                    <p className="text-gray-500">per malam</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingForm 
                accommodation={accommodation}
                existingBookings={accommodation.bookings}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}