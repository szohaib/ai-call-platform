# AI Call Platform

Simple, beautiful platform to make AI-powered voice calls using VAPI. Built for non-technical users.

## Features

- 🎯 **6 Pre-built Templates**: Wake-up calls, reminders, surveys, birthday wishes, check-ins, and custom calls
- 📞 **One-Click Calling**: Enter a phone number and click - that's it
- 🎨 **Beautiful UI**: Clean, modern interface anyone can use
- 📊 **Call History**: Track all your calls in one place
- 🔧 **Customizable**: Edit templates or create your own

## Tech Stack

- **Frontend**: Vue.js 3 (via CDN, no build step needed)
- **Backend**: Node.js + Express
- **Voice AI**: VAPI + Twilio

## Quick Start

### 1. Install Dependencies

```bash
cd ai-call-platform
npm install
```

### 2. Configure Environment

The `.env` file is already set up with Zohaib's VAPI credentials. If you need to change them:

```bash
# Edit backend/.env
VAPI_API_KEY=your_key
TWILIO_PHONE_NUMBER=your_number
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
```

### 3. Start the Backend

```bash
npm run dev
```

Server runs on `http://localhost:3000`

### 4. Open the Frontend

Simply open `frontend/index.html` in your browser, or use a simple HTTP server:

```bash
# Option 1: Python
cd frontend && python3 -m http.server 8080

# Option 2: npx
cd frontend && npx serve
```

Then visit `http://localhost:8080`

## Usage

1. **Choose a Template**: Click on any call template (Wake-Up, Reminder, etc.)
2. **Enter Phone Number**: Type the recipient's number with country code (e.g., +1 234 567 8900)
3. **Click "Make Call"**: The AI will call them in seconds!

## Templates

### ⏰ Wake-Up Call
Morning alarm with verification questions to ensure they're awake.

### 📅 Appointment Reminder
Remind someone about an upcoming appointment.

### 📊 Quick Survey
Conduct a short customer feedback survey.

### 🎂 Birthday Greeting
Personalized birthday wishes call.

### 💙 Wellness Check-In
Check in on someone's wellbeing.

### ✨ Custom Call
Create your own call scenario with custom instructions.

## API Endpoints

### Get Templates
```
GET /api/templates
```

### Make a Call
```
POST /api/calls/make
Body: {
  phoneNumber: "+1234567890",
  templateId: "wakeup",
  customizations: { ... } // optional
}
```

### Get Call History
```
GET /api/calls/history
```

### Get Call Status
```
GET /api/calls/status/:callId
```

## Deployment

### Backend (Heroku/Railway/Render)

1. Push to GitHub
2. Connect repo to your hosting platform
3. Set environment variables
4. Deploy!

### Frontend (Netlify)

1. Update `apiBaseUrl` in `frontend/index.html` to your backend URL
2. Drag & drop the `frontend` folder to Netlify
3. Done!

Or use Netlify CLI:

```bash
cd frontend
netlify deploy --prod
```

## Future Enhancements

- [ ] Add Firebase for persistent data storage
- [ ] User authentication
- [ ] Scheduled calls
- [ ] Call analytics and transcripts
- [ ] More voice options
- [ ] SMS fallback option
- [ ] Custom voice cloning
- [ ] Multi-language support

## Made by

Zohaib - Building simple, powerful tools.

---

**Note**: Keep your VAPI API keys secure. Never commit `.env` files to git.
