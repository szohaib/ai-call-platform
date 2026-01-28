# AI Call Platform - Demo Guide

## What I Built

A complete web platform for making AI voice calls. Think "one-click voice calls for everyone."

## How to Test

### 1. Backend is Already Running
```
http://localhost:3000
```

Test the API:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/templates
```

### 2. Open the Frontend

The frontend is running on:
```
http://localhost:8080
```

Just open that URL in your browser.

### 3. Make a Test Call

1. Click on any template (try "Wake-Up Call")
2. Enter a phone number (use yours: +919700069793)
3. Click "Make Call Now"
4. Your phone should ring in a few seconds!

The AI will:
- Introduce itself
- Follow the template script
- Have a natural conversation
- End the call when appropriate

## What Makes This Special

**For Non-Technical Users:**
- No signup, no login
- No confusing options
- Just: template → phone number → call

**Templates Include:**
- ⏰ **Wake-Up Call**: Asks verification questions (math, memory, day check)
- 📅 **Appointment Reminder**: Professional reminder calls
- 📊 **Quick Survey**: Automated customer feedback
- 🎂 **Birthday Greeting**: Warm birthday wishes
- 💙 **Wellness Check-In**: Caring check-up calls
- ✨ **Custom Call**: Create your own scenario

## Code Structure

```
ai-call-platform/
├── backend/
│   ├── server.js              # Express server
│   ├── routes/
│   │   ├── calls.js          # Call management endpoints
│   │   └── templates.js       # Template endpoints
│   ├── templates/
│   │   └── callTemplates.js   # 6 pre-built templates
│   └── .env                   # VAPI credentials
├── frontend/
│   └── index.html             # Single-file Vue.js app
└── README.md                  # Full documentation
```

## Deploy to Production

### Backend (Railway/Render):
```bash
# Already git committed
# Just push to GitHub and connect to Railway
```

### Frontend (Netlify):
```bash
cd frontend
# Update apiBaseUrl in index.html to production backend URL
# Then: drag & drop to Netlify or use CLI
netlify deploy --prod
```

## Potential Business Uses

1. **Wake-up service**: Sell wake-up call subscriptions
2. **Appointment reminders**: SaaS for medical/dental offices
3. **Customer feedback**: Automated post-purchase surveys
4. **Personal assistant**: Voice reminder service
5. **White-label**: License the platform to businesses

## Next Features (if you want them)

- Firebase integration for user accounts
- Scheduled/recurring calls
- Call transcripts + analytics
- Payment integration (Stripe)
- Custom voice cloning
- SMS fallback
- Mobile app version

---

**Status**: ✅ Fully functional, tested, and ready to deploy.

**Time to build**: ~2 hours

**Cost per call**: ~$0.02-0.05 depending on length and location
