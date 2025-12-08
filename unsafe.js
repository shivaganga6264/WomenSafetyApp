  import { auth, db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const BACKEND_URL = "https://sheshield-umu1.onrender.com/api/emergency";

// Save user location
async function saveUserLocation(lat, lon) {
  const user = auth.currentUser;
  if (!user) {
    console.log("User not logged in");
    return;
  }

 await setDoc(
  doc(db, "usersLocation", user.uid),
  {
    userId: user.uid,
    latitude: lat,
    longitude: lon,
    phoneNumber: "+919133042642",
    timestamp: new Date().toISOString()
  },
  { merge: true }  // DO NOT remove this!
);

console.log("Location updated:", lat, lon);
}

// Start tracking
function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.watchPosition(
    (pos) => {
      saveUserLocation(pos.coords.latitude, pos.coords.longitude);
    },
    (err) => console.error(err),
    { enableHighAccuracy: true }
  );
}

document.addEventListener("DOMContentLoaded", () => {

  startTracking();

  const unsafeBtn = document.getElementById("unsafeBtn");
  if (!unsafeBtn) return;

  unsafeBtn.addEventListener("click", async () => {
    const pos = await new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );

    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        uid: user.uid
      })
    });

    alert(await response.text());
  });

});














