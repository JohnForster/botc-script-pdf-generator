// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgm_VxPoTKUyrhBZbPDC4SIHX18Z5SoLY",
  authDomain: "botc-script-storage.firebaseapp.com",
  projectId: "botc-script-storage",
  storageBucket: "botc-script-storage.firebasestorage.app",
  messagingSenderId: "635684647225",
  appId: "1:635684647225:web:471e622729e981066ff8e8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
