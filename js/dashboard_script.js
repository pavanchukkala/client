import { mediaStorage } from './media-firebase-config.js';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

// Upload Media File
uploadMediaBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file.");
    return;
  }

  const fileRef = ref(mediaStorage, `media/${file.name}`);
  const uploadTask = uploadBytesResumable(fileRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload is ${progress}% done`);
    },
    (error) => {
      console.error("Upload failed:", error.message);
      alert(`Upload failed: ${error.message}`);
    },
    async () => {
      const downloadURL = await getDownloadURL(fileRef);
      console.log("File available at:", downloadURL);
      alert("File uploaded successfully!");
      fetchMediaFiles(); // Refresh media list
    }
  );
});

// Fetch Media Files
async function fetchMediaFiles() {
  mediaList.innerHTML = '';
  const listRef = ref(mediaStorage, 'media/');
  const res = await listAll(listRef);

  if (res.items.length === 0) {
    mediaList.innerHTML = '<p>No media files found.</p>';
    return;
  }

  res.items.forEach(async (itemRef) => {
    const url = await getDownloadURL(itemRef);
    const mediaItem = document.createElement('div');
    mediaItem.className = 'media-item';
    mediaItem.innerHTML = `
      <p>${itemRef.name}</p>
      <button data-path="${itemRef.fullPath}">Delete</button>
    `;
    mediaList.appendChild(mediaItem);
  });

  // Attach delete functionality
  document.querySelectorAll('#mediaList button').forEach((button) => {
    button.addEventListener('click', async () => {
      const path = button.dataset.path;
      const fileRef = ref(mediaStorage, path);
      try {
        await deleteObject(fileRef);
        alert('File deleted successfully!');
        fetchMediaFiles(); // Refresh media list
      } catch (error) {
        console.error('Failed to delete file:', error.message);
      }
    });
  });
}

// Initial Fetch
fetchMediaFiles();
