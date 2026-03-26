"use client";

import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

export default function Home() {
  const [token, setToken] = useState("");
  const [permission, setPermission] = useState("default");

  // ✅ 1. Check permission safely on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // ✅ 2. Token Initialization
  useEffect(() => {
    const init = async () => {
      if (permission !== "granted") return;

      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      try {
        const swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        
        const currentToken = await getToken(messaging, {
          vapidKey: "BFCmrf0AVe5GU1hDeamWet9SY5sYMv87L4bb41O8A4XUbsBBm3QkUPUeDkYFNIOMvKfk5ysulmySFrsoP02u18s",
          serviceWorkerRegistration: swRegistration,
        });

        if (currentToken) {
          console.log("FCM Token:", currentToken);
          setToken(currentToken);
        }
      } catch (err) {
        console.error("Token init failed", err);
      }
    };

    init();
  }, [permission]); // Re-run when permission changes to 'granted'

  // ✅ 3. Foreground Listener
  useEffect(() => {
    let unsubscribe = () => {};

    const setupListener = async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {
        console.log("🔥 Foreground message:", payload);
        new Notification(payload.notification?.title||payload.data?.title || "Notification", {
          body: payload.notification?.body||payload.data?.body || "",
          icon: "/next.svg",
          tag: "fcm-group-1",
        });
      });
    };

    setupListener();
    return () => unsubscribe();
  }, []);

  const handleRequestPermission = async () => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result !== "granted") {
      alert("Permission denied. On iPhone, you must 'Add to Home Screen' first.");
    }
  };

  const sendNotification = async () => {
    // Your existing fetch call...
    await fetch("http://localhost:3004/api/notify/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, title: "Hello 🚀", body: "Push notification working!" }),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-bold mt-4">Push Notification 🔔</h1>

      {/* ✅ Safe Permission Button */}
      {permission !== "granted" && (
        <button
          onClick={handleRequestPermission}
          className="bg-blue-600 text-white px-6 py-2 mt-4 rounded"
        >
          Enable Notifications (For iPhone)
        </button>
      )}

      <button
        onClick={sendNotification}
        className="bg-purple-600 text-white px-6 py-2 mt-4 rounded disabled:opacity-50"
        disabled={!token}
      >
        Send Notification
      </button>

      <p className="text-xs mt-4 break-all text-gray-500 max-w-md text-center">
        {token || "Waiting for permission..."}
      </p>
    </div>
  );
}