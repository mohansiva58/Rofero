"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Heart, Share2, Truck, Shield } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import Link from "next/link"
import { useRouter } from "next/navigation"

const allProducts = [
  {
    id: 1,
    name: "BOXY FIT EMBROIDERED SHIRT",
    subtitle: "TARED - DUSKY BLUE",
    mrp: 3499,
    price: 1749,
    discount: 50,
    images: ["/black-hoodie-front-view.jpg", "/black-hoodie-back-view.jpg", "/black-hoodie-detail.jpg"],
    description:
      "Experience ultimate comfort and style with our classic embroidered shirt. Crafted from premium quality fabric, this piece is perfect for any occasion.",
    colors: ["Dusky Blue", "White", "Black"],
    sizes: ["XS-36", "S-38", "M-40", "L-42", "XL-44", "XXL-46", "3XL-48"],
    rating: 4.5,
    reviews: 128,
    features: [
      "Premium Cotton Blend",
      "100% Authentic",
      "Free Shipping on Orders Above ₹500",
      "Easy Returns",
      "2-Year Warranty",
    ],
    gstSavings: 111,
  },
]

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [mainImage, setMainImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("Dusky Blue")
  const [selectedSize, setSelectedSize] = useState("M-40")
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState("")
  const [deliveryStatus, setDeliveryStatus] = useState<string | null>(null)
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const router = useRouter()

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  const productId = resolvedParams?.id ? Number.parseInt(resolvedParams.id) : 1
  const product = allProducts.find((p) => p.id === productId) || allProducts[0]
  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      quantity,
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push("/checkout")
  }

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryStatus("Delivery available in 3-5 business days")
    } else {
      setDeliveryStatus("Invalid pincode")
    }
  }

  const gstSavings = product.gstSavings || Math.round((product.mrp - product.price) * 0.18)

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="text-sm text-gray-600 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:underline">
              Rare Rabbit
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.subtitle}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div className="flex flex-col-reverse md:flex-col">
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 md:mb-0 md:order-2 aspect-square md:aspect-auto md:h-full">
                <img
                  src={product.images[mainImage] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 md:order-1 md:mb-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(index)}
                    className={`aspect-square rounded overflow-hidden border-2 transition ${
                      index === mainImage ? "border-black" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{product.name}</h1>
                <p className="text-sm text-gray-600 font-medium">{product.subtitle}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-3 mb-2">
                  <p className="text-3xl font-bold">₹{product.price.toLocaleString("en-IN")}</p>
                  <p className="text-lg text-gray-400 line-through">₹{product.mrp.toLocaleString("en-IN")}</p>
                  <p className="text-red-600 font-bold text-lg">{product.discount}%</p>
                </div>
                <p className="text-xs text-gray-600">(Incl. of all taxes)</p>
                <p className="text-xs text-teal-600 mt-1">( INCL. GST SAVINGS OF ₹{gstSavings} )</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold">SIZE GUIDE</label>
                  <button className="text-xs underline hover:no-underline">SIZE GUIDE</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-2 border-2 rounded text-xs font-medium transition ${
                        selectedSize === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4 bg-gray-100 p-3 rounded w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-lg font-bold hover:text-gray-600"
                  >
                    −
                  </button>
                  <span className="px-4 text-lg font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-lg font-bold hover:text-gray-600">
                    +
                  </button>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-sm font-bold">PAY NOW</p>
                  <span className="text-lg font-bold">₹563</span>
                  <span className="text-xs text-gray-600">REST PAY LATER</span>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded font-bold">NEW</span>
                </div>
                <p className="text-xs text-gray-600">
                  AT 0% EMI ON <span className="font-bold">UPI</span> |{" "}
                  <button className="text-blue-600 underline">CHECK EMI NOW</button>
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-xs font-bold mb-3">CHECK ESTIMATED DELIVERY</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ENTER YOUR PINCODE"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.slice(0, 6))}
                    maxLength={6}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    onClick={checkDelivery}
                    className="px-6 py-3 bg-black text-white font-bold rounded hover:bg-gray-800 transition text-sm"
                  >
                    CHECK
                  </button>
                </div>
                {deliveryStatus && (
                  <p
                    className={`text-xs mt-2 ${deliveryStatus.includes("available") ? "text-green-600" : "text-red-600"}`}
                  >
                    {deliveryStatus}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="py-4 px-4 border-2 border-black text-black font-bold rounded hover:bg-gray-100 transition text-sm"
                >
                  ADD TO CART
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-4 px-4 bg-black text-white font-bold rounded hover:bg-gray-800 transition text-sm"
                >
                  BUY IT NOW
                </button>
              </div>

              <div className="flex gap-3 mb-6 pb-6 border-b border-gray-200">
                <button
                  onClick={() =>
                    toggleWishlist({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images[0],
                    })
                  }
                  className={`flex-1 py-3 border-2 rounded font-bold text-sm transition flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-300 hover:border-black text-gray-700"
                  }`}
                >
                  <Heart size={18} className={isWishlisted ? "fill-red-600" : ""} />
                  {isWishlisted ? "WISHLISTED" : "WISHLIST"}
                </button>
                <button className="flex-1 py-3 border-2 border-gray-300 rounded font-bold text-sm hover:border-black transition flex items-center justify-center gap-2">
                  <Share2 size={18} />
                  SHARE
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <Truck size={20} className="text-gray-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-bold">Free Shipping</p>
                    <p className="text-gray-600 text-xs">On orders above ₹500</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield size={20} className="text-gray-600 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-bold">Easy Returns & Exchanges</p>
                    <p className="text-gray-600 text-xs">Within 30 days of purchase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl font-bold mb-6">ABOUT THIS PRODUCT</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-3">WHY CHOOSE THIS?</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3">RATINGS & REVIEWS</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className={`text-lg ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}>
                          ★
                        </span>
                      ))}
                  </div>
                  <p className="text-sm font-bold">{product.rating} out of 5</p>
                </div>
                <p className="text-xs text-gray-600 mt-1">({product.reviews} reviews)</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
