// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDp1vuDywbcGWRcv0Dd-ICnUlcMQ3PISVU",
  authDomain: "wildcardbeatbattle.firebaseapp.com",
  projectId: "wildcardbeatbattle",
  storageBucket: "wildcardbeatbattle.firebasestorage.app",
  messagingSenderId: "193162156042",
  appId: "1:193162156042:web:34eadc179010e39a2de7f3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);