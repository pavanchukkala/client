import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue, push, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Logout functionality
document.getElementById("logout").addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("Logged out successfully.");
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Error logging out:", error);
  });
});

// Fetch and display contact data
const contactList = document.getElementById("contactList");
const contactsRef = ref(db, "contacts"); // Ensure "contacts" node exists in Firebase

onValue(contactsRef, (snapshot) => {
  contactList.innerHTML = ""; // Clear the list before re-rendering
  snapshot.forEach((childSnapshot) => {
    const key = childSnapshot.key;
    const data = childSnapshot.val();

    // Create a banner for each contact
    const banner = document.createElement("div");
    banner.className = "banner";

    const contactInfo = document.createElement("p");
    contactInfo.textContent = `${data.name} - ${data.email}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this contact?")) {
        remove(ref(db, `contacts/${key}`))
          .then(() => alert("Contact deleted successfully."))
          .catch((error) => console.error("Error deleting contact:", error));
      }
    });

    banner.appendChild(contactInfo);
    banner.appendChild(deleteButton);
    contactList.appendChild(banner);
  });
});

// Upload media functionality
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadMedia");
const mediaList = document.getElementById("mediaList");

uploadButton.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  const fileRef = storageRef(storage, `media/${file.name}`);
  uploadBytes(fileRef, file)
    .then((snapshot) => {
      return getDownloadURL(snapshot.ref);
    })
    .then((url) => {
      // Add to the media list dynamically
      const mediaItem = document.createElement("div");
      mediaItem.className = "media-item";

      const mediaName = document.createElement("p");
      mediaName.textContent = file.name;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this file?")) {
          deleteObject(fileRef)
            .then(() => {
              mediaItem.remove();
              alert("File deleted successfully.");
            })
            .catch((error) => console.error("Error deleting file:", error));
        }
      });

      mediaItem.appendChild(mediaName);
      mediaItem.appendChild(deleteButton);
      mediaList.appendChild(mediaItem);
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
    });
});
