// locationUpdater.js
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

let watchId = null;

export function startLocationUpdates(userPhoneNumber) {
  const user = auth.currentUser;
  if (!user) {
    console.warn("No logged-in user.");
    return;
  }

  async function updateLocation(pos) {
    const ref = doc(db, "users-locations", user.uid);
    await setDoc(ref, {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      phoneNumber: userPhoneNumber,
      lastUpdated: Date.now()
    }, { merge: true });
  }

  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
      (pos) => updateLocation(pos),
      (err) => console.error("Location error:", err),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 }
    );
  }
}

export function stopLocationUpdates() {
  if (watchId) navigator.geolocation.clearWatch(watchId);
}
