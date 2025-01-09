import { db, storage } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

// Elements
const contactList = document.getElementById("contactList");
const mediaList = document.getElementById("mediaList");
const fileInput = document.getElementById("fileInput");
const uploadMediaButton = document.getElementById("uploadMedia");

// Fetch and display contact data
async function fetchContacts() {
  const contactsCollection = collection(db, "contacts");
  const querySnapshot = await getDocs(contactsCollection);

  contactList.innerHTML = ""; // Clear existing data

  querySnapshot.forEach((docSnapshot) => {
    const contact = docSnapshot.data();
    const banner = document.createElement("div");
    banner.classList.add("banner");

    banner.innerHTML = `
      <p>${contact.name} - ${contact.email}</p>
      <button data-id="${docSnapshot.id}">Delete</button>
    `;

    const deleteButton = banner.querySelector("button");
    deleteButton.addEventListener("click", async () => {
      await deleteContact(docSnapshot.id);
    });

    contactList.appendChild(banner);
  });
}

// Delete contact
async function deleteContact(contactId) {
  try {
    await deleteDoc(doc(db, "contacts", contactId));
    alert("Contact deleted successfully.");
    fetchContacts();
  } catch (error) {
    console.error("Error deleting contact:", error);
    alert("Failed to delete contact.");
  }
}

// Upload media file
uploadMediaButton.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  const storageRef = ref(storage, `media/${file.name}`);

  try {
    await uploadBytes(storageRef, file);
    alert("Media uploaded successfully.");
    fetchMedia(); // Refresh media list
  } catch (error) {
    console.error("Error uploading media:", error);
    alert("Failed to upload media.");
  }
});

// Fetch and display media files
async function fetchMedia() {
  const mediaRef = ref(storage, "media");
  const mediaSnapshot = await listAll(mediaRef);

  mediaList.innerHTML = ""; // Clear existing media items

  mediaSnapshot.items.forEach(async (itemRef) => {
    const mediaUrl = await getDownloadURL(itemRef);

    const mediaItem = document.createElement("div");
    mediaItem.classList.add("media-item");

    mediaItem.innerHTML = `
      <p>${itemRef.name}</p>
      <button data-url="${mediaUrl}" data-name="${itemRef.name}">Delete</button>
    `;

    const deleteButton = mediaItem.querySelector("button");
    deleteButton.addEventListener("click", async () => {
      await deleteMedia(itemRef.name);
    });

    mediaList.appendChild(mediaItem);
  });
}

// Delete media file
async function deleteMedia(fileName) {
  const fileRef = ref(storage, `media/${fileName}`);

  try {
    await deleteObject(fileRef);
    alert("Media deleted successfully.");
    fetchMedia();
  } catch (error) {
    console.error("Error deleting media:", error);
    alert("Failed to delete media.");
  }
}

// Initial load
fetchContacts();
fetchMedia();
