  // Import Firebase SDK
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVsTNfI-nlaKqx7BxEVSoU9E7qtdJc5Mw",
  authDomain: "women-safety-b01ae.firebaseapp.com",
  projectId: "women-safety-b01ae",
  storageBucket: "women-safety-b01ae.appspot.com",
  messagingSenderId: "185083347571",
  appId: "1:185083347571:web:6776fc6f294b3912a5e006"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Export auth & db for use in other files
export { auth, db };




