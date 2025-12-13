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
   CONTACTS
------------------------- */
const emergencyContacts = [
  "+919014974693",
  "+919381842856",
  "+919133042642"
];

/* -------------------------
   BACKEND URLs
------------------------- */
const EMERGENCY_URL = "https://sheshield-umu1.onrender.com/api/emergency";
const CHILD_HELP_URL = "https://sheshield-umu1.onrender.com/api/childhelp";

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

  watchId = navigator.geolocation.watchPosition(
    (pos) => {
      trackedPath.push({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        timestamp: new Date().toISOString()
      });
    },
    (err) => console.error("Location error:", err),
    { enableHighAccuracy: true }
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
  startTracking();

  /* ===== UNSAFE BUTTON ===== */
  document.getElementById("unsafeBtn").addEventListener("click", async () => {
    stopTracking();

    if (trackedPath.length === 0) {
      alert("Location path missing");
      return;
    }

    // Save path (optional)
    await addDoc(collection(db, "unsafePaths"), {
      path: trackedPath,
      timestamp: new Date().toISOString()
    });

    try {
      const res = await fetch(EMERGENCY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: trackedPath,
          phoneNumbers: emergencyContacts
        })
      });

      alert(await res.text());
    } catch {
      alert("Emergency service failed");
    }

    trackedPath = [];
    startTracking();
  });

  /* ===== CHILD HELP BUTTON ===== */
  document.getElementById("childHelpBtn").addEventListener("click", async () => {
    stopTracking();

    if (trackedPath.length === 0) {
      alert("Location missing");
      return;
    }

    const last = trackedPath[trackedPath.length - 1];

    try {
      const res = await fetch(CHILD_HELP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(last)
      });

      alert(await res.text());
    } catch {
      alert("Child help service failed");
    }

    trackedPath = [];
    startTracking();
  });
});



 




























