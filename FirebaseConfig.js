// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxKUOn9BI4mvniYVtkGJFiXWjHFUJtXdQ",
  authDomain: "chat-app-2024-dc46e.firebaseapp.com",
  projectId: "chat-app-2024-dc46e",
  storageBucket: "chat-app-2024-dc46e.appspot.com",
  messagingSenderId: "190379856488",
  appId: "1:190379856488:web:bc34f186f5cea18da921dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Firebase authentication and Firestore database instances
const auth = getAuth(app); // add
const database = getFirestore(app); // add

// Export the Firebase authentication and Firestore database instances
export { auth, database }; //add