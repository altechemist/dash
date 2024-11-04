const { initializeApp, getApps } = require('firebase/app');
const dotenv = require('dotenv');
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');

// Load environment variables from .env file
dotenv.config();

const firebaseConfig = { 
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { db, auth };
