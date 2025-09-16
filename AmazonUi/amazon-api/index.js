const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Prisma Orders API
const ordersApi = require("./orders");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://amazon-clone-frontend-phi.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Orders API endpoints
app.use("/api", ordersApi);

// This endpoint creates a checkout session for Stripe payments / using stripe's payment UI
app.post("/api/payment/create-checkout-session", async (req, res) => {
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

    // Return the session URL for Stripe Checkout redirect
    res.status(200).json({ url: session.url });
  } catch (error) {
    logger.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// This endpoint creates a payment intent for Stripe payments / payment UI is handled by our client code
app.post("/api/payment/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

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

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server is running on: http://localhost:${process.env.PORT || 5000}`
  );
});
