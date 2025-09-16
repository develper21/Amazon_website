// Orders API for Amazon Clone using Prisma
const express = require("express");
const prisma = require("./prisma/client");
const router = express.Router();

// Create a new order (called from payment endpoint, requires Firebase auth)
const { authenticateFirebaseToken } = require("./authMiddleware");
router.post("/orders", authenticateFirebaseToken, async (req, res) => {
  console.log("Order endpoint hit. Body:", req.body);
  
  // Create a new Prisma client for this request to avoid prepared statement conflicts
  const { PrismaClient } = require("@prisma/client");
  const requestPrisma = new PrismaClient();
  
  try {
    // userId is now taken from the verified Firebase token
    const firebaseUid = req.firebaseUid;
    const {
      totalAmount,
      paymentStatus,
      shippingDetails,
      items,
      email,
      name,
      discount,
      subTotal,
      promoCode,
    } = req.body;
    if (!firebaseUid || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing required order data." });
    }

    // Ensure user exists in DB, create if not
    // Try to find user by firebaseUid first (new schema), fallback to id (old schema)
    let user;
    try {
      user = await requestPrisma.user.findUnique({
        where: { firebaseUid: firebaseUid },
      });
    } catch (error) {
      // If firebaseUid field doesn't exist, try using id field (legacy)
      console.log("Falling back to legacy user lookup by id");
      try {
        user = await requestPrisma.user.findUnique({
          where: { id: firebaseUid },
        });
      } catch (legacyError) {
        console.log("Legacy lookup failed, user doesn't exist");
        user = null;
      }
    }

    if (!user) {
      try {
        // Try creating with new schema first
        user = await requestPrisma.user.create({
          data: {
            firebaseUid: firebaseUid,
            email: email || `${firebaseUid}@unknown.com`,
            name: name || null,
          },
        });
      } catch (error) {
        // If new schema fails, try legacy schema (minimal fields only)
        console.log("Falling back to legacy user creation");
        try {
          user = await requestPrisma.user.create({
            data: {
              id: firebaseUid,
              email: email || `${firebaseUid}@unknown.com`,
              name: name || null,
            },
          });
        } catch (minimalError) {
          // If even that fails, try with just email
          console.log("Falling back to minimal user creation");
          user = await requestPrisma.user.create({
            data: {
              email: email || `${firebaseUid}@unknown.com`,
              name: name || null,
            },
          });
        }
      }
    }
    // Store shippingDetails as JSON string in address field
    const order = await requestPrisma.order.create({
      data: {
        userId: user.id, // using the generated UUID, not the Firebase UID
        total: totalAmount,
        status: paymentStatus,
        address: shippingDetails ? JSON.stringify(shippingDetails) : "",
        discount: discount ?? 0,
        subTotal: subTotal ?? 0,
        promoCode: promoCode ?? "",
        items: {
          create: items.map((item) => ({
            productId: String(item.productId),
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
          })),
        },
      },
      include: { items: true },
    });
    res.status(201).json(order);
  } catch (err) {
    console.error("[ORDER CREATE ERROR]", err);
    res
      .status(500)
      .json({ error: "Failed to create order", details: err.message });
  } finally {
    // Clean up the request-specific Prisma client
    await requestPrisma.$disconnect();
  }
});

// Get all orders for the authenticated user
router.get("/orders", authenticateFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.firebaseUid;

    // Find user by Firebase UID first (new schema), fallback to id (old schema)
    let user;
    try {
      user = await prisma.user.findUnique({ where: { firebaseUid } });
    } catch (error) {
      // Fallback to legacy schema
      try {
        user = await prisma.user.findUnique({ where: { id: firebaseUid } });
      } catch (legacyError) {
        user = null;
      }
    }
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    console.error("[ORDER FETCH ERROR]", err);
    res
      .status(500)
      .json({ error: "Failed to fetch orders", details: err.message });
  }
});

module.exports = router;
