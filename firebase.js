// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   measurementId: "G-4K1YG5NRB6",
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: "eazifly-instructor.appspot.com",
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
// };

// const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);
// export const messaging = getMessaging(app);

// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// The messaging and other client-side imports should not be in this file.
// This config should be universal (client and server).
const firebaseConfig = {
  measurementId: "G-4K1YG5NRB6",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "eazifly-instructor.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
};

// Initialize the universal Firebase app
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Use a separate file or a function to handle client-side-only services
// For example, create a new file like 'firebaseClient.js'
// firebaseClient.js

import { getMessaging } from "firebase/messaging";
import { app } from "./firebaseConfig"; // Import the initialized app

let messaging;

// Check if the code is running in a browser environment
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export { messaging };