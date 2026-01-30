const express = require('express');
const router = express.Router();
const axios = require('axios');
const { templates } = require('../templates/callTemplates');
const { authenticateUser } = require('../middleware/auth');
const { checkCredits, deductCredits } = require('../services/creditService');
const { db } = require('../config/firebase');

/**
 * Make a call using VAPI (requires authentication and credits)
 */
router.post('/make', authenticateUser, async (req, res) => {
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
    const estimatedMinutes = Math.ceil(template.maxDuration / 60);

    // Check if user has enough credits
    const creditCheck = await checkCredits(req.user.uid, estimatedMinutes);
    
    if (!creditCheck.hasCredits && !creditCheck.isWhitelisted) {
      return res.status(402).json({
        success: false,
        error: 'Insufficient credits',
        required: creditCheck.required,
        current: creditCheck.currentCredits,
        needToPurchase: creditCheck.required - creditCheck.currentCredits
      });
    }

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
        recordingEnabled: true,
        // Add server URL for webhooks
        serverUrl: `${process.env.BACKEND_URL}/api/calls/webhook`
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

    // Store call record in Firestore
    const callRecord = {
      id: response.data.id,
      userId: req.user.uid,
      userEmail: req.user.email,
      phoneNumber,
      templateId,
      template: template.name,
      status: response.data.status,
      creditsDeducted: false,
      estimatedMinutes,
      createdAt: new Date().toISOString(),
      vapiData: response.data
    };

    await db.collection('calls').doc(response.data.id).set(callRecord);

    res.json({
      success: true,
      message: 'Call initiated successfully',
      call: {
        id: callRecord.id,
        phoneNumber: callRecord.phoneNumber,
        template: callRecord.template,
        status: callRecord.status,
        estimatedMinutes: callRecord.estimatedMinutes
      }
    });

  } catch (error) {
    console.error('Error making call:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to initiate call'
    });
  }
});

/**
 * VAPI webhook to receive call status updates
 */
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const event = req.body;
    
    console.log('📞 VAPI Webhook received:', event.type || event.message?.type);

    // Handle call.ended event to deduct credits
    if (event.message?.type === 'end-of-call-report' || event.type === 'call.ended') {
      const callId = event.call?.id || event.message?.call?.id;
      const duration = event.message?.duration || event.call?.duration;

      if (callId && duration) {
        // Get call record from Firestore
        const callDoc = await db.collection('calls').doc(callId).get();
        
        if (callDoc.exists) {
          const callData = callDoc.data();

          // Calculate minutes used (round up)
          const minutesUsed = Math.ceil(duration / 60);

          // Deduct credits if not already done
          if (!callData.creditsDeducted) {
            const deductionResult = await deductCredits(
              callData.userId,
              minutesUsed,
              callId
            );

            // Update call record
            await db.collection('calls').doc(callId).update({
              status: 'completed',
              actualDuration: duration,
              minutesUsed,
              creditsDeducted: true,
              deductionResult,
              completedAt: new Date().toISOString()
            });

            console.log(`✅ Credits deducted for call ${callId}: ${minutesUsed} minutes`);
          }
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get call history for authenticated user
 */
router.get('/history', authenticateUser, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    
    const calls = await db.collection('calls')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const history = calls.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.id,
        phoneNumber: data.phoneNumber,
        template: data.template,
        status: data.status,
        createdAt: data.createdAt,
        completedAt: data.completedAt,
        minutesUsed: data.minutesUsed,
        estimatedMinutes: data.estimatedMinutes
      };
    });

    res.json({ success: true, history });
  } catch (error) {
    console.error('Error fetching call history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch call history'
    });
  }
});

/**
 * Get call status from VAPI
 */
router.get('/status/:callId', authenticateUser, async (req, res) => {
  try {
    // Check if user owns this call
    const callDoc = await db.collection('calls').doc(req.params.callId).get();
    
    if (!callDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Call not found'
      });
    }

    const callData = callDoc.data();
    
    if (callData.userId !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    // Fetch latest status from VAPI
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
