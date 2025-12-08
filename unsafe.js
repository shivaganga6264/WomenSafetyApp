 // ---- IMPORTS ----
import { auth, db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Backend URL
const BACKEND_URL = "https://sheshield-umu1.onrender.com/api/emergency";

// ⭐ Save latest user location to Firestore
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
    timestamp: new Date().toISOString(),
    phoneNumber: "+911234567890"  // Replace with real number
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
      saveUserLocation(lat, lon);
    },
    (err) => console.error("Tracking error:", err),
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 }
  );
}

document.addEventListener("DOMContentLoaded", () => {

  // Start tracking immediately
  startTracking();

  const unsafeBtn = document.getElementById("unsafeBtn");

  if (!unsafeBtn) {
    console.error("unsafeBtn not found in HTML");
    return;
  }

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

        console.log("Sending emergency:", { lat, lon, uid: user.uid });

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











