"use client"

import type React from "react"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react"
import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail("")
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <footer className="hidden sm:block bg-white border-t border-gray-200">
      

      {/* Footer Content */}
      <div className="px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Company */}
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Company</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-black transition">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-black transition">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-black transition">
                  Chat with Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-black transition">
                  Work for Rare
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Quick Links</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
              <li>
                <Link href="/profile" className="hover:text-black transition">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-black transition">
                  Returns / Exchange
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-black transition">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-black transition">
                  Store locator
                </Link>
              </li>
            </ul>
          </div>

          {/* Themes */}
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Our Themes</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-black transition">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-black transition">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Follow Us</h4>
            <div className="flex gap-3 md:gap-4">
              <a href="#" className="text-gray-600 hover:text-black transition">
                <Facebook size={18} className="md:w-5 md:h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition">
                <Instagram size={18} className="md:w-5 md:h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition">
                <Linkedin size={18} className="md:w-5 md:h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-black transition">
                <Mail size={18} className="md:w-5 md:h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-600">
          <p>All Rights Reserved The ROFERO © 2025</p>
        </div>
      </div>
    </footer>
  )
}
