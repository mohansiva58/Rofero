"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, X, Menu, Heart, ShoppingCart, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()
  const { items } = useCart()
  const { user, loading, setShowLoginModal, logout } = useAuth()
  const cartCount = items.length

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
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
              alt="Rare Rabbit"
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
          <hr className="my-2" />
          <Link href="/about" className="block text-sm font-semibold hover:text-gray-600 transition">
            ABOUT US
          </Link>
          <Link href="/track" className="block text-sm font-semibold hover:text-gray-600 transition">
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
            </>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="block w-full text-left text-sm font-semibold hover:text-gray-600 transition">
              LOGIN / SIGN UP
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
