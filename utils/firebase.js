// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_FTuxEeWdy4H00eSroOpA2pPegTdN42g",
  authDomain: "gemini-toolkit.firebaseapp.com",
  projectId: "gemini-toolkit",
  storageBucket: "gemini-toolkit.appspot.com",
  messagingSenderId: "190798096608",
  appId: "1:190798096608:web:39fd0bc690f79285470885",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const provider = new GoogleAuthProvider();

