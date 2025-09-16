const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Firebase Admin SDK for server-side Firestore access
const admin = require("firebase-admin");
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

setGlobalOptions({ maxInstances: 10 });

app.use(cors({ origin: true }));
app.use(express.json());

// app.get("/", (req, res) => {
//   res.status(200).send("Hello from Firebase!");
// });

// This endpoint creates a checkout session for Stripe payments / using stripe's payment UI
app.post("/payment/create-checkout-session", async (req, res) => {
  const { items } = req.body;

  // validation for items
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid items array." });
  }

  // Prevent negative or zero amounts in line items
  for (const item of items) {
    if (
      !item.price_data ||
      !item.price_data.unit_amount ||
      typeof item.price_data.unit_amount !== "number" ||
      item.price_data.unit_amount <= 0
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or negative item amount." });
    }
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    logger.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// This endpoint creates a payment intent for Stripe payments / payment UI is handled by our client code
app.post("/payment/create-payment-intent", async (req, res) => {
  const { amount, orderData } = req.body;

  // Validate amount
  if (
    typeof amount !== "number" ||
    isNaN(amount) ||
    amount <= 0 ||
    !isFinite(amount)
  ) {
    return res.status(400).json({ error: "Invalid or negative amount." });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents and round
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // Save order to Firestore if orderData is provided
    if (orderData) {
      try {
        await db.collection("orders").add({
          ...orderData,
          paymentIntentId: paymentIntent.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (err) {
        logger.error("Error saving order to Firestore:", err);
      }
    }

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.api = onRequest(app);
// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });
