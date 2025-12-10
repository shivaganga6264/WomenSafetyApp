 import { auth, db } from "./firebase.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// -------------------------
// BACKEND API
// -------------------------
const BACKEND_URL = "https://sheshield-umu1.onrender.com/api/emergency";


// -------------------------
// SAVE USER LOCATION TO FIRESTORE
// -------------------------
async function saveUserLocation(lat, lon) {
  const user = auth.currentUser;

  if (!user) {
    console.log("❌ Cannot save location (User not logged in)");
    return;
  }

  // ⭐ Get phone number stored during login
  let phoneNumber = localStorage.getItem("phoneNumber");

  if (!phoneNumber) {
    console.log("❌ No phone number found in localStorage");
  }

  await setDoc(
    doc(db, "usersLocation", user.uid),
    {
      userId: user.uid,
      latitude: Number(lat),     // ⭐ FIX: save as number
      longitude: Number(lon),    // ⭐ FIX: save as number
      phoneNumber: phoneNumber,
      timestamp: new Date().toISOString()
    },
    { merge: true }
  );

  console.log("📍 Location updated:", lat, lon);
}


// -------------------------
// START CONTINUOUS TRACKING
// -------------------------
function startTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported in this browser.");
    return;
  }

  console.log("📡 Starting live location tracking...");

  navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      console.log("▶ Live location:", lat, lon);
      saveUserLocation(lat, lon);
    },
    (err) => console.error("⚠ Location tracking error:", err),
    { enableHighAccuracy: true }
  );
}


// -------------------------
// UNSAFE BUTTON HANDLER
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 unsafe.js loaded into page");

  startTracking();

  const unsafeBtn = document.getElementById("unsafeBtn");
  if (!unsafeBtn) {
    console.error("❌ ERROR: unsafeBtn not found in dashboard.html");
    return;
  }

  unsafeBtn.addEventListener("click", async () => {
    console.log("🛑 UNSAFE BUTTON CLICKED!");

    // 1️⃣ Get location
    let pos;
    try {
      pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
    } catch (err) {
      console.error("❌ Failed to fetch current location");
      alert("Location access denied");
      return;
    }

    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    console.log("📍 Emergency Location:", lat, lon);

    // 2️⃣ Check user login
    const user = auth.currentUser;
    if (!user) {
      console.log("❌ User not logged in");
      alert("You must log in first!");
      return;
    }

    console.log("👤 UID:", user.uid);

    // 3️⃣ Build payload
    const payload = {
      latitude: Number(lat),   // ⭐ FIX
      longitude: Number(lon),  // ⭐ FIX
      uid: user.uid
    };

    console.log("📦 Sending Payload:", payload);

    // 4️⃣ Send to backend
    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.text();
      console.log("📥 Backend reply:", result);
      alert(result);

    } catch (error) {
      console.error("❌ Backend connection error:", error);
      alert("Failed to contact emergency service.");
    }
  });
});























