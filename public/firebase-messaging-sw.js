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

messaging.onBackgroundMessage(function (payload) {
  console.log("📩 Background message:", payload);

  const title = payload.data?.title ?? "Notification";
  const body = payload.data?.body ?? "";

  // ✅ Show browser notification (this is the only visible way in SW)
  self.registration.showNotification(title, {
    body,
    icon: "/next.svg",
    badge: "/next.svg",
    requireInteraction: true,
  });

  // 🔹 For testing: send message to all open clients (tabs) to trigger alert there
  self.clients.matchAll({ includeUncontrolled: true, type: "window" })
    .then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: "BACKGROUND_MESSAGE",
          title,
          body,
        });
      });
    });
});