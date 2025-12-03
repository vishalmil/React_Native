// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLfhoQuliX6udedzehg6tw2CFYLv_y9Zc",
  authDomain: "book-discovery-app-84126.firebaseapp.com",
  projectId: "book-discovery-app-84126",
  storageBucket: "book-discovery-app-84126.firebasestorage.app",
  messagingSenderId: "282058063632",
  appId: "1:282058063632:web:0333bf88ec2a1c52fc2f95",
  measurementId: "G-E1R7E9XL97"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP)
//const analytics = getAnalytics(app);
