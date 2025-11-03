"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"

const allProducts = [
  {
    id: 1,
    name: "BOXY FIT EMBROIDERED SHIRT",
    price: 1749,
    mrp: 3499,
    discount: 50,
    image: "/black-hoodie-front-view.jpg",
    colors: ["Dusky Blue", "White", "Black"],
    category: "Shirts",
  },
  {
    id: 2,
    name: "Urban Grey Hoodie",
    price: 2199,
    mrp: 2799,
    discount: 21,
    image: "/grey-hoodie-modern-design.jpg",
    colors: ["Grey", "Dark Grey"],
    category: "Hoodies",
  },
  {
    id: 3,
    name: "Oversized Charcoal",
    price: 2399,
    mrp: 3199,
    discount: 25,
    image: "/oversized-charcoal-hoodie-fashion.jpg",
    colors: ["Charcoal", "Black"],
    category: "Hoodies",
  },
  {
    id: 4,
    name: "Vintage Cream Hoodie",
    price: 2299,
    mrp: 2899,
    discount: 21,
    image: "/cream-vintage-hoodie-luxury.jpg",
    colors: ["Cream", "Off-White"],
    category: "Hoodies",
  },
  {
    id: 5,
    name: "Autumn Edition Hoodie",
    price: 2499,
    mrp: 3499,
    discount: 29,
    image: "/autumn-hoodie-new-collection-streetwear.jpg",
    colors: ["Rust", "Bronze"],
    category: "Limited Edition",
  },
  {
    id: 6,
    name: "Limited Edition Drop",
    price: 3299,
    mrp: 4999,
    discount: 34,
    image: "/limited-edition-hoodie-exclusive.jpg",
    colors: ["Black", "White"],
    category: "Limited Edition",
  },
  {
    id: 7,
    name: "Premium Midnight Black",
    price: 2599,
    mrp: 3499,
    discount: 26,
    image: "/premium-midnight-black-hoodie.jpg",
    colors: ["Black"],
    category: "Hoodies",
  },
  {
    id: 8,
    name: "Sunset Orange Hoodie",
    price: 2399,
    mrp: 3199,
    discount: 25,
    image: "/sunset-orange-hoodie.jpg",
    colors: ["Orange", "Rust"],
    category: "Hoodies",
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("search") || ""
  const [searchTerm, setSearchTerm] = useState(query)
  const [sortBy, setSortBy] = useState("relevance")

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  const searchResults = useMemo(() => {
    let results = allProducts

    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase()
      results = results.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerTerm) ||
          product.category.toLowerCase().includes(lowerTerm) ||
          product.colors.some((color) => color.toLowerCase().includes(lowerTerm)),
      )
    }

    // Sort results
    if (sortBy === "price-low") {
      results.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      results.sort((a, b) => b.price - a.price)
    } else if (sortBy === "discount") {
      results.sort((a, b) => (b.discount || 0) - (a.discount || 0))
    }

    return results
  }, [searchTerm, sortBy])

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Search header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Search Results</h1>
            {searchTerm && (
              <p className="text-gray-600">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for{" "}
                <span className="font-bold">"{searchTerm}"</span>
              </p>
            )}
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-2">No products found</h2>
              <p className="text-gray-600 mb-6">Try searching with different keywords</p>
            </div>
          ) : (
            <>
              {/* Sort controls */}
              <div className="mb-8 pb-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{searchResults.length}</span> products
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Highest Discount</option>
                  </select>
                </div>
              </div>

              {/* Results grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
