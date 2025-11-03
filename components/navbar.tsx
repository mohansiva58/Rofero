"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, X, Menu, Heart, ShoppingCart, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { items } = useCart()
  const cartCount = items.length

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <nav className="w-full bg-white sticky top-0 z-50 border-b border-gray-200">
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 md:py-4 max-w-7xl mx-auto w-full">
        {/* Left - Mobile Menu Button + Desktop Menu */}
        <div className="flex items-center gap-4 md:gap-8">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 lg:gap-8">
            <Link href="/" className="text-xs lg:text-sm font-semibold tracking-wider hover:text-gray-600 transition">
              MEN
            </Link>
            <Link
              href="/shop"
              className="text-xs lg:text-sm font-semibold tracking-wider hover:text-gray-600 transition"
            >
              WOMEN
            </Link>
            <Link
              href="/shop?category=kids"
              className="text-xs lg:text-sm font-semibold tracking-wider hover:text-gray-600 transition"
            >
              KIDS
            </Link>
            <Link
              href="/shop?category=footwear"
              className="text-xs lg:text-sm font-semibold tracking-wider hover:text-gray-600 transition"
            >
              FOOTWEAR
            </Link>
          </div>
        </div>

        {/* Center - Logo */}
        <div className="flex-1 flex justify-center md:flex-none md:static md:flex-1">
          <Link href="/" className="flex flex-col items-center gap-1" aria-label="Home">
            <svg
              className="w-10 h-10 md:w-12 md:h-12"
              viewBox="0 0 200 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Rabbit Head */}
              <path d="M100 80L85 50L95 40L100 30L105 40L115 50L100 80Z" stroke="black" strokeWidth="2" fill="none" />

              {/* Ears */}
              <path d="M75 60L65 20L55 30L60 70Z" stroke="black" strokeWidth="2" fill="none" />
              <path d="M125 60L135 20L145 30L140 70Z" stroke="black" strokeWidth="2" fill="none" />

              {/* Crown */}
              <path d="M80 35L90 15L100 20L110 15L120 35" stroke="black" strokeWidth="2" fill="none" />

              {/* Face */}
              <circle cx="85" cy="95" r="3" fill="black" />
              <circle cx="115" cy="95" r="3" fill="black" />

              {/* Nose */}
              <circle cx="100" cy="110" r="2" fill="black" />

              {/* Mouth */}
              <path d="M100 110L95 120L100 122L105 120Z" stroke="black" strokeWidth="1.5" fill="none" />

              {/* Chin */}
              <path d="M85 125L100 140L115 125" stroke="black" strokeWidth="2" fill="none" />
            </svg>
            <span className="text-xs font-semibold tracking-widest hidden sm:inline">RARE RABBIT</span>
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-gray-100 rounded transition"
            aria-label="Search"
          >
            <Search size={18} className="md:w-5 md:h-5" />
          </button>
          <Link
            href="/wishlist"
            className="p-2 hover:bg-gray-100 rounded transition hidden sm:flex items-center justify-center"
            aria-label="Wishlist"
          >
            <Heart size={18} className="md:w-5 md:h-5" />
          </Link>
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded transition relative" aria-label="Cart">
            <ShoppingCart size={18} className="md:w-5 md:h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            href="/login"
            className="p-2 hover:bg-gray-100 rounded transition hidden md:flex items-center justify-center"
            aria-label="Account"
          >
            <User size={18} className="md:w-5 md:h-5" />
          </Link>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t border-gray-200 px-4 md:px-6 lg:px-8 py-3 bg-white">
          <div className="flex gap-2 max-w-7xl mx-auto">
            <input
              type="text"
              placeholder="Search hoodies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              autoFocus
            />
            <button
              onClick={handleSearch}
              className="px-4 md:px-6 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
            >
              Search
            </button>
          </div>
        </div>
      )}

      {isMobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-4 space-y-3 bg-white">
          <Link href="/" className="block text-sm font-semibold hover:text-gray-600 transition">
            MEN
          </Link>
          <Link href="/shop" className="block text-sm font-semibold hover:text-gray-600 transition">
            WOMEN
          </Link>
          <Link href="/shop?category=kids" className="block text-sm font-semibold hover:text-gray-600 transition">
            KIDS
          </Link>
          <Link href="/shop?category=footwear" className="block text-sm font-semibold hover:text-gray-600 transition">
            FOOTWEAR
          </Link>
          <hr className="my-2" />
          <Link href="/about" className="block text-sm font-semibold hover:text-gray-600 transition">
            ABOUT US
          </Link>
          <Link href="/track" className="block text-sm font-semibold hover:text-gray-600 transition">
            TRACK ORDER
          </Link>
          <Link href="/login" className="block text-sm font-semibold hover:text-gray-600 transition">
            ACCOUNT
          </Link>
        </div>
      )}
    </nav>
  )
}
