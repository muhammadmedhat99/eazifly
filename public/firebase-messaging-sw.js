// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDy_I5L8hDcQ1Ag7EJP6SgYq994ZCpG4Ik",
  authDomain: "eazifly-instructor.firebaseapp.com",
  projectId: "eazifly-instructor",
  storageBucket: "eazifly-instructor.appspot.com",
  messagingSenderId: "960255976764",
  appId: "1:960255976764:web:a4eef7e830445ce0152a39",
  measurementId: "G-4K1YG5NRB6",
});

// background notifications
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("📩 Background Message received: ", payload);

  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.message || 'You have a new message',
    icon: "/img/logo/logo.svg",
    badge: "/img/logo/logo.svg",
    tag: 'chat-message',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Open Chat'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function (event) {
  console.log('🔔 Notification clicked:', event);

  event.notification.close();

  if (event.action === 'open') {
    // Open the chat page
    event.waitUntil(
      clients.openWindow('/dashboard/messages')
    );
  }
});