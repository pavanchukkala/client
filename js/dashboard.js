import { auth, db, storage } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-storage.js";

const dataList = document.getElementById("dataList");
const fileInput = document.getElementById("fileInput");
const logoutButton = document.getElementById("logout");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    // Fetch data
    const querySnapshot = await getDocs(collection(db, "contactData"));
    querySnapshot.forEach((doc) => {
      const li = document.createElement("li");
      li.textContent = JSON.stringify(doc.data());
      dataList.appendChild(li);
    });
  }
});

// Upload file
fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  const storageRef = ref(storage, `uploads/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  alert("File uploaded successfully: " + url);
});

// Logout
logoutButton.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
