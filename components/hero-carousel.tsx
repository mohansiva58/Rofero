"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    image: "https://cdn.shopify.com/s/files/1/0752/6435/files/LAURELLIGHTTURQ-CC1380_900x.webp?v=1743582326",
    title: "Premium Hoodies",
    subtitle: "Experience Luxury Comfort",
    colors: ["Black", "Navy", "Charcoal"],
  },
  {
    image: "https://a.storyblok.com/f/165154/1280x720/2ba3c03ccf/7_collection-of-hoodies_2.jpg/m/",
    title: "New Collection",
    subtitle: "Limited Edition Drops",
    colors: ["White", "Cream", "Off-white"],
  },
  {
  image: "data:image/jpeg;base64,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",
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
    <div className="relative w-full h-[70vh] md:h-[450px] lg:h-[550px] overflow-hidden bg-gray-900">
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
