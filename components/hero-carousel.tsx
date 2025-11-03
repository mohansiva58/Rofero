"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image: "/premium-black-hoodie-luxury-fashion.jpg",
    title: "Premium Hoodies",
    subtitle: "Experience Luxury Comfort",
    colors: ["Black", "Navy", "Charcoal"],
  },
  {
    image: "/white-hoodie-streetwear-modern-design.jpg",
    title: "New Collection",
    subtitle: "Limited Edition Drops",
    colors: ["White", "Cream", "Off-white"],
  },
  {
    image: "/blue-hoodie-urban-style-casual-wear.jpg",
    title: "Your Style",
    subtitle: "Make Your Statement",
    colors: ["Blue", "Sky Blue", "Denim"],
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
      setSelectedColor(0)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setSelectedColor(0)
  }
  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setSelectedColor(0)
  }

  const currentSlide = slides[current]
  const colors = currentSlide.colors

  return (
    <div className="relative w-full h-screen md:h-[600px] lg:h-[700px] overflow-hidden bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Image with overlay */}
          <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="absolute bottom-0 right-0 p-4 md:p-8 lg:p-12 text-right text-white max-w-md md:max-w-lg">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 leading-tight">{slide.title}</h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-100 mb-4 md:mb-6">{slide.subtitle}</p>

            <div className="flex gap-2 md:gap-3 justify-end">
              {colors.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(idx)}
                  className={`px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-semibold rounded transition ${
                    selectedColor === idx ? "bg-white text-black" : "bg-white/20 text-white hover:bg-white/40"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded transition"
        aria-label="Previous slide"
      >
        <ChevronLeft size={isMobile ? 20 : 28} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded transition"
        aria-label="Next slide"
      >
        <ChevronRight size={isMobile ? 20 : 28} />
      </button>

      <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index)
              setSelectedColor(0)
            }}
            className={`transition ${
              index === current
                ? "w-8 md:w-10 h-2 bg-white rounded-full"
                : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
