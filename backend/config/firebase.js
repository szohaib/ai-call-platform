const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Service account key should be in FIREBASE_SERVICE_ACCOUNT env variable (JSON string)
// Or provide path to service account key file
let firebaseApp;

try {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('../../firebase-service-account.json'); // Fallback for local dev

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });

  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
  console.log('Note: Firebase service account is required for authentication');
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth, firebaseApp };
