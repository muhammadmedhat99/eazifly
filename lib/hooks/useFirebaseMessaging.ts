import { useEffect } from "react";
import { getToken, onMessage, MessagePayload } from "firebase/messaging";
import { messaging } from "../../lib/FirebaseClient";
import { setCookie } from "cookies-next";

type OnReceiveMessage = (message: MessagePayload) => void;

const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  const permission = await Notification.requestPermission();
  console.log("🔔 Notification permission:", permission);
  return permission;
};

const generateAndStoreFcmToken = async (): Promise<string | null> => {
  try {
    // Check if service worker is registered
    if (!('serviceWorker' in navigator)) {
      console.warn("⚠️ Service Worker not supported");
      return null;
    }

    // Register service worker if not already registered
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log("🔧 Service Worker registered:", registration);

    // Get FCM token
     useEffect(() => {
        // Only run this code in the browser
        if (messaging) {
          // Your messaging logic here
          const token = getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        return token;
        }
      }, []);

    if (token) {
      console.log("🎯 FCM Token generated:", token);

      // Store token in cookies
      setCookie("fcm_token", token, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });

      // Send token to your backend
      await sendTokenToServer(token);

      return token;
    } else {
      console.warn("⚠️ No FCM token generated");
      return null;
    }
  } catch (error) {
    console.error("❌ Error generating FCM token:", error);
    return null;
  }
};

const sendTokenToServer = async (token: string) => {
  try {
    // Send token to your backend API
    const response = await fetch('/api/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      console.log("✅ FCM token sent to server successfully");
    } else {
      console.error("❌ Failed to send FCM token to server");
    }
  } catch (error) {
    console.error("❌ Error sending FCM token to server:", error);
  }
};

const retrieveFcmToken = async (): Promise<string | null> => {
  try {
    if ('cookieStore' in window) {
      const cookie = await (window as any).cookieStore.get("fcm_token");
      if (cookie?.value) {
        console.log("🍪 FCM Token from cookies:", cookie.value);
        return cookie.value;
      }
    }
    console.warn("⚠️ No FCM token found in cookies");
    return null;
  } catch (error) {
    console.error("❌ Error retrieving FCM token from cookies:", error);
    return null;
  }
};

export const useFirebaseMessaging = (onReceive: OnReceiveMessage): void => {
  useEffect(() => {
    const initializeFirebaseMessaging = async () => {
      try {
        const permission = await requestNotificationPermission();
        if (permission !== "granted") {
          console.warn("⚠️ Notification permission denied");
          return;
        }

        // Try to retrieve existing token first
        let token = await retrieveFcmToken();

        // If no token exists, generate a new one
        if (!token) {
          token = await generateAndStoreFcmToken();
        }

        if (!token) {
          console.error("❌ Failed to get FCM token");
          return;
        }

        console.log("✅ Firebase Messaging initialized successfully");
      } catch (error) {
        console.error("🔥 Firebase Messaging initialization failed:", error);
      }
    };

    initializeFirebaseMessaging();

    const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
      console.log("📨 Foreground message received:", payload);
      onReceive(payload);
    });

    return () => {
      unsubscribe();
    };
  }, [onReceive]);
};
