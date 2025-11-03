"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Heart, Trash2 } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"

export default function WishlistPage() {
  const { items, removeItem, toggleWishlist } = useWishlist()
  const { addItem } = useCart()

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
    })
  }

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">MY WISHLIST</h1>
            <p className="text-gray-600">
              {items.length} item{items.length !== 1 ? "s" : ""} in your wishlist
            </p>
          </div>

          {items.length === 0 ? (
            /* Empty state with call to action */
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
              <p className="text-gray-600 mb-6">Save your favorite hoodies to your wishlist</p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-black text-white font-bold rounded hover:bg-gray-800 transition"
              >
                START SHOPPING
              </Link>
            </div>
          ) : (
            /* Wishlist items grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative overflow-hidden bg-gray-200 rounded-lg mb-4 h-80">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      title="Remove from wishlist"
                    >
                      <Heart size={20} className="fill-red-500 text-red-500" />
                    </button>
                  </div>

                  <Link href={`/product/${item.id}`} className="hover:underline">
                    <h3 className="text-sm font-bold mb-2 line-clamp-2">{item.name}</h3>
                  </Link>

                  <p className="text-lg font-bold mb-4">₹{item.price.toLocaleString("en-IN")}</p>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2 bg-black text-white font-bold rounded hover:bg-gray-800 transition text-sm"
                    >
                      ADD TO CART
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-full py-2 border-2 border-gray-300 text-gray-700 font-bold rounded hover:border-red-500 hover:text-red-500 transition text-sm flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
