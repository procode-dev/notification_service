"use client";

import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

export default function Home() {
  const [token, setToken] = useState("");

  // ✅ 1. SERVICE WORKER + TOKEN
  useEffect(() => {
    const init = async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      const swRegistration =
        await navigator.serviceWorker.register("/firebase-messaging-sw.js");

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const currentToken = await getToken(messaging, {
        vapidKey:
          "BFCmrf0AVe5GU1hDeamWet9SY5sYMv87L4bb41O8A4XUbsBBm3QkUPUeDkYFNIOMvKfk5ysulmySFrsoP02u18s",
        serviceWorkerRegistration: swRegistration,
      });

      if (currentToken) {
        console.log("FCM Token:", currentToken);
        setToken(currentToken);
      }
    };

    init();
  }, []);

  // ✅ 2. FOREGROUND LISTENER (MOVE HERE)
  useEffect(() => {
    const setupListener = async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      onMessage(messaging, (payload) => {
        console.log("🔥 Foreground message:", payload);

        const title =
          payload.notification?.title ||
          payload.data?.title ||
          "Notification";

        const body =
          payload.notification?.body ||
          payload.data?.body ||
          "";

        console.log("Permission:", Notification.permission);

  // ✅ ALWAYS show alert first (debug)
  // alert(`📩 ${title}\n\n${body}`);
        new Notification(title, {
          body,
          icon: "/next.svg",
        });
      });
    };

    setupListener();
  }, []);

  // optional SW message listener
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "BACKGROUND_MESSAGE") {
        alert(`📩 ${event.data.title}\n\n${event.data.body}`);
      }
    };

    navigator.serviceWorker?.addEventListener("message", handler);

    return () =>
      navigator.serviceWorker?.removeEventListener("message", handler);
  }, []);

  const sendNotification = async () => {
    await fetch("http://localhost:3004/api/notify/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        title: "Hello 🚀",
        body: "Push notification working!",
      }),
    });
  };
// Add this function inside your Home component
const handleRequestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Permission granted! Now initializing FCM...");
      // Re-run your token logic here
      window.location.reload(); // Quick way to let useEffect catch the new permission
    } else {
      alert("Permission denied. Please enable notifications in iPhone Settings.");
    }
  } catch (error) {
    console.error("Error requesting permission", error);
  }
};
  return (
      <div className="flex flex-col items-center justify-center h-screen">
      {/* <Image src="/next.svg" alt="logo" width={120} height={40} /> */}

      <h1 className="text-xl font-bold mt-4">
        Firebase Push Notification 🔔
      </h1>
{typeof window !== "undefined" && Notification.permission !== "granted" && (
      <button
        onClick={handleRequestPermission}
        className="bg-blue-600 text-white px-6 py-2 mt-4 rounded"
      >
        Enable Notifications (For iPhone)
      </button>
    )}
      <button
        onClick={sendNotification}
        className="bg-purple-600 text-white px-6 py-2 mt-4 rounded"
      >
        Send Notification
      </button>

      <p className="text-xs mt-4 break-all text-gray-500">
        {token || "Fetching token..."}
      </p>
    </div>
  );
}