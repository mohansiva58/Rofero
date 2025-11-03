# Razorpay Payment Gateway Integration Guide

## 🎯 Overview
Razorpay payment gateway has been successfully integrated into THE HOUSE OF RARE e-commerce platform. This integration supports:
- UPI payments
- Credit/Debit cards
- Net Banking
- Wallets (Paytm, PhonePe, etc.)
- EMI options

## 📋 Prerequisites

### 1. Get Razorpay Account
1. Visit https://dashboard.razorpay.com/signup
2. Create your account
3. Complete KYC verification

### 2. Get API Keys
1. Login to Razorpay Dashboard: https://dashboard.razorpay.com/
2. Go to Settings → API Keys
3. Generate Test Keys (for testing)
4. Generate Live Keys (for production)

## 🔐 Environment Setup

### Update `.env.local` file with your Razorpay credentials:

```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx          # Your Test Key ID
RAZORPAY_KEY_SECRET=your_key_secret_here      # Your Test Key Secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx  # Same as RAZORPAY_KEY_ID
```

### For Production:
Replace `rzp_test_` with `rzp_live_` and use your Live Keys:
```bash
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
```

## 📁 Files Added/Modified

### New Files Created:
1. **`lib/razorpay.ts`** - Razorpay utility functions
2. **`components/razorpay-payment.tsx`** - Reusable payment component
3. **`app/api/payment/create-order/route.ts`** - API to create Razorpay order
4. **`app/api/payment/verify/route.ts`** - API to verify payment

### Modified Files:
1. **`app/checkout/page.tsx`** - Integrated Razorpay payment button
2. **`.env.local`** - Added Razorpay configuration

## 🚀 How It Works

### Payment Flow:

1. **User selects "Pay Online"** on checkout page
2. **System creates Razorpay order** via `/api/payment/create-order`
3. **Razorpay checkout opens** with payment options
4. **User completes payment** using preferred method
5. **Payment verification** happens via `/api/payment/verify`
6. **Order confirmation** and redirect to success page

## 💻 Using the Razorpay Component

### Basic Usage:
```tsx
import RazorpayPayment from "@/components/razorpay-payment"

<RazorpayPayment
  amount={5299}
  orderId="ORD-12345"
  customerDetails={{
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210"
  }}
  onSuccess={(response) => {
    console.log("Payment successful:", response)
    // Handle success
  }}
  onFailure={(error) => {
    console.log("Payment failed:", error)
    // Handle failure
  }}
  buttonText="Pay Now"
/>
```

## 🧪 Testing

### Test Cards:
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

### Test UPI:
```
UPI ID: success@razorpay
```

### Test Net Banking:
Select any bank and use these credentials:
```
Username: razorpay
Password: razorpay
```

## 📊 Razorpay Dashboard

Monitor your transactions at:
- Test Mode: https://dashboard.razorpay.com/app/dashboard
- Live Mode: Switch to "Live Mode" in dashboard

### What you can do:
- View all transactions
- Issue refunds
- Download reports
- Manage settlements
- Set up webhooks

## 🔒 Security Features

✅ **Signature Verification** - Every payment is verified server-side
✅ **HTTPS Only** - All transactions over secure connection
✅ **PCI DSS Compliant** - Razorpay is PCI DSS Level 1 certified
✅ **3D Secure** - Additional authentication for cards
✅ **Fraud Detection** - Built-in fraud prevention

## 💰 Pricing

### Razorpay Charges:
- **2%** per successful transaction
- No setup fees
- No annual maintenance charges

### Example:
- Order Amount: ₹5,299
- Razorpay Fee: ₹106 (2%)
- You Receive: ₹5,193

## 🎨 Customization

### Change Brand Color:
In `lib/razorpay.ts`:
```typescript
theme: {
  color: "#000000", // Your brand color
}
```

### Change Company Name:
```typescript
name: "YOUR COMPANY NAME",
description: "Your description",
```

### Change Logo:
```typescript
image: "/your-logo.png",
```

## 🔄 Refunds

Refunds can be processed:

1. **Via Dashboard** - Manually in Razorpay dashboard
2. **Via API** - Use the `refundPayment` function:

```typescript
import { refundPayment } from "@/lib/razorpay"

// Full refund
await refundPayment("pay_xxxxxxxxxx")

// Partial refund
await refundPayment("pay_xxxxxxxxxx", 1000) // ₹1000
```

## 📱 Mobile Support

✅ Works on all devices
✅ Responsive design
✅ Native UPI apps open automatically
✅ In-app browser support

## 🐛 Troubleshooting

### Issue: "Key ID is required"
**Solution**: Make sure `.env.local` has `NEXT_PUBLIC_RAZORPAY_KEY_ID`

### Issue: Payment signature verification fails
**Solution**: Check that `RAZORPAY_KEY_SECRET` in `.env.local` is correct

### Issue: Razorpay checkout not opening
**Solution**: Check browser console for errors and ensure internet connection

### Issue: Amount mismatch
**Solution**: Razorpay accepts amount in **paise** (multiply by 100)

## 📞 Support

### Razorpay Support:
- Email: support@razorpay.com
- Phone: 1800-102-0333
- Docs: https://razorpay.com/docs/

### Integration Support:
Check the code comments in:
- `lib/razorpay.ts`
- `components/razorpay-payment.tsx`

## ✅ Checklist Before Going Live

- [ ] Replace test keys with live keys
- [ ] Complete KYC verification
- [ ] Test all payment methods
- [ ] Set up webhook for automatic order updates
- [ ] Configure auto-refund policies
- [ ] Add terms and conditions
- [ ] Test on mobile devices
- [ ] Verify email notifications
- [ ] Check settlement account details
- [ ] Enable required payment methods in dashboard

## 🎉 You're All Set!

Your Razorpay integration is complete. Just update the `.env.local` file with your actual keys and you're ready to accept payments!

Remember:
- Use **Test Keys** for development
- Use **Live Keys** only in production
- Never commit API keys to Git
- Monitor transactions regularly in dashboard
