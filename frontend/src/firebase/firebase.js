// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA2vBScgsM0z2PGqlurc4fZ4Zmmv-mv8B8",
    authDomain: "ccfinalpro.firebaseapp.com",
    projectId: "ccfinalpro",
    storageBucket: "ccfinalpro.appspot.com",
    messagingSenderId: "173640515749",
    appId: "1:173640515749:web:9633b11fbcf11fb9f30d4c"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

const db = getFirestore();

const colRef = collection(db, 'users')


export { app, auth, colRef};