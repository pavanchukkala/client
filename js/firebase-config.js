// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAofc3mQez-sDrvpZNsoOanaLjeEr3SSag",
  authDomain: "om-new-5d333.firebaseapp.com",
  projectId: "om-new-5d333",
  storageBucket: "om-new-5d333.appspot.com",
  messagingSenderId: "115867801200",
  appId: "1:115867801200:web:0a0128f496bdd8264586b5",
  measurementId: "G-WLQWC3702E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
