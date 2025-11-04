"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
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

function ShopPageContent() {
  const searchParams = useSearchParams()
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPrice, setSelectedPrice] = useState({ min: 0, max: Number.POSITIVE_INFINITY })
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Set initial category and search from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    const searchParam = searchParams.get("search")
    
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
    
    if (searchParam) {
      setSearchQuery(searchParam)
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
    let exactMatches: Product[] = []
    let relatedMatches: Product[] = []

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase()
      const searchWords = lowerQuery.split(' ').filter(word => word.length > 0)
      
      // First, find exact matches
      exactMatches = filtered.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(lowerQuery)
        const categoryMatch = p.category.toLowerCase().includes(lowerQuery)
        const colorMatch = p.colors.some((color) => color.toLowerCase().includes(lowerQuery))
        return nameMatch || categoryMatch || colorMatch
      })

      // If no exact matches, find related products (partial word matches)
      if (exactMatches.length === 0) {
        relatedMatches = filtered.filter((p) => {
          const nameWords = p.name.toLowerCase().split(' ')
          const categoryWords = p.category.toLowerCase().split(' ')
          
          // Check if any search word matches any product word
          return searchWords.some(searchWord => 
            nameWords.some(nameWord => nameWord.includes(searchWord) || searchWord.includes(nameWord)) ||
            categoryWords.some(catWord => catWord.includes(searchWord) || searchWord.includes(catWord)) ||
            p.colors.some(color => color.toLowerCase().includes(searchWord))
          )
        })
      }

      filtered = exactMatches.length > 0 ? exactMatches : relatedMatches
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Apply price filter
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
  }, [allProducts, selectedCategory, selectedPrice, sortBy, searchQuery])

  // Check if we're showing related products instead of exact matches
  const isShowingRelated = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return false
    
    const lowerQuery = searchQuery.toLowerCase()
    const hasExactMatch = allProducts.some((p) => {
      const nameMatch = p.name.toLowerCase().includes(lowerQuery)
      const categoryMatch = p.category.toLowerCase().includes(lowerQuery)
      const colorMatch = p.colors.some((color) => color.toLowerCase().includes(lowerQuery))
      return nameMatch || categoryMatch || colorMatch
    })
    
    return !hasExactMatch && filteredProducts.length > 0
  }, [searchQuery, allProducts, filteredProducts])

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
        {/* Search Results Header */}
        {searchQuery && (
          <div className="border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {isShowingRelated ? "Related Products" : "Search Results"}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length > 0 ? (
                  <>
                    {filteredProducts.length} {isShowingRelated ? "related product" : "result"}
                    {filteredProducts.length !== 1 ? "s" : ""} {isShowingRelated ? "for" : "for"}{" "}
                    <span className="font-semibold">"{searchQuery}"</span>
                  </>
                ) : (
                  <>
                    No results found for <span className="font-semibold">"{searchQuery}"</span>
                  </>
                )}
              </p>
              {isShowingRelated && (
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mt-3 inline-block">
                  No exact matches found. Showing related products instead.
                </p>
              )}
            </div>
          </div>
        )}
        
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
              {/* Top Bar - Filters and Sort on Single Line */}
              <div className="flex items-center justify-between mb-6 gap-2">
                {/* Left side - Filters Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 border-2 border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all font-medium text-xs sm:text-sm shadow-sm"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Filters
                </button>

                {/* Desktop Product Count */}
                <div className="hidden lg:block">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">{filteredProducts.length}</span> products
                    {selectedCategory !== "All" && (
                      <span className="ml-1.5 text-gray-500">
                        in <span className="font-semibold text-gray-900">{selectedCategory}</span>
                      </span>
                    )}
                  </p>
                </div>

                {/* Right side - Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <label className="text-xs sm:text-sm text-gray-700 whitespace-nowrap font-medium hidden md:block">Sort:</label>
                  <div className="relative min-w-[140px] sm:min-w-[180px]">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none w-full px-3 py-2 text-xs sm:text-sm font-medium border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all bg-white pr-8 cursor-pointer hover:border-gray-400 shadow-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="discount">Best Discount</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500"
                    />
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

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ShopPageContent />
    </Suspense>
  )
}
