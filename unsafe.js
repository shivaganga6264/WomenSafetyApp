import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

// Correct backend endpoint
const BACKEND_URL = "https://sheshield-umu1.onrender.com/api/emergency";

document.addEventListener("DOMContentLoaded", () => {
  const unsafeBtn = document.getElementById("unsafeBtn");

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



