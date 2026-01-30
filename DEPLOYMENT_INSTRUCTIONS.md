# Deployment Instructions

## ⚠️ Important: DO NOT Deploy Yet!

This branch contains authentication and credit system changes that require configuration before deployment.

---

## Current Status

✅ **Completed:**
- All code written and committed to branch `feature/auth-and-credits`
- Firebase Authentication integration (Email/Password + Google)
- Credit system with Firestore
- Stripe payment integration
- Updated frontend with login/signup UI
- Credit management and purchase flow
- Call history with duration tracking
- Whitelisted user support (Zohaib: unlimited credits)
- Comprehensive documentation

📝 **Branch:** `feature/auth-and-credits`  
📝 **Commit:** `76602e2` - "feat: Add authentication and credit system"

---

## Step 1: Push to GitHub

Since SSH authentication isn't configured, you'll need to push manually:

### Option A: Using Personal Access Token (Recommended)

1. **Create a Personal Access Token on GitHub:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full control)
   - Generate and copy the token

2. **Configure Git to use the token:**
   ```bash
   cd ~/Code/ai-call-platform
   
   # Set remote to use HTTPS with token
   git remote set-url origin https://YOUR_TOKEN@github.com/szohaib/ai-call-platform.git
   
   # Push the branch
   git push -u origin feature/auth-and-credits
   ```

### Option B: Add SSH Key to GitHub

1. **Copy your SSH public key:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   
   Output:
   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOSxm3MYwa8Dpw4GyDoS8MNjOSnn0AatW9cHb8mdkJdp wakemate-vm
   ```

2. **Add to GitHub:**
   - Go to https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the key
   - Save

3. **Push the branch:**
   ```bash
   cd ~/Code/ai-call-platform
   git push -u origin feature/auth-and-credits
   ```

---

## Step 2: Create Pull Request

1. **Go to GitHub repository:**
   https://github.com/szohaib/ai-call-platform

2. **You'll see a banner:** "Compare & pull request" for branch `feature/auth-and-credits`

3. **Click it and fill in:**
   - **Title:** `Add Authentication and Credit System`
   - **Description:** Use the template below

### PR Description Template:

```markdown
## 🎯 Overview

This PR adds a complete authentication and credit management system to the AI Call Platform.

## ✨ Features Added

### Authentication
- ✅ Firebase Authentication (Email/Password)
- ✅ Google Sign-In support
- ✅ Protected API routes with JWT verification
- ✅ User profile management

### Credit System
- ✅ Credit-based calling (minutes)
- ✅ Pre-call credit verification
- ✅ Post-call automatic deduction
- ✅ Whitelisted users with unlimited credits
- ✅ Credit purchase with Stripe

### Payment Integration
- ✅ Stripe payment processing
- ✅ Three credit packages with volume discounts:
  - Starter: $10 = 50 minutes
  - Popular: $25 = 150 minutes (17% discount)
  - Premium: $50 = 350 minutes (29% discount)
- ✅ Webhook integration for automatic credit addition
- ✅ Payment history tracking

### UI Enhancements
- ✅ Login/Signup pages
- ✅ Credits display in header
- ✅ Buy Credits modal
- ✅ Low credit warnings
- ✅ Enhanced call history with duration
- ✅ Transaction history

### Backend Improvements
- ✅ Firebase Admin SDK integration
- ✅ Firestore database for user data
- ✅ Authentication middleware
- ✅ Credit management service
- ✅ New API routes: `/api/auth`, `/api/payments`
- ✅ Updated `/api/calls` with auth and credit checks
- ✅ VAPI webhook for call completion
- ✅ Stripe webhook for payment processing

## 🔧 Configuration Required

⚠️ **Before deploying, you MUST configure:**

1. **Firebase:**
   - Create Firebase project
   - Enable Authentication (Email + Google)
   - Create Firestore database
   - Download service account key
   - See `SETUP.md` for detailed instructions

2. **Stripe:**
   - Get API keys (test mode ready)
   - Configure webhook endpoint
   - See `SETUP.md` for detailed instructions

3. **Environment Variables:**
   - Add to Railway dashboard (backend)
   - Update `frontend/index.html` (Firebase/Stripe keys)
   - See `.env.example` for all required variables

## 📚 Documentation

- ✅ `SETUP.md` - Complete setup guide
- ✅ `README.md` - Updated with new features and architecture
- ✅ `.env.example` - All environment variables
- ✅ Code comments throughout

## 🧪 Testing Checklist

After configuration:
- [ ] Test email/password signup
- [ ] Test Google sign-in
- [ ] Test credit purchase (use Stripe test card: 4242 4242 4242 4242)
- [ ] Test whitelisted user (syedzohaibak@gmail.com)
- [ ] Make a test call and verify credit deduction
- [ ] Check call history
- [ ] Check transaction history
- [ ] Verify webhooks (VAPI and Stripe)

## 🚀 Deployment Steps

1. ✅ Review this PR
2. ⬜ Set up Firebase (follow `SETUP.md`)
3. ⬜ Set up Stripe (follow `SETUP.md`)
4. ⬜ Add environment variables to Railway
5. ⬜ Update `frontend/index.html` with Firebase/Stripe config
6. ⬜ Merge this PR
7. ⬜ Railway will auto-deploy backend
8. ⬜ Deploy frontend to GitHub Pages
9. ⬜ Test end-to-end

## ⚠️ Breaking Changes

This is a major update. After merging:
- All API calls will require authentication
- Users must sign up/login to use the platform
- Calls will require credits

## 🎁 Whitelisted Users

The following users automatically get unlimited credits:
- syedzohaibak@gmail.com
- +919700069793

## 📊 Database Schema

New Firestore collections:
- `users` - User profiles and credit balances
- `calls` - Call records with duration
- `creditTransactions` - Credit purchase/deduction logs
- `payments` - Stripe payment records

## 🔐 Security

- Firebase ID token verification on all protected routes
- Firestore security rules enforced
- Stripe webhook signature verification
- User data isolation
- HTTPS enforced (Railway default)

## 📝 Files Changed

- 14 files changed
- 3,764 insertions
- 189 deletions

**New files:**
- `backend/config/firebase.js`
- `backend/middleware/auth.js`
- `backend/routes/auth.js`
- `backend/routes/payments.js`
- `backend/services/creditService.js`
- `SETUP.md`
- `.env.example`

**Updated files:**
- `backend/server.js`
- `backend/routes/calls.js`
- `frontend/index.html`
- `README.md`
- `package.json`

## 🐛 Known Issues

None - Ready for review!

## 👀 Review Focus Areas

1. Security implementation (auth middleware, Firestore rules)
2. Credit calculation logic (pre-call check, post-call deduction)
3. Webhook handling (VAPI, Stripe)
4. Frontend UX (login flow, credit display)
5. Error handling

## 📞 Questions?

Contact: syedzohaibak@gmail.com / +919700069793
```

4. **Create the PR**

---

## Step 3: Configure Services (Before Merging)

Follow the detailed instructions in `SETUP.md`:

### Firebase Setup
1. Create project at https://console.firebase.google.com
2. Enable Email/Password authentication
3. Enable Google sign-in
4. Create Firestore database
5. Set security rules
6. Get web config (for frontend)
7. Download service account key (for backend)

### Stripe Setup
1. Get API keys from https://dashboard.stripe.com
2. Configure webhook endpoint
3. Add webhook secret

### Environment Variables

**Railway (Backend):**
Add these in Railway dashboard → Your Service → Variables:

```bash
BACKEND_URL=https://backend-production-ae6e.up.railway.app
FRONTEND_URL=https://szohaib.github.io/ai-call-platform
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+15077087995
VAPI_API_KEY=your_vapi_key
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}  # Entire JSON
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Frontend (`frontend/index.html`):**

Update lines 723-730:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Update line 736:
```javascript
const stripe = Stripe('pk_test_...');  // Your publishable key
```

---

## Step 4: Merge and Deploy

1. **Review the PR thoroughly**
2. **Ensure all services are configured**
3. **Merge the PR**
4. **Railway will auto-deploy the backend**
5. **Push updated `frontend/index.html` to trigger GitHub Pages deploy**

---

## Step 5: Post-Deployment Testing

1. **Test Authentication:**
   - Sign up with email/password
   - Sign in with Google
   - Verify user profile in Firebase Console

2. **Test Whitelisted User:**
   - Create account: syedzohaibak@gmail.com
   - Verify unlimited credits shown
   - Make a call
   - Verify credits NOT deducted

3. **Test Credit Purchase:**
   - Use test card: 4242 4242 4242 4242
   - Purchase a package
   - Verify credits added
   - Check Stripe Dashboard

4. **Test Call Flow:**
   - Make a call with sufficient credits
   - Wait for call to complete
   - Verify credits deducted correctly
   - Check call history shows duration

5. **Test Webhooks:**
   - Check Railway logs for VAPI webhook events
   - Check Stripe Dashboard → Webhooks for delivery status

---

## 🆘 Troubleshooting

If something doesn't work:

1. **Check Railway logs** for backend errors
2. **Check browser console** for frontend errors
3. **Verify environment variables** are set correctly
4. **Check Firebase Console** → Authentication for user creation
5. **Check Firestore** for data storage
6. **Check Stripe Dashboard** for payment status

See `SETUP.md` for detailed troubleshooting guide.

---

## 📊 Summary of Work Done

### Backend (Node.js/Express)
- Firebase Admin SDK integration
- Authentication middleware
- Credit management service
- 4 new API routes (auth, payments)
- Updated calls route with auth & credits
- VAPI webhook handler
- Stripe webhook handler

### Frontend (Vue.js)
- Complete UI redesign
- Login/Signup pages
- Google sign-in button
- Credits display
- Buy Credits modal
- Credit warnings
- Protected routes

### Database (Firestore)
- 4 new collections
- Security rules
- Indexes

### Documentation
- SETUP.md (detailed setup guide)
- README.md (updated with architecture)
- .env.example (all variables)
- This deployment guide

### Configuration
- 9 new environment variables
- Firebase project setup
- Stripe webhook configuration
- Firestore security rules

---

## 🎉 What You Get

After deployment:
- ✅ Secure authentication system
- ✅ Credit-based pricing model
- ✅ Automated payment processing
- ✅ Whitelisted users with unlimited access
- ✅ Professional UI/UX
- ✅ Call history and analytics
- ✅ Transaction tracking
- ✅ Scalable architecture

---

## 📞 Support

If you need help:
- Review `SETUP.md` for detailed instructions
- Check `README.md` for API documentation
- Contact the developer for clarification

---

**Status:** ✅ Code Complete - Awaiting Configuration & Deployment

**Next Action:** Push branch to GitHub and create PR
