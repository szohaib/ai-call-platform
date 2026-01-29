# AI Call Platform

AI-powered voice calling platform using VAPI and Twilio.

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/github/szohaib/ai-call-platform)

Or manually:

1. Click: https://railway.app/new/github/szohaib/ai-call-platform
2. Select the "thf" workspace
3. Add environment variables:
   - `VAPI_API_KEY`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
4. Deploy

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
VAPI_API_KEY=your_vapi_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+15077087995
PORT=3000
```

## Local Development

```bash
npm install
npm start
```

Server runs on http://localhost:3000

## API Endpoints

- `GET /health` - Health check
- `POST /api/calls/make` - Make a call
- `GET /api/templates` - List templates
- `GET /api/calls/history` - Call history

## Features

- 6 pre-built call templates
- VAPI + Twilio integration
- Call history tracking
- Beautiful Vue.js frontend
- Mobile-responsive

Built for wake-up calls, reminders, surveys, and more.
