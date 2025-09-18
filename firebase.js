import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  measurementId: "G-4K1YG5NRB6",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "eazifly-instructor.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const messaging = getMessaging(app);
