importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCpSRLYo7-mzewCngme8MOahc64XmLbD58",
  authDomain: "fir-2b576.firebaseapp.com",
  projectId: "fir-2b576",
  messagingSenderId: "318608703998",
  appId: "1:318608703998:web:4ffc4646aaeb4b0fcd40af",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background:", payload);

  const title =
    payload.notification?.title ||
    payload.data?.title ||
    "Notification";

  const body =
    payload.notification?.body ||
    payload.data?.body ||
    "";

  self.registration.showNotification(title, {
    body,
    icon: "/next.svg",
  });
});