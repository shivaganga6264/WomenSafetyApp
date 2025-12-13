 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCVsTNfI-nlaKqx7BxEVSoU9E7qtdJc5Mw",
  authDomain: "women-safety-b01ae.firebaseapp.com",
  projectId: "women-safety-b01ae",
  storageBucket: "women-safety-b01ae.appspot.com",
  messagingSenderId: "185083347571",
  appId: "1:185083347571:web:6776fc6f294b3912a5e006"
};

// INIT FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// EMERGENCY CONTACTS (FIXED)
const emergencyContacts = [
  "+919014974693",
  "+919381842856",
  "+919133042642"
];

// BACKEND URL
const BACKEND_URL = "https://sheshield-umu1.onrender.com/api/emergency";

// TRACKED PATH
let trackedPath = [];
let watchId = null;

// START LOCATION TRACKING
function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      trackedPath.push({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timestamp: new Date().toISOString()
      });
    },
    (err) => console.error("Tracking error:", err),
    { enableHighAccuracy: true }
  );
}

// STOP TRACKING
function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

// BUTTON HANDLER
document.addEventListener("DOMContentLoaded", () => {
  startTracking();

  const unsafeBtn = document.getElementById("unsafeBtn");
  if (!unsafeBtn) return;

  unsafeBtn.addEventListener("click", async () => {
    stopTracking();

    if (trackedPath.length === 0) {
      alert("No location tracked yet");
      return;
    }

    // SAVE PATH TO FIRESTORE (OPTIONAL)
    try {
      await addDoc(collection(db, "unsafePaths"), {
        path: trackedPath,
        timestamp: new Date()
      });
    } catch (e) {
      console.error("Firestore error:", e);
    }

    // SEND TO BACKEND
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: trackedPath,
          phoneNumbers: emergencyContacts
        })
      });

      const msg = await response.text();
      alert(msg);
    } catch (err) {
      alert("Emergency service failed");
      console.error(err);
    }

    // RESET
    trackedPath = [];
    startTracking();
  });
});

 


























