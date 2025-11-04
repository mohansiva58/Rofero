"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, X, Menu, Heart, ShoppingCart, User, LogOut } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { items } = useCart()
  const { user, loading, setShowLoginModal, logout } = useAuth()
  const cartCount = items.length

  // Sync search query with URL parameter
  useEffect(() => {
    const urlSearchQuery = searchParams.get("search")
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery)
      setIsSearchOpen(true)
    }
  }, [searchParams])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (isMobileOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isMobileOpen])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      // Don't close search or clear query - keep it visible
      // setIsSearchOpen(false)
      // setSearchQuery("")
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setIsSearchOpen(false)
    // If we're on the shop page with a search, redirect to shop without search
    if (pathname === "/shop" && searchParams.get("search")) {
      router.push("/shop")
    }
  }

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
    router.push("/")
  }

  return (
    <nav className="w-full bg-white sticky top-0 z-50 border-b border-gray-200">
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-2 md:py-3 max-w-7xl mx-auto w-full">
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
            <Link href="/shop" className="text-xs lg:text-sm font-semibold tracking-wider hover:text-gray-600 transition">
              COLLECTION
            </Link>
            <Link href="/about" className="block text-sm font-semibold hover:text-gray-600 transition">
              ABOUT US
            </Link>
             
          </div>
        </div>

        {/* Center - Logo */}
        <div className="flex-1 flex justify-center md:flex-none md:static md:flex-1">
          <Link href="/" className="flex items-center" aria-label="Home">
            <img
              src="https://images.yourstory.com/cs/images/companies/shoprarerabbitlogo-1719813730851.jpg?fm=auto&ar=1%3A1&mode=fill&fill=solid&fill-color=fff&format=auto&w=1920&q=75"
              alt="Refero"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <span className="text-xs font-semibold tracking-widest hidden sm:inline ml-2">ROFERO</span>
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
          
          {/* User Menu */}
          {!loading && (
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 hover:bg-gray-100 rounded transition hidden md:flex items-center justify-center"
                    aria-label="Account"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || "User"} className="w-6 h-6 rounded-full" />
                    ) : (
                      <User size={18} className="md:w-5 md:h-5" />
                    )}
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user.displayName || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/my-orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Wishlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="p-2 hover:bg-gray-100 rounded transition hidden md:flex items-center justify-center"
                  aria-label="Login"
                >
                  <User size={18} className="md:w-5 md:h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t border-gray-200 px-4 md:px-6 lg:px-8 py-3 bg-white">
          <div className="flex gap-2 max-w-7xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products, categories, colors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black pr-10"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
                  aria-label="Clear search"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-4 md:px-6 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition flex items-center gap-2"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Menu */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-4 space-y-3 bg-white">
          <Link href="/shop" className="block text-sm font-semibold hover:text-gray-600 transition">
            COLLECTION
          </Link>
          <hr className="my-2" />
          <Link href="/about" className="block text-sm font-semibold hover:text-gray-600 transition">
            ABOUT US
          </Link>
          <Link href="/my-orders" className="block text-sm font-semibold hover:text-gray-600 transition">
            TRACK ORDER
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="block text-sm font-semibold hover:text-gray-600 transition">
                MY PROFILE
              </Link>
              <button onClick={handleLogout} className="block w-full text-left text-sm font-semibold text-red-600 hover:text-red-700 transition">
                LOGOUT
              </button>
            </div>

            {/* User Section */}
            {user ? (
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-12 h-12 rounded-full border-2 border-white shadow" />
                  ) : (
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{user.displayName || "User"}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <button
                  onClick={() => {
                    setShowLoginModal(true)
                    setIsMobileOpen(false)
                  }}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <User size={18} />
                  Login / Sign Up
                </button>
              </div>
            )}

            {/* Navigation Links */}
            <div className="py-2">
              {/* Shop Section */}
              <div className="px-2 py-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shop</p>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ShoppingCart size={18} />
                  All Products
                </Link>
              </div>

              <hr className="my-2 border-gray-200" />

              {/* Account Section */}
              {user && (
                <>
                  <div className="px-2 py-2">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">My Account</p>
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <User size={18} />
                      My Profile
                    </Link>
                    <Link
                      href="/my-orders"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ShoppingCart size={18} />
                      My Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Heart size={18} />
                      Wishlist
                    </Link>
                  </div>
                  <hr className="my-2 border-gray-200" />
                </>
              )}

              {/* General Links */}
              <div className="px-2 py-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">More</p>
                <Link
                  href="/about"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About Us
                </Link>
                <Link
                  href="/track"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Track Order
                </Link>
              </div>

              {/* Logout */}
              {user && (
                <>
                  <hr className="my-2 border-gray-200" />
                  <div className="px-2 py-2">
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileOpen(false)
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">© 2025 ROFERO. All rights reserved.</p>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
