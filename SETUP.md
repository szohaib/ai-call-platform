# AI Call Platform - Setup Guide

This guide will help you set up the authentication and credit system for the AI Call Platform.

## Prerequisites

1. **Firebase Project**: Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. **Stripe Account**: Create a Stripe account at [stripe.com](https://stripe.com)
3. **Existing Setup**: VAPI and Twilio credentials (already configured)

---

## Part 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `ai-call-platform` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 1.2 Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Enable **Email/Password**:
   - Click "Email/Password"
   - Toggle "Enable"
   - Click "Save"
3. Enable **Google Sign-In**:
   - Click "Google"
   - Toggle "Enable"
   - Add your support email
   - Click "Save"

### 1.3 Set Up Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Production mode** (we'll set rules later)
3. Select a location closest to your users
4. Click "Enable"

### 1.4 Configure Firestore Security Rules

1. In Firestore, go to **Rules** tab
2. Replace with the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read/write their own calls
    match /calls/{callId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
    
    // Users can read their own transactions
    match /creditTransactions/{transactionId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Users can read their own payments
    match /payments/{paymentId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

### 1.5 Get Firebase Web Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" → Click **Web** icon (</>)
3. Register app: `ai-call-platform-web`
4. Copy the `firebaseConfig` object
5. Update `frontend/index.html` with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 1.6 Get Service Account Key (Backend)

1. Go to **Project Settings** → **Service accounts**
2. Click "Generate new private key"
3. Save the JSON file

**For Railway deployment:**
- Copy the **entire JSON content**
- In Railway, add environment variable:
  - Name: `FIREBASE_SERVICE_ACCOUNT`
  - Value: Paste the entire JSON (as a string)

**For local development:**
- Save the file as `firebase-service-account.json` in the project root
- Add to `.gitignore` (already done)

---

## Part 2: Stripe Setup

### 2.1 Get Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** → **API keys**
3. Copy:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)

### 2.2 Configure Stripe Webhook

1. Go to **Developers** → **Webhooks**
2. Click "Add endpoint"
3. Endpoint URL: `https://backend-production-ae6e.up.railway.app/api/payments/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)

### 2.3 Update Environment Variables

Add to your `.env` file:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 2.4 Update Frontend

In `frontend/index.html`, replace:

```javascript
const stripe = Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
```

With your actual publishable key:

```javascript
const stripe = Stripe('pk_test_xxxxxxxxxxxxx');
```

---

## Part 3: Environment Variables

### 3.1 Complete .env File

Your `.env` file should include:

```bash
# Server
PORT=3000
BACKEND_URL=https://backend-production-ae6e.up.railway.app
FRONTEND_URL=https://szohaib.github.io/ai-call-platform

# Twilio (existing)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+15077087995

# VAPI (existing)
VAPI_API_KEY=your_vapi_key

# Firebase (for backend)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 3.2 Railway Environment Variables

Add these to Railway:

1. Go to your Railway project
2. Click on your service
3. Go to **Variables** tab
4. Add each variable from the `.env` file above

**Important:**
- `FIREBASE_SERVICE_ACCOUNT` should be the entire JSON content (paste as a single line)
- `BACKEND_URL` should be your Railway URL
- `FRONTEND_URL` should be your GitHub Pages URL

---

## Part 4: Testing

### 4.1 Test Authentication

1. Open your frontend: `https://szohaib.github.io/ai-call-platform`
2. Click "Sign Up"
3. Enter email and password
4. Check Firebase Console → Authentication to see the new user

### 4.2 Test Whitelisted User

1. Create an account with email: `syedzohaibak@gmail.com`
2. Check that credits show as "Unlimited"
3. Make a test call - credits should not be deducted

### 4.3 Test Credit Purchase (Test Mode)

1. Sign in with a non-whitelisted account
2. Click "Buy Credits"
3. Select a package
4. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
5. Complete payment
6. Check that credits are added to your account

### 4.4 Test Call Flow

1. Make sure you have credits
2. Select a template
3. Enter a phone number
4. Click "Make Call"
5. After call completes, check:
   - Credits deducted correctly
   - Call appears in history with duration
   - Transaction logged in Firestore

---

## Part 5: Deployment

### 5.1 Backend (Railway)

Already deployed! Just need to:

1. Push your code to GitHub
2. Railway will auto-deploy
3. Verify environment variables are set

### 5.2 Frontend (GitHub Pages)

Already deployed at: `https://szohaib.github.io/ai-call-platform`

**Important:** Update Firebase and Stripe keys in `frontend/index.html` before deploying!

---

## Part 6: Monitoring

### 6.1 Firebase Console

Monitor:
- **Authentication**: User signups and logins
- **Firestore**: Check collections (users, calls, creditTransactions, payments)

### 6.2 Stripe Dashboard

Monitor:
- **Payments**: Successful and failed transactions
- **Webhooks**: Webhook delivery status

### 6.3 Railway Logs

Monitor:
- API requests
- Credit deductions
- Webhook events
- Errors

---

## Part 7: Going to Production

### 7.1 Stripe Production Mode

1. In Stripe Dashboard, toggle to **Live mode**
2. Get new API keys (live keys start with `pk_live_` and `sk_live_`)
3. Update environment variables
4. Update webhook endpoint to use live mode

### 7.2 Firebase Production Rules

1. Review and tighten Firestore security rules
2. Set up Firebase Authentication email templates
3. Configure authorized domains for OAuth

### 7.3 Security Checklist

- [ ] All API keys in environment variables (never in code)
- [ ] CORS configured for production domain only
- [ ] Firebase security rules tested
- [ ] Stripe webhook signature verification enabled
- [ ] HTTPS enabled (Railway provides this automatically)
- [ ] Rate limiting implemented (consider adding)

---

## Troubleshooting

### Firebase Authentication Issues

**Problem:** "Firebase: Error (auth/invalid-api-key)"
- **Solution:** Check that `apiKey` in `frontend/index.html` matches Firebase console

**Problem:** "Firebase: Error (auth/unauthorized-domain)"
- **Solution:** Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Stripe Payment Issues

**Problem:** Webhook not receiving events
- **Solution:** Check webhook URL is correct and publicly accessible

**Problem:** Payment succeeds but credits not added
- **Solution:** Check Railway logs for webhook processing errors

### Credit Deduction Issues

**Problem:** Credits not deducted after call
- **Solution:** Verify VAPI webhook is configured with correct `serverUrl`

**Problem:** Whitelisted user credits being deducted
- **Solution:** Check email/phone matches exactly in `backend/services/creditService.js`

---

## Support

For issues specific to:
- **Firebase**: [Firebase Documentation](https://firebase.google.com/docs)
- **Stripe**: [Stripe Documentation](https://stripe.com/docs)
- **VAPI**: [VAPI Documentation](https://docs.vapi.ai)

---

## Next Steps

1. Test the entire flow end-to-end
2. Invite beta users to test
3. Monitor for any errors
4. Adjust credit pricing if needed
5. Add more features (call analytics, SMS notifications, etc.)

Good luck! 🚀
