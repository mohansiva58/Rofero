"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { ChevronDown, Filter, X, SlidersHorizontal } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  mrp: number
  images: string[]
  colors: string[]
  sizes: string[]
  category: string
  inStock: boolean
  discount: number
}

const priceRanges = [
  { label: "All Prices", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "Under ₹2000", min: 0, max: 2000 },
  { label: "₹2000 - ₹2500", min: 2000, max: 2500 },
  { label: "₹2500 - ₹3000", min: 2500, max: 3000 },
  { label: "Over ₹3000", min: 3000, max: Number.POSITIVE_INFINITY },
]

export default function ShopPage() {
  const searchParams = useSearchParams()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPrice, setSelectedPrice] = useState({ min: 0, max: Number.POSITIVE_INFINITY })
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Set initial category from URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  // Fetch products from MongoDB
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/admin/products")
        const data = await res.json()
        console.log("Products API response:", data)
        if (data.success && data.products) {
          setAllProducts(data.products || [])
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Close mobile filters when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileFiltersOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(allProducts.map((p) => p.category))
    return ["All", ...Array.from(cats)]
  }, [allProducts])

  const filteredProducts = useMemo(() => {
    let filtered = allProducts

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    filtered = filtered.filter((p) => p.price >= selectedPrice.min && p.price <= selectedPrice.max)

    // Apply sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "discount") {
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0))
    }

    return filtered
  }, [allProducts, selectedCategory, selectedPrice, sortBy])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Page Header */}
        {/* <div className="border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                Our Collection
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
                Discover our exclusive range of premium products crafted with exceptional quality and style
              </p>
            </div>
          </div>
        </div> */}

        <div className="max-w-7xl mx-auto pl-5 pr-4 sm:pr-6 lg:pr-8 pt-8 lg:pt-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Overlay */}
            {mobileFiltersOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={() => setMobileFiltersOpen(false)}
                />
                <div className="absolute inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Categories */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4 text-base">Category</h3>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`block w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all ${
                              selectedCategory === cat
                                ? "bg-black text-white font-semibold shadow-sm"
                                : "hover:bg-gray-50 text-gray-700 border border-transparent hover:border-gray-200"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-4 text-base">Price Range</h3>
                      <div className="space-y-2">
                        {priceRanges.map((range) => (
                          <button
                            key={range.label}
                            onClick={() => setSelectedPrice({ min: range.min, max: range.max })}
                            className={`block w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all ${
                              selectedPrice.min === range.min && selectedPrice.max === range.max
                                ? "bg-black text-white font-semibold shadow-sm"
                                : "hover:bg-gray-50 text-gray-700 border border-transparent hover:border-gray-200"
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-8 space-y-8">
                {/* Categories */}
                <div className="bg-white rounded-r-xl border border-l-0 border-gray-200 py-6 pr-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">Category</h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`block w-full text-left px-4 py-3 text-base rounded-xl transition-all ${
                          selectedCategory === cat
                            ? "bg-black text-white font-semibold shadow-sm"
                            : "hover:bg-gray-50 text-gray-700 border border-transparent hover:border-gray-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="bg-white rounded-r-xl border border-l-0 border-gray-200 py-6 pr-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-lg">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedPrice({ min: range.min, max: range.max })}
                        className={`block w-full text-left px-4 py-3 text-base rounded-xl transition-all ${
                          selectedPrice.min === range.min && selectedPrice.max === range.max
                            ? "bg-black text-white font-semibold shadow-sm"
                            : "hover:bg-gray-50 text-gray-700 border border-transparent hover:border-gray-200"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="flex-1 min-w-0">
              {/* Top Bar - Sort and Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </button>
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                      {selectedCategory !== "All" && (
                        <span className="ml-2">
                          in <span className="font-semibold text-gray-900">{selectedCategory}</span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <label className="text-sm text-gray-600 whitespace-nowrap font-medium">Sort by:</label>
                    <div className="relative flex-1 sm:flex-none min-w-[180px]">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all bg-white pr-10"
                      >
                        <option value="newest">Newest First</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="discount">Best Discount</option>
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Results Count */}
              <div className="sm:hidden mb-6">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                  {selectedCategory !== "All" && (
                    <span className="ml-1">
                      in <span className="font-semibold text-gray-900">{selectedCategory}</span>
                    </span>
                  )}
                </p>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product._id} 
                      product={{
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        mrp: product.mrp,
                        discount: product.discount,
                        image: product.images[0] || "/placeholder.jpg",
                        colors: product.colors,
                        category: product.category,
                        inStock: product.inStock,
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 lg:py-24">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Filter className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your filters or browse different categories
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory("All")
                        setSelectedPrice({ min: 0, max: Number.POSITIVE_INFINITY })
                      }}
                      className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Load More (Optional) */}
              {filteredProducts.length > 50 && (
                <div className="flex justify-center mt-12 lg:mt-16">
                  <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700">
                    Load More Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}