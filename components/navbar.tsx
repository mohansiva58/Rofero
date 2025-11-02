"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, X, Menu } from "lucide-react"
import CartDropdown from "./cart-dropdown"
import ProfileDropdown from "./profile-dropdown"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      {/* Promo Bar */}
      <div className="bg-black text-white text-center py-2 text-sm">
        GST BENEFIT INCLUDED ON PRODUCTS PRICED BELOW ₹2,500
      </div>

      {/* Main Navbar */}
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Left - Menu */}
        <div className="hidden md:flex gap-8">
          <Link href="/" className="text-sm font-medium hover:underline">
            COLLECTION
          </Link>
          <Link href="/" className="text-sm font-medium hover:underline">
            TRACK-ORDER
          </Link>
          <Link href="/" className="text-sm font-medium hover:underline">
            ABOUT-US
          </Link>
          <Link href="/" className="text-sm font-medium hover:underline">
            CONTACT US
          </Link>
        </div>

        {/* Center - Logo */}
        <div className="text-center">
          <Link href="/">
            <div className="text-xs tracking-widest text-gray-600">THE HOUSE OF</div>
            <div className="text-3xl font-bold tracking-tight">RARE</div>
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-4">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 hover:bg-gray-100">
            <Search size={20} />
          </button>
          <CartDropdown />
          <ProfileDropdown />
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden p-2">
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="border-t border-gray-200 px-6 py-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-6 py-4 space-y-3">
          <Link href="/" className="block text-sm font-medium">
            MEN
          </Link>
          <Link href="/" className="block text-sm font-medium">
            WOMEN
          </Link>
          <Link href="/" className="block text-sm font-medium">
            KIDS
          </Link>
          <Link href="/" className="block text-sm font-medium">
            FOOTWEAR
          </Link>
          <Link href="/track" className="block text-sm font-medium">
            TRACK ORDER
          </Link>
          <Link href="/about" className="block text-sm font-medium">
            ABOUT US
          </Link>
        </div>
      )}
    </nav>
  )
}
