 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCVsTNfI-nlaKqx7BxEVSoU9E7qtdJc5Mw",
  authDomain: "women-safety-b01ae.firebaseapp.com",
  projectId: "women-safety-b01ae",
  storageBucket: "women-safety-b01ae.appspot.com",
  messagingSenderId: "185083347571",
  appId: "1:185083347571:web:6776fc6f294b3912a5e006",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Emergency contacts
const emergencyContacts = [
  
  
   "+919014974693",
   "+918688393113"
  
];

document.addEventListener("DOMContentLoaded", () => {
  const unsafeBtn = document.getElementById("unsafeBtn");

  if (!unsafeBtn) {
    console.warn("❗ Button with id 'unsafeBtn' not found on this page.");
    return;
  }

  unsafeBtn.addEventListener("click", () => {
    console.log("🚨 Unsafe button clicked.");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        console.log("📍 latitude:", lat);
        console.log("📍 longitude:", long);

        // Save to Firestore
        try {
          const docRef = await addDoc(collection(db, "unsafeReports"), {
            latitude: lat,
            longitude: long,
            timestamp: new Date()
          });
          console.log("✅ Location saved to Firestore with ID:", docRef.id);
        } catch (error) {
          console.error("❌ Firestore save error:", error);
        }

        // Send to backend (Twilio SMS & call)
        try {
          const response = await fetch("https://women-backend.onrender.com/api/emergency", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              latitude: lat,
              longitude: long,
              phoneNumbers: emergencyContacts
            }),
          });

          const result = await response.text();
          console.log("✅ Backend response:", result); // log response from backend
          alert(result); // show response message
        } catch (err) {
          console.error("❌ Backend send error:", err.message);
          alert("Failed to send emergency alert.");
        }
      }, () => {
        alert("📍 Please allow location access.");
      });
    } else {
      alert("❌ Geolocation is not supported by this browser.");
    }
  });
});



