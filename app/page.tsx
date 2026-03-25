"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "./firebase";

export default function Home() {
  const [token, setToken] = useState<string>("");
useEffect(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "BACKGROUND_MESSAGE") {
        alert(`${event.data.title}\n\n${event.data.body}`);
      }
    });
  }
}, []);
useEffect(() => {
  const initFCM = async () => {
    try {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      const permission = await Notification.requestPermission();
      console.log("Permission:", permission);

      if (permission !== "granted") {
        console.log("❌ Notification permission denied");
        return;
      }

      // ✅ Register service worker (important)
      await navigator.serviceWorker.register("/firebase-messaging-sw.js");

      const currentToken = await getToken(messaging, {
        vapidKey: "BFCmrf0AVe5GU1hDeamWet9SY5sYMv87L4bb41O8A4XUbsBBm3QkUPUeDkYFNIOMvKfk5ysulmySFrsoP02u18s",
      });

      if (currentToken) {
        console.log("✅ FCM Token:", currentToken);
        setToken(currentToken);
      } else {
        console.log("❌ No token received");
      }

      // ✅ Foreground message listener
      onMessage(messaging, (payload) => {
        const title = payload.data?.title ?? "Notification";
        const body = payload.data?.body ?? "";

        alert(`${title}\n\n${body}`);

        if (Notification.permission === "granted") {
          new Notification(title, {
            body,
            icon: "/next.svg",
            badge: "/next.svg",
            requireInteraction: true,
          });
        }
      });

    } catch (err) {
      console.error("🔥 Token error:", err);
    }
  };

  initFCM();
}, []);

  const sendNotification = async () => {
    try {
      const res = await fetch("http://localhost:3004/api/notify/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title: "Hello 🚀",
          body: "Push notification working!",
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert(`✅ Sent: ${JSON.stringify(data)}`);
    } catch (error: any) {
      console.error("❌ Error:", error.message);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-6 py-20 px-6 bg-white dark:bg-black">

        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <h1 className="text-2xl font-bold text-center">
          Firebase Push Notification 🔔
        </h1>

        <button
          onClick={sendNotification}
          className="bg-purple-600 text-white px-6 py-2 rounded"
        >
          Send Notification
        </button>

        <p className="text-xs break-all text-gray-500">
          Token: {token || "Fetching token..."}
        </p>

      </main>
    </div>
  );
}