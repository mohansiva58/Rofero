"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import ProductCard from "./product-card"

interface Product {
  _id: string
  name: string
  price: number
  mrp: number
  discount: number
  images: string[]
  colors: string[]
  category: string
}

export default function HoodiesSection() {
  const [hoodies, setHoodies] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHoodies() {
      try {
        const res = await fetch("/api/admin/products?category=Hoodies")
        const data = await res.json()
        console.log("Hoodies API response:", data)
        if (data.success && data.products && Array.isArray(data.products)) {
          setHoodies(data.products)
        } else {
          setHoodies([])
        }
      } catch (error) {
        console.error("Failed to fetch hoodies:", error)
        setHoodies([])
      } finally {
        setLoading(false)
      }
    }
    fetchHoodies()
  }, [])

  if (loading) {
    return (
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-gray-600">Loading hoodies...</p>
        </div>
      </section>
    )
  }

  if (hoodies.length === 0) {
    return (
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Shop Hoodies</h2>
          <p className="text-gray-600 text-base md:text-lg">No hoodies available at the moment</p>
        </div>
        <div className="text-center">
          <Link href="/shop" className="inline-block bg-black text-white px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base rounded hover:bg-gray-900 transition">
            View All Products
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">Shop Hoodies</h2>
        <p className="text-gray-600 text-base md:text-lg">Discover our premium collection of handcrafted hoodies</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {hoodies.map((hoodie) => (
          <ProductCard
            key={hoodie._id}
            product={{
              id: hoodie._id,
              name: hoodie.name,
              price: hoodie.price,
              mrp: hoodie.mrp,
              discount: hoodie.discount,
              image: hoodie.images[0] || "/placeholder.jpg",
              colors: hoodie.colors || [],
            }}
          />
        ))}
      </div>

      <div className="text-center mt-8 md:mt-12">
        <Link href="/shop?category=Hoodies" className="inline-block bg-black text-white px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base rounded hover:bg-gray-900 transition">
          View All Hoodies
        </Link>
      </div>
    </section>
  )
}
