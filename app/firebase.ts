import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCpSRLYo7-mzewCngme8MOahc64XmLbD58",
  authDomain: "fir-2b576.firebaseapp.com",
  projectId: "fir-2b576",
  storageBucket: "fir-2b576.firebasestorage.app",
  messagingSenderId: "318608703998",
  appId: "1:318608703998:web:4ffc4646aaeb4b0fcd40af",
  measurementId: "G-NMJY9WEYEJ"
};

const app = initializeApp(firebaseConfig);

// ✅ SAFE FUNCTION
export const getFirebaseMessaging = async () => {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) return null;

  return getMessaging(app);
};