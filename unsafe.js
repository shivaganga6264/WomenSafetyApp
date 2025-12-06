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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Emergency contacts
const emergencyContacts = [
  "+919014974693",
  "+919381842856",
  "+919133042642"
];

// Correct backend endpoint
const BACKEND_URL = "https://women-backend.onrender.com/api/emergency";

let trackedPath = [];
let watchId = null;

// Start continuous tracking
function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const point = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date().toISOString()
      };

      trackedPath.push(point);
      console.log("Tracking point:", point);
    },
    (err) => {
      console.error("Tracking error:", err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  );
}

// Stop tracking
function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  startTracking();

  const unsafeBtn = document.getElementById("unsafeBtn");

  unsafeBtn.addEventListener("click", async () => {
    stopTracking();

    if (trackedPath.length === 0) {
      alert("No path tracked yet.");
      return;
    }

    // Save full path to Firestore
    try {
      await addDoc(collection(db, "unsafePaths"), {
        path: trackedPath,
        timestamp: new Date().toISOString()
      });
      console.log("Full path saved to Firestore");
    } catch (err) {
      console.error("Firestore save error:", err);
    }

    // Send emergency alert to backend
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: trackedPath,
          phoneNumbers: emergencyContacts
        })
      });

      const text = await response.text();
      alert(text);
    } catch (err) {
      console.error("Backend error:", err);
      alert("Failed to send emergency alert.");
    }

    // Clear and restart tracking
    trackedPath = [];
    startTracking();
  });
});

