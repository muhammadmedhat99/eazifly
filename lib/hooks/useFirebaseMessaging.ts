import { useEffect } from "react";
import { getToken, onMessage, MessagePayload } from "firebase/messaging";
import { messaging } from "../../firebase";

type OnReceiveMessage = (message: MessagePayload) => void;

const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  const permission = await Notification.requestPermission();
  console.log("🔔 Notification permission:", permission);
  return permission;
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
        if (permission !== "granted") return;

        await retrieveFcmToken();
      } catch (error) {
        console.error("🔥 Firebase Messaging initialization failed:", error);
      }
    };

    initializeFirebaseMessaging();

    const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
      onReceive(payload);
    });

    return () => {
      unsubscribe();
    };
  }, [onReceive]);
};
