const express = require('express');
const router = express.Router();
const axios = require('axios');
const { templates } = require('../templates/callTemplates');

// In-memory store for call history (will move to Firebase later)
const callHistory = [];

// Make a call using VAPI
router.post('/make', async (req, res) => {
  try {
    const { phoneNumber, templateId, customizations = {} } = req.body;

    // Validation
    if (!phoneNumber) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    if (!templateId || !templates[templateId]) {
      return res.status(400).json({ success: false, error: 'Valid template ID is required' });
    }

    // Get template
    const template = templates[templateId];

    // Build VAPI payload
    const vapiPayload = {
      phoneNumber: {
        twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
        twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
        twilioAuthToken: process.env.TWILIO_AUTH_TOKEN
      },
      customer: {
        number: phoneNumber
      },
      assistant: {
        model: {
          provider: 'openai',
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: customizations.systemMessage || template.systemMessage
            }
          ]
        },
        voice: customizations.voice || template.voice,
        transcriber: {
          provider: 'deepgram'
        },
        firstMessage: customizations.firstMessage || template.firstMessage,
        maxDurationSeconds: customizations.maxDuration || template.maxDuration,
        endCallFunctionEnabled: true,
        recordingEnabled: true
      }
    };

    // Make VAPI API call
    const response = await axios.post(
      'https://api.vapi.ai/call/phone',
      vapiPayload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Store in call history
    const callRecord = {
      id: response.data.id,
      phoneNumber,
      templateId,
      template: template.name,
      status: response.data.status,
      createdAt: new Date().toISOString(),
      vapiData: response.data
    };
    callHistory.unshift(callRecord);

    res.json({
      success: true,
      message: 'Call initiated successfully',
      call: callRecord
    });

  } catch (error) {
    console.error('Error making call:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to initiate call'
    });
  }
});

// Get call history
router.get('/history', (req, res) => {
  res.json({ success: true, history: callHistory });
});

// Get call status from VAPI
router.get('/status/:callId', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.vapi.ai/call/${req.params.callId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.VAPI_API_KEY}`
        }
      }
    );

    res.json({ success: true, call: response.data });
  } catch (error) {
    console.error('Error fetching call status:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to fetch call status'
    });
  }
});

module.exports = router;
