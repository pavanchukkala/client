// js/auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import firebaseConfig from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM elements
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error");

// Handle login
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html"; // Redirect on success
    } catch (error) {
      errorMessage.textContent = "Invalid login credentials. Please try again.";
    }
  });
}

// Protect dashboard
if (window.location.pathname.includes("dashboard.html")) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("Unauthorized access. Redirecting to login page.");
      window.location.href = "login.html"; // Redirect unauthorized users
    }
  });
}

// Logout functionality
export function logoutUser() {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html"; // Redirect to login page
    })
    .catch((error) => {
      console.error("Logout failed", error);
    });
}
