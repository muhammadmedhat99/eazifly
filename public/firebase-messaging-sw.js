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
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  });
});