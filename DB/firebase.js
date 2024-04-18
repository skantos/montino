import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAMZj3CHnmA-wb1DUfnw-Za4q2Gnj9r3xA",
  authDomain: "montino-13ecc.firebaseapp.com",
  projectId: "montino-13ecc",
  storageBucket: "montino-13ecc.appspot.com",
  messagingSenderId: "303627333746",
  appId: "1:303627333746:web:407a1438eb2d41daa492eb",
  measurementId: "G-423Q83LB9C"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
