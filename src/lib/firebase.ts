import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "local-handyman-connect",
  "appId": "1:954802371469:web:bbbaa798ac426e589fdbc4",
  "storageBucket": "local-handyman-connect.firebasestorage.app",
  "apiKey": "AIzaSyBNcfCMnZf7YVJIreZXNaMpAW26D2pHoP8",
  "authDomain": "local-handyman-connect.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "954802371469"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
