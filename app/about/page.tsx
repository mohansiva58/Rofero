import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Award, Zap, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Rare Rabbit</h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              We believe in creating premium, sustainable hoodies that empower individuals to express their unique
              style. Every piece is crafted with precision, passion, and purpose.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                Founded in 2020, Rare Rabbit started as a vision to revolutionize the hoodie industry. We noticed a gap
                in the market for high-quality, affordable hoodies that didn't compromise on style or comfort.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                Today, we serve thousands of customers worldwide, delivering premium streetwear that celebrates
                individuality and sustainable fashion practices. Our commitment remains unchanged: create exceptional
                products that resonate with modern, conscious consumers.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Every hoodie we make tells a story of quality, craftsmanship, and our dedication to your satisfaction.
              </p>
            </div>
            <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
              <img
                src="/rare-rabbit-team-office.jpg"
                alt="Rare Rabbit Team"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 md:py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-black" />
                <h3 className="text-xl font-bold mb-3">Quality First</h3>
                <p className="text-gray-600">
                  We use only premium materials and rigorous quality control to ensure every hoodie meets our exacting
                  standards.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-black" />
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We stay ahead of trends with cutting-edge designs and sustainable manufacturing practices that benefit
                  our planet.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-black" />
                <h3 className="text-xl font-bold mb-3">Community</h3>
                <p className="text-gray-600">
                  Our community is at the heart of everything we do. We celebrate individuality and foster connections
                  through shared values.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              To create extraordinary hoodies that inspire confidence and self-expression while maintaining our
              commitment to environmental sustainability and ethical manufacturing.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-black mb-2">10K+</div>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-black mb-2">50+</div>
                <p className="text-gray-600">Unique Designs</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-black mb-2">100%</div>
                <p className="text-gray-600">Sustainable Practices</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 md:py-20 px-4 md:px-8 bg-black text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out to our team anytime.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:hello@rarerabbit.com"
              className="px-8 py-3 bg-white text-black rounded font-semibold hover:bg-gray-100 transition"
            >
              Email Us
            </a>
            <a
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white rounded font-semibold hover:bg-white hover:text-black transition"
            >
              Contact Form
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
