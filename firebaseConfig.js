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
  apiKey: "AIzaSyDFsfSHW9jKLHOsi9a1jB4nIM_herxleBs",
  authDomain: "hellodaktari-343e3.firebaseapp.com",
  projectId: "hellodaktari-343e3",
  storageBucket: "hellodaktari-343e3.appspot.com",
  messagingSenderId: "477685653482",
  appId: "1:477685653482:web:ada9132a80888751b5dc93",
  measurementId: "G-YWBF1HBTY5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

export { app, database, firestore };
