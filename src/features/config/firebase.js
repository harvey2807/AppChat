import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCsVxKxQKDk-xL2wUnn5cVkk7ojKTK_lkU",
  authDomain: "appnlu.firebaseapp.com",
  projectId: "appnlu",
  storageBucket: "appnlu.firebasestorage.app",
  messagingSenderId: "493428989522",
  appId: "1:493428989522:web:b2917334f7814bfa72498b",
  measurementId: "G-4B4BYGT5YQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage, ref, uploadBytesResumable, getDownloadURL };