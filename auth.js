  // ---- IMPORTS ----
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

// ---------------- LOGIN FUNCTION ----------------
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            message.textContent = "Login successful! Redirecting...";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);
        })
        .catch((error) => {
            message.textContent = "Login failed: " + error.message;
        });
}

// Make login available for inline onclick
window.login = login;

console.log("auth.js loaded");

// ---------------- SERVICE WORKER ----------------
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((reg) => console.log("ServiceWorker registered:", reg.scope))
            .catch((err) => console.log("ServiceWorker registration failed:", err));
    });
}




