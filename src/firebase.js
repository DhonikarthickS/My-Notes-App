// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfoNfLESbzHfvGygcJZTOrsW_YQtFU31g",
  authDomain: "mynotesapp-c6ea7.firebaseapp.com",
  projectId: "mynotesapp-c6ea7",
  storageBucket: "mynotesapp-c6ea7.firebasestorage.app",
  messagingSenderId: "564260609273",
  appId: "1:564260609273:web:2d488c5000953cc4f55628",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
 