import { auth, db } from "./firebase.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";


// -----------------------------------------
// SETUP RECAPTCHA FOR OTP
// -----------------------------------------
window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  size: "invisible"
});


// -----------------------------------------
// SEND OTP TO USER
// -----------------------------------------
window.sendOTP = async function () {
  const phone = document.getElementById("phone").value;

  if (!phone) {
    alert("Enter phone number");
    return;
  }

  try {
    const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
    window.confirmationResult = confirmation;

    alert("OTP sent!");
  } catch (err) {
    console.error(err);
    alert("Failed to send OTP");
  }
};


// -----------------------------------------
// VERIFY OTP → LOGIN USER
// -----------------------------------------
window.verifyOTP = async function () {
  const code = document.getElementById("otp").value;

  if (!code) {
    alert("Enter OTP");
    return;
  }

  try {
    const result = await window.confirmationResult.confirm(code);
    const user = result.user;

    console.log("Logged in UID:", user.uid);

    // Save phone number in Firestore
    await setDoc(
      doc(db, "usersLocation", user.uid),
      {
        userId: user.uid,
        phoneNumber: user.phoneNumber
      },
      { merge: true }
    );

    alert("Login successful!");
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error(err);
    alert("Incorrect OTP");
  }
};


// -----------------------------------------
// AUTO-LOGIN CHECK
// -----------------------------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Already logged in:", user.uid);

    // Ensure phone number is stored
    setDoc(
      doc(db, "usersLocation", user.uid),
      { phoneNumber: user.phoneNumber },
      { merge: true }
    );
  }
});
