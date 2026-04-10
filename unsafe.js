import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// Unique user ID
if (!localStorage.getItem("userId")) {
  localStorage.setItem("userId", "user_" + Math.floor(Math.random() * 10000));
}
const userId = localStorage.getItem("userId");

// Contacts
const emergencyContacts = ["+919014974693"];

// Backend URL
const BACKEND_URL = "https://sheshield-umu1.onrender.com/api/emergency";

let trackedPath = [];
let watchId = null;

// Distance
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Nearby users
async function findNearbyUsers(lat, lng) {
  const snapshot = await getDocs(collection(db, "users"));
  const users = [];

  snapshot.forEach((docSnap) => {
    const u = docSnap.data();
    if (!u.latitude || !u.longitude) return;

    const d = getDistance(lat, lng, u.latitude, u.longitude);
    if (d <= 2 && docSnap.id !== userId) {
      users.push(docSnap.id);
    }
  });

  return users;
}

// Start tracking
function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    async (pos) => {
      const point = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        timestamp: new Date().toISOString()
      };

      trackedPath.push(point);

      await setDoc(doc(db, "users", userId), {
        latitude: point.lat,
        longitude: point.lng,
        updatedAt: new Date().toISOString(),
        isTrusted: true
      });

      console.log("Tracking:", point);
    },
    (err) => {
      console.error(err);
      alert("Enable location");
    },
    { enableHighAccuracy: true, timeout: 15000 }
  );
}

function stopTracking() {
  if (watchId) navigator.geolocation.clearWatch(watchId);
}

// Main
document.addEventListener("DOMContentLoaded", () => {
  startTracking();

  document.getElementById("unsafeBtn").addEventListener("click", async () => {

    alert("Collecting location...");
    await new Promise(r => setTimeout(r, 6000));

    stopTracking();

    // Ensure path
    if (!trackedPath || trackedPath.length < 2) {
      const pos = await new Promise(resolve =>
        navigator.geolocation.getCurrentPosition(resolve)
      );

      const p = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        timestamp: new Date().toISOString()
      };

      trackedPath = [p, p];
    }

    const last = trackedPath[trackedPath.length - 1];
    const nearby = await findNearbyUsers(last.lat, last.lng);

    console.log("Nearby:", nearby);

    // Save path
    await addDoc(collection(db, "unsafePaths"), {
      path: trackedPath,
      timestamp: new Date().toISOString()
    });

    // Backend call
    try {
      const first = trackedPath[0];

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          latitude: first.lat,
          longitude: first.lng,
          path: trackedPath,
          phoneNumbers: emergencyContacts
        })
      });

      const text = await res.text();
      alert(text);

    } catch (e) {
      console.error(e);
      alert("Backend failed");
    }

    trackedPath = [];
    startTracking();
  });
});