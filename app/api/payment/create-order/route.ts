import { NextResponse } from "next/server"
import { createRazorpayOrder } from "@/lib/razorpay"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, receipt, customerDetails } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const order = await createRazorpayOrder(amount, receipt)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error("Create order error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    )
  }
}
