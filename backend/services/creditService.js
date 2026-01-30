const { db } = require('../config/firebase');

// Whitelisted users with unlimited credits
const WHITELISTED_USERS = [
  'syedzohaibak@gmail.com',
  '+919700069793'
];

// Credit packages (amount in USD, minutes included)
const CREDIT_PACKAGES = {
  starter: {
    id: 'starter',
    name: 'Starter Pack',
    amount: 1000, // $10.00 in cents
    minutes: 50,
    pricePerMinute: 0.20
  },
  popular: {
    id: 'popular',
    name: 'Popular Pack',
    amount: 2500, // $25.00 in cents
    minutes: 150,
    pricePerMinute: 0.167,
    discount: '17% off'
  },
  premium: {
    id: 'premium',
    name: 'Premium Pack',
    amount: 5000, // $50.00 in cents
    minutes: 350,
    pricePerMinute: 0.143,
    discount: '29% off'
  }
};

// Average cost per minute for VAPI + Twilio
const COST_PER_MINUTE = 0.09; // $0.06-$0.12 average
const CHARGE_PER_MINUTE = 0.15; // Base charge rate (50% markup minimum)

/**
 * Check if user is whitelisted for unlimited credits
 */
function isWhitelisted(email, phoneNumber) {
  return WHITELISTED_USERS.includes(email) || 
         WHITELISTED_USERS.includes(phoneNumber);
}

/**
 * Get or create user profile in Firestore
 */
async function getUserProfile(uid, email, phoneNumber) {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    // Create new user profile
    const newUser = {
      uid,
      email,
      phoneNumber: phoneNumber || null,
      credits: 0, // Credits in minutes
      isWhitelisted: isWhitelisted(email, phoneNumber),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalCallsMade: 0,
      totalMinutesUsed: 0
    };

    // If whitelisted, give them a large number of credits
    if (newUser.isWhitelisted) {
      newUser.credits = 999999; // Essentially unlimited
    }

    await userRef.set(newUser);
    return newUser;
  }

  return userDoc.data();
}

/**
 * Get user's current credit balance
 */
async function getCredits(uid) {
  const userProfile = await db.collection('users').doc(uid).get();
  
  if (!userProfile.exists) {
    return 0;
  }

  const userData = userProfile.data();
  
  // Whitelisted users always have unlimited credits
  if (userData.isWhitelisted) {
    return 999999;
  }

  return userData.credits || 0;
}

/**
 * Check if user has enough credits for estimated call duration
 */
async function checkCredits(uid, estimatedMinutes = 5) {
  const userProfile = await db.collection('users').doc(uid).get();
  
  if (!userProfile.exists) {
    return { hasCredits: false, currentCredits: 0, required: estimatedMinutes };
  }

  const userData = userProfile.data();
  
  // Whitelisted users always have credits
  if (userData.isWhitelisted) {
    return { hasCredits: true, currentCredits: 999999, required: 0, isWhitelisted: true };
  }

  const currentCredits = userData.credits || 0;
  
  return {
    hasCredits: currentCredits >= estimatedMinutes,
    currentCredits,
    required: estimatedMinutes
  };
}

/**
 * Deduct credits after a call completes
 */
async function deductCredits(uid, minutes, callId) {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User not found');
  }

  const userData = userDoc.data();

  // Don't deduct from whitelisted users
  if (userData.isWhitelisted) {
    console.log(`Skipping credit deduction for whitelisted user: ${userData.email}`);
    return {
      success: true,
      credited: false,
      reason: 'Whitelisted user'
    };
  }

  const currentCredits = userData.credits || 0;
  const newCredits = Math.max(0, currentCredits - minutes);

  // Update user credits and stats
  await userRef.update({
    credits: newCredits,
    totalCallsMade: (userData.totalCallsMade || 0) + 1,
    totalMinutesUsed: (userData.totalMinutesUsed || 0) + minutes,
    updatedAt: new Date().toISOString()
  });

  // Log transaction
  await db.collection('creditTransactions').add({
    userId: uid,
    type: 'deduction',
    amount: minutes,
    callId,
    balanceBefore: currentCredits,
    balanceAfter: newCredits,
    createdAt: new Date().toISOString()
  });

  return {
    success: true,
    credited: true,
    minutesDeducted: minutes,
    previousBalance: currentCredits,
    newBalance: newCredits
  };
}

/**
 * Add credits to user account (after purchase)
 */
async function addCredits(uid, minutes, paymentId, packageId) {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User not found');
  }

  const userData = userDoc.data();
  const currentCredits = userData.credits || 0;
  const newCredits = currentCredits + minutes;

  await userRef.update({
    credits: newCredits,
    updatedAt: new Date().toISOString()
  });

  // Log transaction
  await db.collection('creditTransactions').add({
    userId: uid,
    type: 'purchase',
    amount: minutes,
    packageId,
    paymentId,
    balanceBefore: currentCredits,
    balanceAfter: newCredits,
    createdAt: new Date().toISOString()
  });

  return {
    success: true,
    minutesAdded: minutes,
    previousBalance: currentCredits,
    newBalance: newCredits
  };
}

/**
 * Get credit transaction history for a user
 */
async function getTransactionHistory(uid, limit = 20) {
  const transactions = await db.collection('creditTransactions')
    .where('userId', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  return transactions.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

module.exports = {
  CREDIT_PACKAGES,
  COST_PER_MINUTE,
  CHARGE_PER_MINUTE,
  isWhitelisted,
  getUserProfile,
  getCredits,
  checkCredits,
  deductCredits,
  addCredits,
  getTransactionHistory
};
