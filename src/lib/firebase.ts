// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGOcO_xj93Up2ghh4l_nrI2418jVseTMM",
  authDomain: "pregnancy-ab595.firebaseapp.com",
  projectId: "pregnancy-ab595",
  storageBucket: "pregnancy-ab595.firebasestorage.app",
  messagingSenderId: "39017813728",
  appId: "1:39017813728:web:bb6d74c0a6b5f3ea6b6285",
  measurementId: "G-KM4DPHJ6TV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (only if supported)
let analytics = null;
isSupported().then(yes => yes ? analytics = getAnalytics(app) : null);

// Initialize Firebase Auth
const auth = getAuth(app);

// Create Google Auth Provider with additional scopes if needed
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Initialize Firestore and enable offline persistence
const db = getFirestore(app);
enableIndexedDbPersistence(db).catch((err: any) => {
  if (err && (err.code === 'failed-precondition' || err.code === 'unimplemented')) {
    // Ignore persistence errors; app will still work online
    // failed-precondition: multiple tabs open
    // unimplemented: browser does not support persistence
    console.warn('Firestore persistence not enabled:', err.code);
  }
});

export { app, analytics, auth, googleProvider, db };
