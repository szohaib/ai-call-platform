# 📞 AI Call Platform

A full-stack platform for making AI-powered voice calls with authentication, credit system, and payment processing.

## ✨ Features

- 🔐 **Firebase Authentication** - Email/password and Google sign-in
- 💳 **Credit System** - Purchase call credits with Stripe
- 📞 **AI Voice Calls** - Powered by VAPI and Twilio
- 🎯 **Pre-built Templates** - Wake-up calls, reminders, surveys, and more
- 📊 **Call History** - Track all your calls and usage
- 🎁 **Whitelisted Users** - Free unlimited credits for special users
- 💰 **Volume Discounts** - Better rates for larger credit purchases

## 🚀 Tech Stack

**Frontend:**
- Vue.js 3 (CDN)
- Firebase Auth (Client SDK)
- Stripe.js
- Deployed on GitHub Pages

**Backend:**
- Node.js + Express
- Firebase Admin SDK (Authentication & Firestore)
- Stripe (Payment processing)
- VAPI (AI voice calls)
- Twilio (Phone infrastructure)
- Deployed on Railway

## 📦 Credit Packages

| Package | Price | Minutes | Rate/min | Discount |
|---------|-------|---------|----------|----------|
| Starter | $10 | 50 | $0.20 | - |
| Popular | $25 | 150 | $0.17 | 17% off |
| Premium | $50 | 350 | $0.14 | 29% off |

**Whitelisted Users** (Unlimited Credits):
- syedzohaibak@gmail.com
- +919700069793

## 🏗️ Architecture

```
┌─────────────────┐
│  Frontend (Vue) │ ← User authentication (Firebase)
│  GitHub Pages   │ ← Credit management UI
└────────┬────────┘ ← Payment processing (Stripe)
         │
         │ HTTPS/REST API
         │
┌────────▼────────┐
│ Backend (Node)  │ ← Firebase Admin (auth verification)
│    Railway      │ ← Firestore (user data, credits)
└────────┬────────┘ ← Stripe (payment webhooks)
         │          ← VAPI (call initiation)
         │
    ┌────▼────┐
    │  VAPI   │ ← AI voice assistant
    └────┬────┘
         │
    ┌────▼────┐
    │ Twilio  │ ← Actual phone calls
    └─────────┘
```

## 🔧 Setup

See [SETUP.md](./SETUP.md) for detailed setup instructions.

**Quick Start:**

1. **Clone the repo**
   ```bash
   git clone https://github.com/szohaib/ai-call-platform.git
   cd ai-call-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Set up Firebase**
   - Create Firebase project
   - Enable Authentication (Email & Google)
   - Create Firestore database
   - Download service account key

5. **Set up Stripe**
   - Get API keys
   - Configure webhook endpoint

6. **Run locally**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/credits` - Get credit balance
- `GET /api/auth/transactions` - Get transaction history

### Calls
- `POST /api/calls/make` - Initiate a call (requires auth & credits)
- `GET /api/calls/history` - Get call history
- `GET /api/calls/status/:callId` - Get call status
- `POST /api/calls/webhook` - VAPI webhook (call completion)

### Payments
- `GET /api/payments/packages` - Get available credit packages
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/webhook` - Stripe webhook (payment processing)
- `GET /api/payments/history` - Get payment history

### Templates
- `GET /api/templates` - Get all call templates

## 🔐 Security

- **Authentication:** All sensitive endpoints require Firebase ID token
- **Authorization:** Users can only access their own data
- **Firestore Rules:** Strict read/write rules enforced
- **Stripe Webhooks:** Signature verification enabled
- **Environment Variables:** All secrets in env vars, never in code
- **HTTPS:** Enforced on all endpoints (Railway default)

## 💾 Database Schema

### Firestore Collections

**users**
```javascript
{
  uid: string,
  email: string,
  phoneNumber: string | null,
  credits: number,  // Minutes
  isWhitelisted: boolean,
  createdAt: timestamp,
  updatedAt: timestamp,
  totalCallsMade: number,
  totalMinutesUsed: number
}
```

**calls**
```javascript
{
  id: string,  // VAPI call ID
  userId: string,
  userEmail: string,
  phoneNumber: string,
  templateId: string,
  template: string,
  status: string,
  estimatedMinutes: number,
  actualDuration: number,
  minutesUsed: number,
  creditsDeducted: boolean,
  createdAt: timestamp,
  completedAt: timestamp
}
```

**creditTransactions**
```javascript
{
  userId: string,
  type: 'purchase' | 'deduction',
  amount: number,  // Minutes
  packageId: string | null,
  paymentId: string | null,
  callId: string | null,
  balanceBefore: number,
  balanceAfter: number,
  createdAt: timestamp
}
```

**payments**
```javascript
{
  userId: string,
  paymentIntentId: string,
  packageId: string,
  amount: number,  // Cents
  minutes: number,
  status: 'succeeded' | 'failed',
  error: string | null,
  createdAt: timestamp
}
```

## 🎯 Call Flow

1. **User initiates call**
   - Frontend: User selects template, enters phone number
   - Frontend validates input and checks credits
   
2. **Credit check**
   - Backend: Verify user has enough credits
   - Whitelisted users bypass this check
   
3. **Call initiation**
   - Backend: Create VAPI call with Twilio integration
   - Store call record in Firestore
   
4. **Call in progress**
   - VAPI handles the AI conversation
   - Twilio manages the phone connection
   
5. **Call completion**
   - VAPI sends webhook to backend
   - Backend calculates actual duration
   - Credits deducted based on minutes used
   - Transaction logged in Firestore

## 🧪 Testing

**Test Authentication:**
```bash
# Sign up with test email
Email: test@example.com
Password: testpassword123
```

**Test Stripe (Test Mode):**
```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

**Test Whitelisted User:**
```bash
# Create account with whitelisted email
Email: syedzohaibak@gmail.com
# Should see "Unlimited" credits
```

## 📊 Monitoring

- **Firebase Console:** User auth, Firestore data
- **Stripe Dashboard:** Payments, webhooks
- **Railway Logs:** API requests, errors
- **VAPI Dashboard:** Call analytics

## 🚀 Deployment

**Backend (Railway):**
- Connected to GitHub repo
- Auto-deploys on push to main
- Environment variables configured in Railway dashboard

**Frontend (GitHub Pages):**
- Hosted at: https://szohaib.github.io/ai-call-platform
- Update Firebase/Stripe config before deploying

## 📝 Environment Variables

Required environment variables (see `.env.example`):

- `BACKEND_URL` - Railway backend URL
- `FRONTEND_URL` - GitHub Pages frontend URL
- `TWILIO_ACCOUNT_SID` - Twilio credentials
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- `VAPI_API_KEY` - VAPI API key
- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

## 🐛 Troubleshooting

See [SETUP.md](./SETUP.md) for detailed troubleshooting guide.

Common issues:
- **Authentication errors:** Check Firebase config in frontend
- **Webhook failures:** Verify webhook URLs and secrets
- **Credit deduction issues:** Check VAPI webhook configuration
- **Payment issues:** Verify Stripe keys and webhook

## 📜 License

MIT

## 👤 Author

**Zohaib**
- Email: syedzohaibak@gmail.com
- Phone: +919700069793

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🔮 Future Enhancements

- [ ] SMS notifications for call status
- [ ] Call recording playback
- [ ] Advanced analytics dashboard
- [ ] Recurring subscriptions
- [ ] API rate limiting
- [ ] Multi-language support
- [ ] Call scheduling
- [ ] Team accounts with shared credits
- [ ] Webhook integration for custom workflows
- [ ] Mobile app (React Native)

---

**Live URLs:**
- Frontend: https://szohaib.github.io/ai-call-platform
- Backend: https://backend-production-ae6e.up.railway.app
- API Health: https://backend-production-ae6e.up.railway.app/health

**Status:** ✅ Ready for Review
