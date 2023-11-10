// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDG4U1M-o7ITT7nLPyQPyZcB426Gxi-mQU",
  authDomain: "budgetics.firebaseapp.com",
  databaseURL:
    "https://budgetics-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "budgetics",
  storageBucket: "budgetics.appspot.com",
  messagingSenderId: "598733546693",
  appId: "1:598733546693:web:9b85a293f797683fc7fcac",
  measurementId: "G-2LC7PZWJRG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
// const analytics = getAnalytics(app);
