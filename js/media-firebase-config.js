import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

// New Media Project Configuration
const firebaseMediaConfig = {
  apiKey: "AIzaSyCCLNcUJWGEUlT4i-yumWObOo04shFYLOU",
  authDomain: "om-media.firebaseapp.com",
  projectId: "om-media",
  storageBucket: "om-media.appspot.com",
  messagingSenderId: "327452966209",
  appId: "1:327452966209:web:027290cf7871211f55b5c0",
  measurementId: "G-Y0FJV2Q93R"
};

// Initialize Media Firebase App
const mediaApp = initializeApp(firebaseMediaConfig, "mediaApp");
export const mediaStorage = getStorage(mediaApp);
