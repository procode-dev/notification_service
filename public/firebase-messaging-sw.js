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

// Background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("📩 SW received push:", payload);

  const title = payload.data?.title ?? "Notification";
  const body = payload.data?.body ?? "";

  self.registration.showNotification(title, {
    body,
    icon: "/next.svg",
    badge: "/next.svg",
    requireInteraction: true,
  });

  // Forward to tabs (for alerts)
  self.clients.matchAll({ includeUncontrolled: true, type: "window" })
    .then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: "BACKGROUND_MESSAGE", title, body });
      });
    });
});