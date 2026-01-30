const express = require('express');
const router = express.Router();
const { getUserProfile, getCredits, getTransactionHistory } = require('../services/creditService');
const { authenticateUser } = require('../middleware/auth');

/**
 * Get current user profile and credits
 */
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const profile = await getUserProfile(req.user.uid, req.user.email, req.user.phoneNumber);
    
    res.json({
      success: true,
      user: {
        uid: profile.uid,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        credits: profile.credits,
        isWhitelisted: profile.isWhitelisted,
        totalCallsMade: profile.totalCallsMade,
        totalMinutesUsed: profile.totalMinutesUsed,
        createdAt: profile.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
});

/**
 * Get credit balance
 */
router.get('/credits', authenticateUser, async (req, res) => {
  try {
    const credits = await getCredits(req.user.uid);
    
    res.json({
      success: true,
      credits
    });
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch credits'
    });
  }
});

/**
 * Get credit transaction history
 */
router.get('/transactions', authenticateUser, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const transactions = await getTransactionHistory(req.user.uid, limit);
    
    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction history'
    });
  }
});

module.exports = router;
