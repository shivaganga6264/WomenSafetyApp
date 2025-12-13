// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0
const firebaseConfig = {
  apiKey: "AIzaSyCVsTNfI-nlaKqx7BxEVSoU9E7qtdJc5Mw",
  authDomain: "women-safety-b01ae.firebaseapp.com",
  projectId: "women-safety-b01ae",
  storageBucket: "women-safety-b01ae.firebasestorage.app",
  messagingSenderId: "185083347571",
  appId: "1:185083347571:web:6776fc6f294b3912a5e006",
  
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export auth so it can be used in other files
export { auth };





