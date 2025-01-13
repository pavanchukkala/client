import { auth, db, storage } from './firebase-config.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  deleteObject,
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js';

// DOM Elements
const logoutBtn = document.getElementById('logout');
const contactList = document.getElementById('contactList');
const mediaList = document.getElementById('mediaList');
const fileInput = document.getElementById('fileInput');
const uploadMediaBtn = document.getElementById('uploadMedia');
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('.section');

// Switch Sections
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    sections.forEach((section) => section.classList.remove('active'));
    document.getElementById(link.dataset.section).classList.add('active');
  });
});

// Logout
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'login.html';
});

// Fetch Contact Data
async function fetchContactData() {
  contactList.innerHTML = '';
  const querySnapshot = await getDocs(collection(db, 'contacts'));
  if (querySnapshot.empty) {
    contactList.innerHTML = '<p class="no-messages">No recent messages available.</p>';
    return;
  }

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const contactItem = document.createElement('div');
    contactItem.className = 'contact-item';
    contactItem.innerHTML = `
      <p><label>Name:</label> ${data.name}</p>
      <p><label>Email:</label> ${data.email}</p>
      <p><label>Message:</label> ${data.message}</p>
      <button class="reply">Reply</button>
      <button class="delete" data-id="${doc.id}">Delete</button>
    `;
    contactList.appendChild(contactItem);
  });

  // Delete Contact
  document.querySelectorAll('.contact-item .delete').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.dataset.id;
      await deleteDoc(doc(db, 'contacts', id));
      fetchContactData();
    });
  });
}

// Fetch Media Files
async function fetchMediaFiles() {
  mediaList.innerHTML = '';
  const listRef = ref(storage, 'media/');
  const res = await listAll(listRef);

  if (res.items.length === 0) {
    mediaList.innerHTML = '<p class="no-messages">No media files uploaded yet.</p>';
    return;
  }

  res.items.forEach(async (itemRef) => {
    const url = await getDownloadURL(itemRef);
    const mediaItem = document.createElement('div');
    mediaItem.className = 'media-item';
    mediaItem.innerHTML = `
      <p>File Name: ${itemRef.name}</p>
      <button class="delete" data-path="${itemRef.fullPath}">Delete</button>
    `;
    mediaList.appendChild(mediaItem);
  });

  // Delete Media
  document.querySelectorAll('.media-item .delete').forEach((button) => {
    button.addEventListener('click', async () => {
      const path = button.dataset.path;
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
      fetchMediaFiles();
    });
  });
}

// Upload Media File
uploadMediaBtn.addEventListener('click', () => {
  const files = fileInput.files;
  if (!files.length) return alert('Please select files.');

  Array.from(files).forEach((file) => {
    const fileRef = ref(storage, `media/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      null,
      (error) => alert(`Error: ${error.message}`),
      async () => {
        alert(`File "${file.name}" uploaded successfully!`);
        fetchMediaFiles();
      }
    );
  });
});

// Initial Fetch
fetchContactData();
fetchMediaFiles();
