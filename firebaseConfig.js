// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBleZ-Otwg3Tv5FUAu3K5eyNPrVKQaQZWA",
  authDomain: "hellodaktari-9a5a5.firebaseapp.com",
  projectId: "hellodaktari-9a5a5",
  storageBucket: "hellodaktari-9a5a5.firebasestorage.app",
  messagingSenderId: "713744468109",
  appId: "1:713744468109:web:abe362bb2f936907befac4",
  measurementId: "G-8KZ09737RD"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { app, database, firestore };
