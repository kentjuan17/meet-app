// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBWldusV8biOrGf4zIG0GnIkiexX8jshOc",
  authDomain: "meet-app-a7df5.firebaseapp.com",
  projectId: "meet-app-a7df5",
  storageBucket: "meet-app-a7df5.appspot.com",
  messagingSenderId: "877417010213",
  appId: "1:877417010213:web:2c38a24bcf0e7741909bcc",
  measurementId: "G-4DQG860KFK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
const analytics = getAnalytics(app);