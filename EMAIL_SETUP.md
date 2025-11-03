# Email Notification System - Setup Guide

## 📧 Overview

The House of Rare now includes an automated email notification system using Nodemailer with modern, responsive HTML templates. Emails are sent for:

- ✅ **Welcome Email** - When users log in for the first time
- 📦 **Order Shipped** - When admin marks order as "Shipped"
- 🎉 **Order Delivered** - When admin marks order as "Delivered"
- ❌ **Order Cancelled** - When admin marks order as "Cancelled"

---

## 🚀 Quick Setup

### Step 1: Install Dependencies
Already installed! If you need to reinstall:
```bash
npm install nodemailer @types/nodemailer --legacy-peer-deps
```

### Step 2: Configure Email Service

#### For Gmail (Recommended):

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer" (or Other)
   - Copy the 16-character password

3. **Update `.env.local`**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

#### For Other Email Providers:

**Outlook/Hotmail:**
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=youremail@outlook.com
EMAIL_PASS=your-password
```

**Yahoo:**
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=youremail@yahoo.com
EMAIL_PASS=your-app-password
```

**Custom SMTP:**
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_USER=your-username
EMAIL_PASS=your-password
```

### Step 3: Test Email Configuration

Restart your dev server after updating `.env.local`:
```bash
npm run dev
```

---

## 📬 How It Works

### Admin Dashboard - Order Status Updates

When an admin changes order status in the dashboard:

```typescript
// Automatically triggered for: shipped, delivered, cancelled
1. Admin changes dropdown → Status updates in DB
2. System fetches order details
3. Email sent to customer with:
   - Order number & date
   - Items & total
   - Tracking timeline
   - Shipping address
   - Action buttons
```

### Email Templates

All templates are modern, responsive, and mobile-friendly with:
- ✨ Clean design with gradient headers
- 📱 Fully responsive for mobile devices
- 🎨 Color-coded status badges
- 📊 Visual tracking timeline (for shipped orders)
- 🔘 Call-to-action buttons
- 📧 Support contact information

---

## 🎨 Email Types & Content

### 1. Welcome Email
**Triggered:** When user logs in (manual trigger from client)
**Subject:** "Welcome to The House of Rare!"
**Contains:**
- Personalized greeting
- Shop introduction
- Call-to-action to start shopping
- Feature highlights

### 2. Order Shipped Email
**Triggered:** Admin changes status to "Shipped"
**Subject:** "📦 Your Order Has Been Shipped!"
**Contains:**
- Order details (number, date, total)
- Tracking timeline (visual progress)
- Shipping address
- Track order button
- Estimated delivery

### 3. Order Delivered Email
**Triggered:** Admin changes status to "Delivered"
**Subject:** "🎉 Your Order Has Been Delivered!"
**Contains:**
- Delivery confirmation
- Order summary
- Review request
- Shop again button

### 4. Order Cancelled Email
**Triggered:** Admin changes status to "Cancelled"
**Subject:** "Order Cancelled - The House of Rare"
**Contains:**
- Cancellation confirmation
- Order details
- Refund information (COD vs Online)
- Continue shopping button
- Support contact

---

## 🔧 API Endpoints

### Send Email API
**Endpoint:** `POST /api/send-email`

**Request Body:**
```json
{
  "to": "customer@example.com",
  "subject": "Email Subject",
  "type": "welcome|orderShipped|orderDelivered|orderCancelled",
  "data": {
    "userName": "John Doe",
    "orderNumber": "ORD-123456",
    "orderDate": "2025-01-01",
    "total": 2999,
    "itemCount": 2,
    "paymentMethod": "cod",
    "shippingAddress": {
      "name": "John Doe",
      "address": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "phone": "9876543210"
    },
    "trackUrl": "http://localhost:3000/my-orders",
    "shopUrl": "http://localhost:3000/shop"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id@gmail.com>"
}
```

---

## 🐛 Troubleshooting

### Email Not Sending

1. **Check Environment Variables**
   ```bash
   # Verify .env.local has correct values
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

2. **Gmail App Password Issues**
   - Make sure 2FA is enabled
   - Generate a NEW app password
   - Use the 16-character password (no spaces)
   - Don't use your regular Gmail password

3. **Check Server Logs**
   ```bash
   # Look for email-related errors in terminal
   [Email] Error sending email: ...
   ```

4. **Test Email Configuration**
   - Visit `/api/send-email` endpoint
   - Check if SMTP connection works

### Common Errors

**"Invalid login"**
- Using regular password instead of app password
- 2FA not enabled
- Incorrect email/password

**"Connection timeout"**
- Firewall blocking port 587
- Wrong EMAIL_HOST
- ISP blocking SMTP

**"Missing required fields"**
- Check API request includes: to, subject, type, data

---

## 🎯 Manual Email Trigger (For Login)

To send welcome email after Firebase login, add this to your login success handler:

```typescript
// In your login component (after successful Firebase auth)
const sendWelcomeEmail = async (user: any) => {
  try {
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: user.email,
        subject: 'Welcome to The House of Rare!',
        type: 'welcome',
        data: {
          userName: user.displayName || user.email.split('@')[0],
          shopUrl: `${window.location.origin}/shop`,
        },
      }),
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

// Call after successful login
await signInWithEmailAndPassword(auth, email, password)
await sendWelcomeEmail(auth.currentUser)
```

---

## 📝 Customization

### Modify Email Templates

Edit `/lib/email.ts`:

```typescript
// Find the template section
const templates = {
  welcome: `...`, // Edit HTML here
  orderShipped: `...`,
  orderDelivered: `...`,
  orderCancelled: `...`,
}
```

### Change Email Styling

Update the `baseStyles` constant in `/lib/email.ts`:

```typescript
const baseStyles = `
  body { font-family: 'Segoe UI', ... }
  .container { max-width: 600px; ... }
  .header { background: linear-gradient(...); }
  ...
`
```

### Add New Email Type

1. Add template in `/lib/email.ts`
2. Update `validTypes` in `/app/api/send-email/route.ts`
3. Call from your code with the new type

---

## ✅ Testing Checklist

- [ ] Environment variables configured
- [ ] Dev server restarted
- [ ] Test order status change (Shipped)
- [ ] Check customer receives email
- [ ] Verify email renders correctly
- [ ] Test on mobile device
- [ ] Confirm links work
- [ ] Check spam folder if not received

---

## 📞 Support

For issues or questions:
- Check terminal logs for errors
- Verify SMTP credentials
- Test with a different email provider
- Check firewall/antivirus settings

---

## 🎉 You're All Set!

Your email notification system is now configured. Customers will receive beautiful, professional emails when:
- ✅ They log in (manual trigger)
- 📦 Orders are shipped
- 🎉 Orders are delivered  
- ❌ Orders are cancelled

Happy coding! 🚀
