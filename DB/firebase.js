import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyC2XMj6UMd235TDJhkigPNsyrV6yqDvCr0",
  authDomain: "montino-c96c2.firebaseapp.com",
  projectId: "montino-c96c2",
  storageBucket: "montino-c96c2.appspot.com",
  messagingSenderId: "214923027406",
  appId: "1:214923027406:web:c0607a5528b1c6f51d819f"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
