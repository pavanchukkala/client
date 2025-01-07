import { auth, db, storage } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

const dataList = document.getElementById("dataList");
const fileInput = document.getElementById("fileInput");
const logoutButton = document.getElementById("logout");

// Ensure user is logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    // Fetch data from Firestore
    const querySnapshot = await getDocs(collection(db, "contactData"));
    querySnapshot.forEach((doc) => {
      const li = document.createElement("li");
      li.textContent = JSON.stringify(doc.data());
      dataList.appendChild(li);
    });
  }
});

// File upload handler
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    alert(`File uploaded successfully! File URL: ${url}`);
  }
});

// Logout handler
logoutButton.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
