import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDrdappnXYSuTpvDCESIHQnWPHhYdzjVnY",
  authDomain: "meetapp-df369.firebaseapp.com",
  projectId: "meetapp-df369",
  storageBucket: "meetapp-df369.appspot.com",
  messagingSenderId: "618157606859",
  appId: "1:618157606859:web:49e4c8e1caa08da5eb184e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);
