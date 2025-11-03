"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import RazorpayPayment from "@/components/razorpay-payment"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const { user, loading: authLoading, setShowLoginModal } = useAuth()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")

  const minOnlineAmount = 500
  const codAdvancePercentage = 10
  const codAdvanceAmount = Math.round(total * (codAdvancePercentage / 100))
  const totalWithTax = total + Math.round(total * 0.18)

  // Check if user is logged in, if not show login modal
  useEffect(() => {
    if (!authLoading && !user) {
      setShowLoginModal(true)
    }
  }, [authLoading, user, setShowLoginModal])

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user && !shippingAddress.email) {
      setShippingAddress(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
      }))
    }
  }, [user])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setShippingAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleCODOrder = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setPaymentStatus("processing")
    setError("")

    try {
      // Prepare order data
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: items.map(item => ({
          productId: String(item.id), // Convert to string for MongoDB ObjectId
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: "cod",
        paymentStatus: "pending",
        subtotal: total,
        tax: Math.round(total * 0.18),
        total: totalWithTax,
      }

      // Save order to MongoDB
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || "Failed to create order")
      }

      console.log("COD Order created:", result.order)
      
      setPaymentStatus("success")
      setOrderPlaced(true)
      clearCart()
      
      setTimeout(() => {
        router.push(`/order-confirmation?orderNumber=${result.order.orderNumber}`)
      }, 2000)
    } catch (err) {
      setPaymentStatus("failed")
      setError(err instanceof Error ? err.message : "Order placement failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (response: any) => {
    console.log("Payment successful:", response)
    setPaymentStatus("processing")
    setError("")

    try {
      // Prepare order data with Razorpay payment details
      const orderData = {
        userId: user?.uid,
        userEmail: user?.email,
        items: items.map(item => ({
          productId: String(item.id), // Convert to string for MongoDB ObjectId
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod: "online",
        paymentStatus: "paid",
        paymentDetails: {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          method: "razorpay",
        },
        subtotal: total,
        tax: Math.round(total * 0.18),
        total: totalWithTax,
      }

      // Save order to MongoDB
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      const result = await orderResponse.json()
      
      if (!result.success) {
        throw new Error(result.error || "Failed to create order")
      }

      console.log("Online Order created:", result.order)
      
      setPaymentStatus("success")
      setOrderPlaced(true)
      clearCart()
      
      setTimeout(() => {
        router.push(`/order-confirmation?orderNumber=${result.order.orderNumber}`)
      }, 2000)
    } catch (err) {
      setPaymentStatus("failed")
      setError(err instanceof Error ? err.message : "Failed to save order. Please contact support.")
    }
  }

  const handlePaymentFailure = (error: any) => {
    console.error("Payment failed:", error)
    setPaymentStatus("failed")
    setError(error.message || "Payment failed. Please try again.")
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="bg-white py-20 text-center">
          <p className="text-xl mb-4">Your cart is empty</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Continue Shopping
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="bg-gray-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {!user && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 md:p-4">
                  <p className="text-sm text-blue-900">
                    Please{" "}
                    <Link href="/login" className="font-semibold hover:underline">
                      login
                    </Link>{" "}
                    to continue with checkout
                  </p>
                </div>
              )}

              <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                <h2 className="text-lg md:text-xl font-bold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name *"
                    value={shippingAddress.name}
                    onChange={handleAddressChange}
                    className="col-span-1 md:col-span-2 px-3 md:px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={shippingAddress.email}
                    onChange={handleAddressChange}
                    className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address *"
                    value={shippingAddress.address}
                    onChange={handleAddressChange}
                    className="col-span-1 md:col-span-2 px-3 md:px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={shippingAddress.state}
                    onChange={handleAddressChange}
                    className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={shippingAddress.pincode}
                    onChange={handleAddressChange}
                    className="px-3 md:px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                <h2 className="text-lg md:text-xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 md:p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-sm md:text-base">Cash on Delivery</span>
                      <p className="text-xs text-gray-600 mt-1">Pay when your order arrives at your doorstep</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 md:p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="font-semibold text-sm md:text-base">Pay Online (Razorpay)</span>
                      <p className="text-xs text-gray-600 mt-1">UPI, Cards, Net Banking, Wallets</p>
                      {paymentMethod === "online" && (
                        <p className="text-xs text-green-600 font-medium mt-1">✓ Secure payment via Razorpay</p>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200">
                <h2 className="text-lg md:text-xl font-bold mb-4">Order Items</h2>
                <div className="space-y-3 md:space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 md:gap-4 pb-3 md:pb-4 border-b last:border-b-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-14 h-14 md:w-16 md:h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm md:text-base truncate">{item.name}</p>
                        <p className="text-xs md:text-sm text-gray-600">
                          {item.quantity} x ₹{item.price}
                        </p>
                      </div>
                      <p className="font-semibold text-sm md:text-base flex-shrink-0">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 h-fit lg:sticky lg:top-24">
              <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Order Summary</h2>

              {paymentStatus === "success" && (
                <div className="mb-4 md:mb-6 p-3 bg-green-50 border border-green-200 rounded flex items-start gap-2">
                  <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0 md:w-5 md:h-5" />
                  <p className="text-xs md:text-sm text-green-700">Payment processed successfully!</p>
                </div>
              )}

              {paymentStatus === "failed" && (
                <div className="mb-4 md:mb-6 p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2">
                  <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0 md:w-5 md:h-5" />
                  <p className="text-xs md:text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6 pb-4 md:pb-6 border-b">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span>₹{Math.round(total * 0.18).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex justify-between text-base md:text-lg font-bold mb-4 md:mb-6">
                <span>Total</span>
                <span>₹{totalWithTax.toLocaleString("en-IN")}</span>
              </div>

              <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-2">Payment Method</p>
                <p className="text-xs md:text-sm capitalize font-medium">
                  {paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment (Razorpay)"}
                </p>
                {paymentMethod === "cod" && (
                  <div className="mt-3 p-2 md:p-3 bg-blue-50 border border-blue-200 rounded text-xs">
                    <p className="font-semibold text-blue-900">COD Order</p>
                    <p className="text-blue-800 mt-1">Pay cash when your order arrives</p>
                  </div>
                )}
                {paymentMethod === "online" && (
                  <div className="mt-3 p-2 md:p-3 bg-green-50 border border-green-200 rounded text-xs">
                    <p className="font-semibold text-green-900">Secure Online Payment</p>
                    <p className="text-green-800 mt-1">Pay using UPI, Cards, Net Banking, or Wallets</p>
                  </div>
                )}
              </div>

              {paymentMethod === "online" ? (
                <RazorpayPayment
                  amount={totalWithTax}
                  orderId={`ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`}
                  customerDetails={{
                    name: shippingAddress.name,
                    email: shippingAddress.email,
                    phone: shippingAddress.phone,
                  }}
                  onSuccess={handlePaymentSuccess}
                  onFailure={handlePaymentFailure}
                  buttonText={`Pay ₹${totalWithTax.toLocaleString("en-IN")}`}
                  buttonClassName={`w-full py-2.5 md:py-3 text-sm md:text-base rounded font-semibold transition ${
                    user && !orderPlaced && !shippingAddress.name && !shippingAddress.phone && !shippingAddress.address
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-900"
                  }`}
                />
              ) : (
                <button
                  onClick={handleCODOrder}
                  disabled={!user || orderPlaced || loading || paymentStatus === "processing" || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address}
                  className={`w-full py-2.5 md:py-3 text-sm md:text-base rounded font-semibold transition ${
                    user && !orderPlaced && !(loading || paymentStatus === "processing") && shippingAddress.name && shippingAddress.phone && shippingAddress.address
                      ? "bg-black text-white hover:bg-gray-900"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      Processing Order...
                    </span>
                  ) : paymentStatus === "success" ? (
                    "Order Confirmed!"
                  ) : (
                    `Place COD Order - ₹${totalWithTax.toLocaleString("en-IN")}`
                  )}
                </button>
              )}
              {!user && <p className="text-xs md:text-sm text-gray-600 text-center mt-3">Login required to proceed</p>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
