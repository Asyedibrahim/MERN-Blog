// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-2eef0.firebaseapp.com",
  projectId: "mern-blog-2eef0",
  storageBucket: "mern-blog-2eef0.appspot.com",
  messagingSenderId: "1068569828839",
  appId: "1:1068569828839:web:46b03ff64e395845bcb142"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

