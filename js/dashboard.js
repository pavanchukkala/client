// js/dashboard.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc, addDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM elements
const contactList = document.getElementById("contactList");
const mediaList = document.getElementById("mediaList");
const fileInput = document.getElementById("fileInput");
const uploadMediaButton = document.getElementById("uploadMedia");
const logoutButton = document.getElementById("logout");

// Fetch and display contact data
async function loadContacts() {
  contactList.innerHTML = ""; // Clear existing content
  const querySnapshot = await getDocs(collection(db, "contacts"));
  querySnapshot.forEach((doc) => {
    const contact = doc.data();
    const contactBanner = document.createElement("div");
    contactBanner.className = "banner";

    const contactInfo = document.createElement("p");
    contactInfo.textContent = `${contact.name} - ${contact.email}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await deleteDoc(doc(db, "contacts", doc.id));
      loadContacts();
    });

    contactBanner.appendChild(contactInfo);
    contactBanner.appendChild(deleteButton);
    contactList.appendChild(contactBanner);
  });
}

// Fetch and display media items
async function loadMedia() {
  mediaList.innerHTML = ""; // Clear existing content
  const mediaRef = ref(storage, "media/");
  const mediaItems = await listAll(mediaRef);
  mediaItems.items.forEach((itemRef) => {
    const mediaItem = document.createElement("div");
    mediaItem.className = "media-item";

    const mediaName = document.createElement("p");
    mediaName.textContent = itemRef.name;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", async () => {
      await deleteObject(itemRef);
      loadMedia();
    });

    mediaItem.appendChild(mediaName);
    mediaItem.appendChild(deleteButton);
    mediaList.appendChild(mediaItem);
  });
}

// Upload media file
uploadMediaButton.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (file) {
    const storageRef = ref(storage, `media/${file.name}`);
    await uploadBytes(storageRef, file);
    loadMedia();
    fileInput.value = "";
  } else {
    alert("Please select a file to upload.");
  }
});

// Logout functionality
logoutButton.addEventListener("click", () => {
  // Add logout functionality here, e.g., clearing tokens or redirecting to login page
  alert("You have logged out.");
  window.location.href = "login.html";
});

// Initialize dashboard
loadContacts();
loadMedia();
