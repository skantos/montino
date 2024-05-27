import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2XMj6UMd235TDJhkigPNsyrV6yqDvCr0",
  authDomain: "montino-c96c2.firebaseapp.com",
  projectId: "montino-c96c2",
  storageBucket: "montino-c96c2.appspot.com",
  messagingSenderId: "214923027406",
  appId: "1:214923027406:web:c0607a5528b1c6f51d819f"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
