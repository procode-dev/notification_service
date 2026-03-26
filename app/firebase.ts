import { initializeApp, getApps } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "fir-2b576.firebaseapp.com",
  projectId: "fir-2b576",
  messagingSenderId: "318608703998",
  appId: "1:318608703998:web:4ffc4646aaeb4b0fcd40af",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

let messagingInstance: any = null;

export const getFirebaseMessaging = async () => {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) return null;

  if (!messagingInstance) {
    messagingInstance = getMessaging(app);
  }

  return messagingInstance;
};