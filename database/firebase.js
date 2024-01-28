import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyDkVflYZa7XfUBFmAJomRvYjVQdb2tW8Jo",
  authDomain: "saga-ed938.firebaseapp.com",
  projectId: "saga-ed938",
  storageBucket: "saga-ed938.appspot.com",
  messagingSenderId: "49283180293",
  appId: "1:49283180293:web:4a2ad3156f8714f590396c"
};

const appFirebase = initializeApp(firebaseConfig);

export const db = getFirestore(appFirebase);

export  { appFirebase, collection, getDocs, query, where}