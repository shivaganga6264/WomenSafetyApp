 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { auth as authInstance } from "./firebase.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCVsTNfI-nlaKqx7BxEVSoU9E7qtdJc5Mw",
  authDomain: "women-safety-b01ae.firebaseapp.com",
  projectId: "women-safety-b01ae",
  storageBucket: "women-safety-b01ae.appspot.com",
  messagingSenderId: "185083347571",
  appId: "1:185083347571:web:6776fc6f294b3912a5e006",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Backend URL
const BACKEND_URL = "https://sheshield-umu1.onrender.com/api/emergency";

// ⭐ Save user's latest location to Firestore
async function saveUserLocation(lat, lon) {
  const user = auth.currentUser;
  if (!user) {
    console.log("User not logged in");
    return;
  }

  await setDoc(doc(db, "usersLocation", user.uid), {
    userId: user.uid,
    latitude: lat,
    longitude: lon,
    timestamp: new Date().toISOString()
  });

  console.log("User location updated:", lat, lon);
}

// ⭐ Start tracking user continuously
let watchId = null;

function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      console.log("Tracking location:", lat, lon);

      // Save current location
      saveUserLocation(lat, lon);
    },
    (err) => {
      console.error("Tracking error:", err);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 30000
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {

  // ⭐ Start continuous tracking immediately after page load
  startTracking();

  const unsafeBtn = document.getElementById("unsafeBtn");

  // When user clicks unsafe button → send emergency alert
  unsafeBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const user = auth.currentUser;
        if (!user) {
          alert("User not logged in.");
          return;
        }

        console.log("Sending emergency request:", { lat, lon, uid: user.uid });

        try {
          const res = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: lat,
              longitude: lon,
              uid: user.uid
            })
          });

          const msg = await res.text();
          alert(msg);

        } catch (err) {
          console.error("Backend error:", err);
          alert("Failed to send emergency alert.");
        }
      },
      () => alert("Please allow location access"),
      { enableHighAccuracy: true }
    );
  });
});






