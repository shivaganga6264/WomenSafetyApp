  // Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVsTNfI-nlaKqx7BxEVSoU9E7qtdJc5Mw",
  authDomain: "women-safety-b01ae.firebaseapp.com",
  projectId: "women-safety-b01ae",
  storageBucket: "women-safety-b01ae.firebasestorage.app",
  messagingSenderId: "185083347571",
  appId: "1:185083347571:web:6776fc6f294b3912a5e006"
};

// Initialize app only once
const app = initializeApp(firebaseConfig);

// Create auth + Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export to use in other files
export { auth, db };


