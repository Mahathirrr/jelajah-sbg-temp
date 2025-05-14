'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useEffect } from 'react'

export default function HomePage() {
  // Efek untuk debugging Tailwind
  useEffect(() => {
    console.log('Page loaded - checking Tailwind styles');
  }, []);

  return (
    <div className="font-sans">
      {/* Hero Section dengan Video Background */}
      <section className="relative h-screen">
        {/* Gunakan video statis yang dihosting di folder publik untuk menghindari masalah CORS */}
        <div className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('https://mediaim.expedia.com/destination/2/c7219add92583f48cd9a2e1baa479e6b.jpg')" }}>
          {/* Background fallback sudah ada di sini */}
        </div>

        {/* Atau tetap gunakan video dengan sumber yang lebih dapat diandalkan */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://mediaim.expedia.com/destination/2/c7219add92583f48cd9a2e1baa479e6b.jpg"
        >
          {/* Video yang lebih relevan tentang Sabang */}
          <source
            src="https://www.youtube.com/embed/NQZdj3JIk_E"
            type="video/mp4"
          />
          <source
            src="https://www.youtube.com/embed/lA_afSXyjzo"
            type="video/mp4"
          />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <motion.div
              className="text-white max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Jelajahi Keindahan Sabang
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
                Temukan pesona alam bawah laut, pantai eksotis, dan warisan sejarah di ujung barat Indonesia
              </p>
              <div className="space-x-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  <Link href="/akomodasi">Booking Sekarang</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/20 px-6 py-3 rounded-lg font-medium"
                >
                  <Link href="/destinasi">Lihat Destinasi</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Destinasi Unggulan
            </h2>
            <p className="text-xl text-gray-600">
              Temukan keindahan tersembunyi di setiap sudut Sabang
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Pantai Iboih",
                description: "Pantai dengan air jernih, terumbu karang berwarna-warni, dan spot snorkeling terbaik di Sabang",
                image: "https://www.safariwisata.co.id/wp-content/uploads/2021/02/Pantai-Iboih-Sabang-7.jpg"
              },
              {
                title: "Kilometer Nol",
                description: "Monumen ikonik di ujung barat Indonesia dengan pemandangan Samudera Hindia yang menakjubkan",
                image: "https://cdn.antaranews.com/cache/1200x800/2019/11/23/D8A59EEB-434E-4CEC-BD92-0642AC3B587B.jpeg"
              },
              {
                title: "Benteng Anoi Itam",
                description: "Peninggalan sejarah Perang Dunia II dengan panorama laut yang memukau",
                image: "https://asset.kompas.com/crops/311VBTCU_Nh3SfIiNWdmKG770F0=/0x49:1600x1116/1200x800/data/photo/2023/09/23/650f032637023.jpeg"
              }
            ].map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden group cursor-pointer border rounded-lg shadow-md">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{destination.title}</h3>
                      <p className="text-gray-200">{destination.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Accommodations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Akomodasi Pilihan
            </h2>
            <p className="text-xl text-gray-600">
              Nikmati kenyamanan menginap dengan pemandangan laut dan gunung yang memukau
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sabang Beach Resort",
                description: "Resort mewah dengan akses langsung ke pantai dan fasilitas lengkap untuk keluarga",
                price: "Rp 650.000",
                image: "https://media-cdn.tripadvisor.com/media/photo-s/2d/1a/bc/95/drone-shot-of-daluyon.jpg"
              },
              {
                name: "Iboih Inn",
                description: "Penginapan tradisional dengan suasana alami dekat Pantai Iboih dan Pulau Rubiah",
                price: "Rp 250.000",
                image: "https://media-cdn.tripadvisor.com/media/photo-s/0c/8f/fc/c9/iboih-inn.jpg"
              },
              {
                name: "Kilometer Nol Hotel",
                description: "Hotel modern di pusat kota dengan pemandangan panorama Selat Malaka",
                price: "Rp 450.000",
                image: "https://media-cdn.tripadvisor.com/media/photo-s/10/59/5a/d8/photo2jpg.jpg"
              }
            ].map((accommodation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border rounded-lg">
                  <div className="relative h-64">
                    <img
                      src={accommodation.image}
                      alt={accommodation.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{accommodation.name}</h3>
                    <p className="text-gray-600 mb-4">{accommodation.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">{accommodation.price}/malam</span>
                      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                        <Link href="/akomodasi">Book Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Sabang */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Mengapa Pilih Sabang?
            </h2>
            <p className="text-xl text-gray-600">
              Temukan keunikan Pulau Weh yang menjadikannya destinasi impian
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Surga Bawah Laut",
                description: "Terumbu karang berwarna-warni, berbagai spesies ikan langka, dan kejernihan air yang mencapai 15-20 meter menjadikannya surga bagi penyelam",
                icon: "🐠"
              },
              {
                title: "Titik Nol Indonesia",
                description: "Menjadi saksi keindahan Monumen Kilometer Nol yang menandai ujung barat wilayah NKRI dengan pemandangan laut lepas yang menakjubkan",
                icon: "🗿"
              },
              {
                title: "Wisata Sejarah dan Budaya",
                description: "Nikmati keramahan masyarakat lokal, santap kuliner khas Aceh, dan jelajahi peninggalan bersejarah dari Perang Dunia II",
                icon: "🏺"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-block p-4 rounded-full bg-blue-100 mb-6">
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}