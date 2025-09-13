import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Import getMessaging to enable Firebase Cloud Messaging
import { getMessaging, Messaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if an app hasn't been initialized yet.
// This prevents multiple initializations, which can cause errors.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

// Initialize messaging only if the code is running in a browser environment.
/** @type {import("firebase/messaging").Messaging | undefined} */
let messaging;

if (typeof window !== "undefined") {
    // Only initialize Messaging if a messaging sender ID is provided
    if (firebaseConfig.messagingSenderId) {
        messaging = getMessaging(app);
    }
}

export { auth, db, messaging };
