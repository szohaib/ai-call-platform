const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { CREDIT_PACKAGES, addCredits } = require('../services/creditService');
const { authenticateUser } = require('../middleware/auth');
const { db } = require('../config/firebase');

/**
 * Get available credit packages
 */
router.get('/packages', (req, res) => {
  res.json({
    success: true,
    packages: Object.values(CREDIT_PACKAGES)
  });
});

/**
 * Create a payment intent for credit purchase
 */
router.post('/create-intent', authenticateUser, async (req, res) => {
  try {
    const { packageId } = req.body;

    if (!packageId || !CREDIT_PACKAGES[packageId]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid package ID'
      });
    }

    const package = CREDIT_PACKAGES[packageId];

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: package.amount,
      currency: 'usd',
      metadata: {
        userId: req.user.uid,
        packageId: packageId,
        minutes: package.minutes,
        email: req.user.email
      },
      description: `${package.name} - ${package.minutes} minutes`
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      packageId,
      amount: package.amount,
      minutes: package.minutes
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent'
    });
  }
});

/**
 * Stripe webhook to handle successful payments
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      try {
        const { userId, packageId, minutes } = paymentIntent.metadata;

        // Add credits to user account
        const result = await addCredits(
          userId,
          parseInt(minutes),
          paymentIntent.id,
          packageId
        );

        console.log(`✅ Credits added for user ${userId}:`, result);

        // Store payment record
        await db.collection('payments').add({
          userId,
          paymentIntentId: paymentIntent.id,
          packageId,
          amount: paymentIntent.amount,
          minutes: parseInt(minutes),
          status: 'succeeded',
          createdAt: new Date().toISOString()
        });

      } catch (error) {
        console.error('Error processing payment success:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object;
      console.error('Payment failed:', failedIntent.id);
      
      await db.collection('payments').add({
        userId: failedIntent.metadata.userId,
        paymentIntentId: failedIntent.id,
        packageId: failedIntent.metadata.packageId,
        amount: failedIntent.amount,
        status: 'failed',
        error: failedIntent.last_payment_error?.message,
        createdAt: new Date().toISOString()
      });
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * Get payment history for user
 */
router.get('/history', authenticateUser, async (req, res) => {
  try {
    const payments = await db.collection('payments')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    const paymentHistory = payments.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      payments: paymentHistory
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment history'
    });
  }
});

module.exports = router;
