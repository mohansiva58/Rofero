// Email notification service for order confirmations and promotional emails

export interface EmailTemplate {
  subject: string
  body: string
  html: string
}

export interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  items: Array<{
    name: string
    price: number
    quantity: number
  }>
  totalAmount: number
  shippingAddress: string
  paymentMethod: string
}

export interface PromotionalEmailData {
  recipientEmail: string
  recipientName: string
  discount: number
  productName: string
  productPrice: number
  validUntil: string
}

// Generate order confirmation email
export function generateOrderConfirmationEmail(data: OrderEmailData): EmailTemplate {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">₹${item.price.toLocaleString("en-IN")}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
    </tr>
  `,
    )
    .join("")

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #000; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; }
          .order-details { margin: 20px 0; }
          .section-title { font-weight: bold; margin-top: 20px; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th { background-color: #f0f0f0; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #000; }
          .total-row { background-color: #f0f0f0; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
          </div>
          <div class="content">
            <p>Dear ${data.customerName},</p>
            <p>Your order has been successfully placed. Here are the details:</p>

            <div class="order-details">
              <p><strong>Order ID:</strong> ${data.orderId}</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString("en-IN")}</p>
            </div>

            <div class="section-title">Order Items</div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td colspan="3" style="padding: 12px; text-align: right;">Total Amount:</td>
                  <td style="padding: 12px;">₹${data.totalAmount.toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
            </table>

            <div class="section-title">Shipping Address</div>
            <p>${data.shippingAddress}</p>

            <div class="section-title">Payment Method</div>
            <p>${data.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}</p>

            <p style="margin-top: 20px;">You will receive a tracking link via email once your order ships. Thank you for shopping with RARE RABBIT!</p>

            <a href="https://rarereabbit.com/track?order=${data.orderId}" class="button">Track Your Order</a>
          </div>
          <div class="footer">
            <p>&copy; 2025 RARE RABBIT. All rights reserved.</p>
            <p>If you have any questions, contact us at support@rarereabbit.com</p>
          </div>
        </div>
      </body>
    </html>
  `

  return {
    subject: `Order Confirmation - ${data.orderId}`,
    body: `Your order ${data.orderId} has been confirmed. Total: ₹${data.totalAmount.toLocaleString("en-IN")}`,
    html,
  }
}

// Generate promotional email
export function generatePromotionalEmail(data: PromotionalEmailData): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .banner { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 40px 20px; text-align: center; border-radius: 8px; }
          .banner h1 { font-size: 36px; margin: 0; }
          .banner .discount { font-size: 48px; font-weight: bold; }
          .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; margin-top: 20px; }
          .product-info { background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .expiry { color: #ff6b6b; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="banner">
            <p>Exclusive Offer Just For You!</p>
            <div class="discount">${data.discount}% OFF</div>
            <p style="margin: 10px 0;">On ${data.productName}</p>
          </div>

          <div class="content">
            <p>Hi ${data.recipientName},</p>
            <p>We have a special discount exclusively for you!</p>

            <div class="product-info">
              <h3>${data.productName}</h3>
              <p>
                <strong>Original Price:</strong> ₹${data.productPrice.toLocaleString("en-IN")}<br>
                <strong>Discounted Price:</strong> ₹${Math.round(data.productPrice * (1 - data.discount / 100)).toLocaleString("en-IN")}<br>
                <strong>You Save:</strong> ₹${Math.round(data.productPrice * (data.discount / 100)).toLocaleString("en-IN")}
              </p>
              <p class="expiry">Valid until: ${data.validUntil}</p>
            </div>

            <a href="https://rarereabbit.com/shop" class="button">Shop Now</a>
          </div>

          <div class="footer">
            <p>&copy; 2025 RARE RABBIT. All rights reserved.</p>
            <p>If you wish to unsubscribe from promotional emails, <a href="#" style="color: #0066cc;">click here</a></p>
          </div>
        </div>
      </body>
    </html>
  `

  return {
    subject: `Exclusive ${data.discount}% Discount on ${data.productName}`,
    body: `Get ${data.discount}% off on ${data.productName}. Limited time offer!`,
    html,
  }
}

// Mock email sending function (replace with actual service like SendGrid, Resend, etc.)
export async function sendEmail(to: string, template: EmailTemplate): Promise<{ success: boolean; messageId: string }> {
  try {
    // In production, integrate with email service like:
    // - Resend: https://resend.com
    // - SendGrid: https://sendgrid.com
    // - AWS SES: https://aws.amazon.com/ses/
    // - Nodemailer for self-hosted: https://nodemailer.com/

    console.log(`[Email] Sending to ${to}`)
    console.log(`[Email] Subject: ${template.subject}`)
    console.log(`[Email] Body: ${template.body}`)

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          messageId: `msg_${Math.random().toString(36).substr(2, 9)}`,
        })
      }, 1000)
    })
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, messageId: "" }
  }
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<boolean> {
  const template = generateOrderConfirmationEmail(data)
  const result = await sendEmail(data.customerEmail, template)
  return result.success
}

// Send promotional email
export async function sendPromotionalEmail(data: PromotionalEmailData): Promise<boolean> {
  const template = generatePromotionalEmail(data)
  const result = await sendEmail(data.recipientEmail, template)
  return result.success
}
