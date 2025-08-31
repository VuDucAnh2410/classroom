import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5VIC9ihRYHsS7e3cK8cd-OuUIhlSnGy0",
  authDomain: "classroom-36b8a.firebaseapp.com",
  projectId: "classroom-36b8a",
  storageBucket: "classroom-36b8a.firebasestorage.app",
  messagingSenderId: "672667581028",
  appId: "1:672667581028:web:04c6039854dc6f77323d71",
  measurementId: "G-6W8C81WBD7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
