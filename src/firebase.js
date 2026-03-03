import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfoNfLESbzHfvGygcJZTOrsW_YQtFU31g",
  authDomain: "mynotesapp-c6ea7.firebaseapp.com",
  projectId: "mynotesapp-c6ea7",
  storageBucket: "mynotesapp-c6ea7.firebasestorage.app",
  messagingSenderId: "564260609273",
  appId: "1:564260609273:web:2d488c5000953cc4f55628",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

export default app;
