import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, type, data } = body

    // Validate required fields
    if (!to || !subject || !type || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to, subject, type, data' },
        { status: 400 }
      )
    }

    // Validate email type
    const validTypes = ['welcome', 'orderShipped', 'orderDelivered', 'orderCancelled']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid email type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Send email
    const result = await sendEmail({ to, subject, type, data })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('[Send Email API] Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}
