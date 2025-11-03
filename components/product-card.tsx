"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    mrp?: number
    discount?: number
    image: string
    colors: string[]
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: selectedColor,
      quantity: 1,
    })
  }

  return (
    <div className="group">
      <div className="relative overflow-hidden bg-gray-200 rounded-lg mb-4 h-80">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center gap-4">
          <button
            onClick={() =>
              toggleWishlist({ id: product.id, name: product.name, price: product.price, image: product.image })
            }
            className={`p-3 rounded-full opacity-0 group-hover:opacity-100 transition transform group-hover:scale-100 scale-75 ${
              inWishlist ? "bg-red-500 text-white" : "bg-white text-black"
            }`}
          >
            <Heart size={20} className={inWishlist ? "fill-red-500" : ""} />
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-black text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition transform group-hover:scale-100 scale-75"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      <Link href={`/product/${product.id}`} className="hover:underline">
        <h3 className="text-sm font-bold mb-1 line-clamp-2">{product.name}</h3>
      </Link>

      <div className="mb-3">
        <div className="flex items-baseline gap-2">
          <p className="font-bold text-lg">₹{product.price.toLocaleString("en-IN")}</p>
          {product.mrp && (
            <>
              <p className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString("en-IN")}</p>
              {product.discount && <p className="text-xs text-red-600 font-bold">{product.discount}%</p>}
            </>
          )}
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        {product.colors.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            className={`text-xs px-2 py-1 border-2 rounded transition ${
              selectedColor === color ? "border-black bg-black text-white" : "border-gray-300 hover:border-black"
            }`}
          >
            {color}
          </button>
        ))}
      </div>
    </div>
  )
}
