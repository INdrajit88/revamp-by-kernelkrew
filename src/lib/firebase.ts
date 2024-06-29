import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { FIREBASE_CONFIG } from "./config";
console.log(FIREBASE_CONFIG, "FIREBASE_CONFIG");

const firebaseConfig = {
  apiKey: "AIzaSyByhWVyUYCSZjRRRN7CDVia6JMqBQT-X10",
  authDomain: "rofabs-4a4de.firebaseapp.com",
  databaseURL:
    "https://rofabs-4a4de-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rofabs-4a4de",
  storageBucket: "rofabs-4a4de.appspot.com",
  messagingSenderId: "530927239629",
  appId: "1:530927239629:web:a6b0af3747754f25ee8484",
  measurementId: "G-1Z2TDWEN42",
};

// Initialize Firebase
const firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const storage = getStorage(firebase_app);

console.log(firebase_app);

export default firebase_app;
