// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9YwIluTfe-3nqog-8vsMursasx8cQtCM",
  authDomain: "projects-b9194.firebaseapp.com",
  projectId: "projects-b9194",
  storageBucket: "projects-b9194.appspot.com",
  messagingSenderId: "444369249715",
  appId: "1:444369249715:web:a56d89aa4d25ca64c897c6",
  measurementId: "G-BZE8FE868F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
