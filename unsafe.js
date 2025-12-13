import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

/* -------------------------
   FIREBASE CONFIG (ONLY FOR STORING PATH)
------------------------- */
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

/* -------------------------
   EMERGENCY CONTACTS
------------------------- */
const emergencyContacts = [
  "+919014974693",
  "+919381842856",
  "+919133042642"
];

/* -------------------------
   BACKEND URL
------------------------- */
const BACKEND_URL = "https://sheshield-umu1.onrender.com/api/emergency";

/* -------------------------
   TRACKING VARIABLES
------------------------- */
let trackedPath = [];
let watchId = null;

/* -------------------------
   START LIVE TRACKING
------------------------- */
function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  console.log("📡 Starting live location tracking...");

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      const point = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timestamp: new Date().toISOString()
      };

      trackedPath.push(point);
      console.log("📍 Live location:", point.latitude, point.longitude);
    },
    (err) => console.error("Location error:", err),
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 30000
    }
  );
}

/* -------------------------
   STOP TRACKING
------------------------- */
function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

/* -------------------------
   PAGE LOAD
------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 unsafe.js loaded");
  startTracking();

  const unsafeBtn = document.getElementById("unsafeBtn");

  unsafeBtn.addEventListener("click", async () => {
    console.log("🛑 UNSAFE BUTTON CLICKED");
    stopTracking();

    if (trackedPath.length === 0) {
      alert("Location path missing");
      return;
    }

    /* OPTIONAL: SAVE PATH TO FIRESTORE */
    try {
      await addDoc(collection(db, "unsafePaths"), {
        path: trackedPath,
        timestamp: new Date().toISOString()
      });
      console.log("✅ Path saved to Firestore");
    } catch (err) {
      console.error("Firestore error:", err);
    }

    /* SEND TO BACKEND */
    try {
      console.log("📤 Sending emergency alert");

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
      alert("Failed to contact emergency service");
    }

    trackedPath = [];
    startTracking();
  });
});


 



























