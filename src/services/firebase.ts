// src/services/firebase.ts - Simple Firebase v9 setup
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_8riwC_06pbYB4cu8dFJ2abqW-CbiEzc",
  authDomain: "cingaphambile.firebaseapp.com",
  projectId: "cingaphambile",
  storageBucket: "cingaphambile.firebasestorage.app",
  messagingSenderId: "280140140233",
  appId: "1:280140140233:web:6e9ca4d4fa81b40a69c718",
  measurementId: "G-HF7JRWD514"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Export auth functions
export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };