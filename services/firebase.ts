
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCfjameWEh5UqZx1KEV8LpUHqXCkSUNpiE",
    authDomain: "alphathon-60d5b.firebaseapp.com",
    projectId: "alphathon-60d5b",
    storageBucket: "alphathon-60d5b.firebasestorage.app",
    messagingSenderId: "48714327165",
    appId: "1:48714327165:web:1b2c27740be0de63913d14",
    measurementId: "G-7G90M9SPP7"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics runs only on client side
export const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export default app;
