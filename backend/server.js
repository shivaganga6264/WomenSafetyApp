 const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Debug: Check if env variables are loaded
 
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// API for sending emergency message & call
app.post("/api/emergency", async (req, res) => {
  const { latitude, longitude, phoneNumbers } = req.body;

  if (!latitude || !longitude || !Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
    return res.status(400).send("Missing location or phone numbers");
  }

  const googleMapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
  const message = `🚨 Emergency Alert! Location: ${googleMapsLink}`;

  try {
    // Send SMS
    const smsPromises = phoneNumbers.map((number) =>
      client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: number,
      })
    );

    // Make Calls
    const callPromises = phoneNumbers.map((number) =>
      client.calls.create({
        twiml: `<Response><Say>Emergency Alert. Please check your messages. The user is in danger.</Say></Response>`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: number,
      })
    );

    await Promise.all([...smsPromises, ...callPromises]);

    res.send("📞 Emergency calls and SMS sent to all numbers!");
  } catch (err) {
    console.error("❌ Twilio Error Details:", err);
    res.status(500).send(`Failed to send emergency alerts: ${err.message}`);
  }
});

// Basic check route
app.get("/", (req, res) => {
  res.send("✅ Women Safety backend is running");
});

app.listen(5000, "0.0.0.0", () => {
  console.log("🚀 Server running at http://0.0.0.0:5000");
});
