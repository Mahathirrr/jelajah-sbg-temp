// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed Destinations
  const destinations = [
    {
      name: "Pantai Iboih",
      description: "Pantai dengan air jernih dan terumbu karang yang indah, cocok untuk snorkeling dan diving.",
      image: "/images/pantai-iboih.jpg",
      location: "Iboih, Sukakarya",
      category: "pantai",
      featured: true
    },
    {
      name: "Kilometer Nol Indonesia",
      description: "Monumen bersejarah yang menandai titik paling barat Indonesia.",
      image: "/images/km-nol.jpg", 
      location: "Paloh Gadeng",
      category: "sejarah",
      featured: true
    },
    {
      name: "Pantai Sumur Tiga",
      description: "Pantai yang tenang dengan pemandangan sunset yang memukau.",
      image: "/images/sumur-tiga.jpg",
      location: "Jaboi",
      category: "pantai",
      featured: false
    },
    {
      name: "Benteng Anoi Itam",
      description: "Benteng peninggalan Belanda dengan nilai sejarah tinggi.",
      image: "/images/benteng-anoi.jpg",
      location: "Sabang",
      category: "sejarah", 
      featured: false
    }
  ]

  // Seed Culinary
  const culinaryPlaces = [
    {
      name: "Mie Aceh Sabang",
      description: "Mie Aceh khas dengan bumbu rempah yang kuat dan topping daging kambing atau seafood.",
      image: "/images/mie-aceh.jpg",
      location: "Jl. Teuku Umar",
      price: "Rp 15.000 - 25.000",
      category: "makanan khas",
      featured: true
    },
    {
      name: "Seafood Pantai Iboih",
      description: "Seafood segar langsung dari laut dengan cita rasa otentik.",
      image: "/images/seafood-iboih.jpg",
      location: "Pantai Iboih",
      price: "Rp 50.000 - 150.000",
      category: "seafood",
      featured: true
    },
    {
      name: "Kopi Gayo Sabang",
      description: "Kedai kopi dengan biji kopi Gayo premium yang diseduh tradisional.",
      image: "/images/kopi-gayo.jpg",
      location: "Pusat Kota Sabang",
      price: "Rp 8.000 - 15.000",
      category: "minuman",
      featured: false
    }
  ]

  // Seed Accommodations
  const accommodations = [
    {
      name: "Sabang Beach Resort",
      description: "Resort mewah dengan pemandangan laut langsung dan fasilitas lengkap.",
      address: "Jl. Pantai Iboih, Sukakarya",
      price: 500000,
      image: "/images/sabang-resort.jpg",
      rating: 4.5,
      amenities: ["WiFi", "AC", "Pool", "Beach Access", "Restaurant"],
      available: true
    },
    {
      name: "Iboih Inn",
      description: "Penginapan budget dengan lokasi strategis dekat pantai.",
      address: "Desa Iboih, Sukakarya", 
      price: 150000,
      image: "/images/iboih-inn.jpg",
      rating: 4.0,
      amenities: ["WiFi", "AC", "Breakfast"],
      available: true
    },
    {
      name: "Kilometer Nol Hotel",
      description: "Hotel modern di pusat kota dengan akses mudah ke berbagai tempat wisata.",
      address: "Jl. Cut Nyak Dhien, Sabang",
      price: 300000,
      image: "/images/km-nol-hotel.jpg",
      rating: 4.2,
      amenities: ["WiFi", "AC", "Gym", "Restaurant", "Meeting Room"],
      available: true
    },
    {
      name: "Gapang Beach Bungalow",
      description: "Bungalow dengan suasana alami dan pemandangan pantai.",
      address: "Pantai Gapang, Sukakarya",
      price: 200000,
      image: "/images/gapang-bungalow.jpg",
      rating: 3.8,
      amenities: ["WiFi", "Fan", "Garden View"],
      available: true
    }
  ]

  // Create records
  console.log('Seeding destinations...')
  for (const destination of destinations) {
    await prisma.destination.create({
      data: destination
    })
  }

  console.log('Seeding culinary...')
  for (const culinary of culinaryPlaces) {
    await prisma.culinary.create({
      data: culinary
    })
  }

  console.log('Seeding accommodations...')
  for (const accommodation of accommodations) {
    await prisma.accommodation.create({
      data: accommodation
    })
  }

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })