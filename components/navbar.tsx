"use client"

import Link from "next/link"
import { useState, useEffect, Suspense, useRef } from "react"
import { Search, X, Menu, Heart, ShoppingCart, User, LogOut } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"

function NavbarContent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const searchWrapperRef = useRef<HTMLDivElement | null>(null)
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
    if (typeof window === "undefined") return

    if (isMobileOpen) {
      document.body.classList.add("overflow-hidden")
    } else {
      document.body.classList.remove("overflow-hidden")
    }
    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [isMobileOpen])

  // Focus input when inline search opens (desktop) and handle outside/Esc
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!isSearchOpen) return
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsSearchOpen(false)
    }
    document.addEventListener("mousedown", handleDocClick)
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("mousedown", handleDocClick)
      document.removeEventListener("keydown", handleKey)
    }
  }, [isSearchOpen])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setIsSearchOpen(false)
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
  <nav className="w-full bg-white sticky top-0 z-50 border-b border-gray-200 mb-2.5 sm:mb-0">
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
            <Link
              href="/shop"
              className="text-xs lg:text-sm font-semibold tracking-wider hover:text-gray-600 transition"
            >
              COLLECTION
            </Link>
            <Link
              href="/about"
              className="block text-sm font-semibold hover:text-gray-600 transition"
            >
              ABOUT US
            </Link>
          </div>
        </div>

        {/* Center - Logo */}
        <div className="flex-1 flex justify-center md:flex-none md:static md:flex-1">
          <Link href="/" className="flex items-center" aria-label="Home">
            <img
              src="https://images.yourstory.com/cs/images/companies/shoprarerabbitlogo-1719813730851.jpg?fm=auto&ar=1%3A1&mode=fill&fill=solid&fill-color=fff&format=auto&w=1920&q=75"
              alt="ROFERO"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <span className="text-xs font-semibold tracking-widest hidden sm:inline ml-2">
              ROFERO
            </span>
          </Link>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <div ref={searchWrapperRef} className="relative flex items-center">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-100 rounded transition"
              aria-label="Search"
            >
              <Search size={18} className="md:w-5 md:h-5" />
            </button>

            {/* Inline expanding input for all screens */}
            <div className="flex items-center">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className={`transition-all duration-200 ease-in-out text-sm rounded focus:outline-none focus:ring-2 focus:ring-black ${
                  isSearchOpen
                    ? "w-full md:w-64 px-3 py-1 border border-gray-300 ml-2 opacity-100"
                    : "w-0 md:w-0 px-0 py-0 border-0 opacity-0"
                }`}
                aria-label="Search products"
              />
              {searchQuery && isSearchOpen && (
                <button
                  onClick={handleClearSearch}
                  className="ml-2 p-1 hover:bg-gray-100 rounded-full transition"
                  aria-label="Clear search"
                >
                  <X size={14} className="text-gray-600" />
                </button>
              )}
            </div>
          </div>

          <Link
            href="/wishlist"
            className="p-2 hover:bg-gray-100 rounded transition hidden sm:flex items-center justify-center"
            aria-label="Wishlist"
          >
            <Heart size={18} className="md:w-5 md:h-5" />
          </Link>

          <Link
            href="/cart"
            className="p-2 hover:bg-gray-100 rounded transition relative"
            aria-label="Cart"
          >
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
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User size={18} className="md:w-5 md:h-5" />
                    )}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
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

      {/* Search Bar (handled inline via the icon wrapper; mobile full-width removed) */}

      {/* Mobile Sidebar Menu */}
      {isMobileOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 md:hidden shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-black text-white">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.yourstory.com/cs/images/companies/shoprarerabbitlogo-1719813730851.jpg?fm=auto&ar=1%3A1&mode=fill&fill=solid&fill-color=fff&format=auto&w=1920&q=75"
                  alt="Logo"
                  className="w-8 h-8 object-contain rounded"
                />
                <span className="font-bold text-lg tracking-wide">ROFERO</span>
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Section */}
            {user ? (
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-12 h-12 rounded-full border-2 border-white shadow"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.displayName || "User"}
                    </p>
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

            {/* Menu Links */}
            <div className="py-2">
              <div className="px-2 py-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Shop
                </p>
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

              {user && (
                <>
                  <div className="px-2 py-2">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      My Account
                    </p>
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

              <div className="px-2 py-2">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  More
                </p>
                <Link
                  href="/about"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ℹ️ About Us
                </Link>
                <Link
                  href="/track"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  📍 Track Order
                </Link>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                © 2025 ROFERO. All rights reserved.
              </p>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default function Navbar() {
  return (
    <Suspense
      fallback={
        <nav className="w-full bg-white sticky top-0 z-50 border-b border-gray-200">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-2 md:py-3 max-w-7xl mx-auto w-full">
            <div className="flex items-center gap-4 md:gap-8">
              <div className="w-8 h-8" />
            </div>
            <Link href="/" className="flex items-center" aria-label="Home">
              <img
                src="https://images.yourstory.com/cs/images/companies/shoprarerabbitlogo-1719813730851.jpg?fm=auto&ar=1%3A1&mode=fill&fill=solid&fill-color=fff&format=auto&w=1920&q=75"
                alt="ROFERO"
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
              />
              <span className="text-xs font-semibold tracking-widest hidden sm:inline ml-2">
                ROFERO
              </span>
            </Link>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-8 h-8" />
            </div>
          </div>
        </nav>
      }
    >
      <NavbarContent />
    </Suspense>
  )
}
