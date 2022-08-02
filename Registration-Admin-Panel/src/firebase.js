import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "registration-app-d694e.firebaseapp.com",
  projectId: "registration-app-d694e",
  storageBucket: "registration-app-d694e.appspot.com",
  messagingSenderId: "276428769111",
  appId: "1:276428769111:web:4ea20c6dc7e9655648a012",
  measurementId: "G-BTV7EYWWHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);