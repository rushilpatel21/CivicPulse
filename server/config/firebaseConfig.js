require('dotenv').config();
require('firebase/storage');
const { database } = require('firebase-admin');
const firebase = require('firebase/app');
const { getStorage, ref } = require('firebase/storage');

const firebaseConfig = {
    apiKey: process.env.GOOGLE_API_KEY,
    authDomain: process.env.GOOGLE_AUTH_DOMAIN,
    projectId: process.env.GOOGLE_PROJECT_ID,
    storageBucket: process.env.GOOGLE_STORAGE_BUCKET,
    messagingSenderId: process.env.GOOGLE_MESSAGING_SENDER_ID,
    appId: process.env.GOOGLE_APP_ID,
    measurementId: process.env.GOOGLE_MEASUREMENT_ID,
    databaseUrl: process.env.GOOGLE_DATABASE_URL
};
