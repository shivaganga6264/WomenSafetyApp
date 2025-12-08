 import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// ⭐ ADDED — import location updater
import { startLocationUpdates } from "./locationUpdater.js";

// Login function
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {

            const user = userCredential.user;

            // ⭐ ADDED — get user's phone number from Firestore (required)
            // If you stored phone number somewhere else, modify this part
            let phoneNumber = "";
            try {
                const userData = JSON.parse(localStorage.getItem("userProfile"));
                if (userData && userData.phoneNumber) {
                    phoneNumber = userData.phoneNumber;
                }
            } catch (e) {
                console.log("No phone number found in localStorage");
            }

            // ⭐ ADDED — start tracking user location
            startLocationUpdates(phoneNumber);

            message.textContent = "Login successful! Redirecting...";
            setTimeout(() => {
                window.location.href = "dashboard.html"; // Redirect to Unsafe Button Page
            }, 2000);
        })
        .catch((error) => {
            message.textContent = "Login failed: " + error.message;
        });
}

// Attach login function to button
window.login = login;
console.log("auth.js is loading");

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function (registration) {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch(function (error) {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}


