import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail 
} from 'firebase/auth';

// Your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_8riwC_06pbYB4cu8dFJ2abqW-CbiEzc",
  authDomain: "cingaphambile.firebaseapp.com",
  projectId: "cingaphambile",
  storageBucket: "cingaphambile.firebasestorage.app",
  messagingSenderId: "280140140233",
  appId: "1:280140140233:web:6e9ca4d4fa81b40a69c718"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export everything
export { 
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail 
};