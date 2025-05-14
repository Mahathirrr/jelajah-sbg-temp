// src/app/akomodasi/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export default async function AkomodasiPage() {
  // Fetch accommodations pada server side
  const accommodations = await prisma.accommodation.findMany({
    where: { available: true },
    orderBy: { createdAt: 'desc' }
  })

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Akomodasi di Sabang
          </h1>
          <p className="text-xl text-gray-600">
            Temukan tempat menginap terbaik untuk liburan Anda
          </p>
        </div>

        {/* Accommodations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accommodations.map((accommodation: any) => (
            <Card key={accommodation.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Image Placeholder */}
              <div className="h-64 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {accommodation.name}
                  </span>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {accommodation.name}
                </CardTitle>
                <p className="text-gray-600">{accommodation.address}</p>
              </CardHeader>

              <CardContent>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {accommodation.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i: number) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
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
                    <span className="ml-2 text-gray-600">
                      {accommodation.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Fasilitas:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {accommodation.amenities.slice(0, 3).map((amenity: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {accommodation.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{accommodation.amenities.length - 3} lainnya
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatPrice(accommodation.price)}
                      </p>
                      <p className="text-sm text-gray-500">per malam</p>
                    </div>

                    <Button asChild>
                      <Link href={`/akomodasi/${accommodation.id}`}>
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {accommodations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Belum ada akomodasi tersedia
            </p>
          </div>
        )}
      </div>
    </div>
  )
}