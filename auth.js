import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
// Login function
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
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
console.log("auth.ja is loading");

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
