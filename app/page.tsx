"use client"

import Navbar from "@/components/navbar"
import HeroCarousel from "@/components/hero-carousel"
import HoodiesSection from "@/components/hoodies-section"
import NewArrivals from "@/components/new-arrivals"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-white pb-20 md:pb-0">
        <HeroCarousel />
        <HoodiesSection />
        <NewArrivals />
      </main>
      <Footer />
    </>
  )
}
