import React, { useEffect, useState, useMemo } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import "./payment.css";
import { useCart } from "../../components/DataProvider/DataProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import visaImg from "../../assets/Images/visa2.png";
import mastercardImg from "../../assets/Images/master.png";
import amexImg from "../../assets/Images/american.png";

import { auth } from "../../Utility/firebase";
const backendUrl =
  import.meta.env.VITE_REACT_APP_BACKEND_URL || "http://localhost:5000/api";

const stripePromise = loadStripe(
  "pk_test_51RfM7r98eUlvgtFkrLn7amI82y8m0PFXr7jFJasmWO5ZCEQ8Sqzvt9SwMrCkjKyS9p8B3tgIWGATRu1q9kKcoewH00YHcXHS1C"
);

async function saveOrderToBackend(orderData) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const idToken = await user.getIdToken();
  // Attach user email and name for backend user creation
  const userInfo = { email: user.email, name: user.displayName };
  const response = await fetch(`${backendUrl}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ ...orderData, ...userInfo }),
  });
  if (!response.ok) throw new Error("Failed to save order");
  return response.json();
}

function StripeCardForm({
  totalAmount,
  cart,
  shippingDetails,
  discount,
  subTotal,
  promoCode,
  onSuccess,
}) {
  // Memoize orderData to avoid unnecessary recalculation
  const orderData = useMemo(
    () => ({
      items: cart.map((item) => ({
        productId: item.productId || item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image || null,
      })),
      shippingDetails: shippingDetails || {},
      totalAmount,
      paymentStatus: "paid",
      discount,
      subTotal,
      promoCode,
    }),
    [cart, shippingDetails, totalAmount, discount, subTotal, promoCode]
  );
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!backendUrl) {
        setError("Backend URL is not set. Check your .env and Vite config.");
        setLoading(false);
        return;
      }
      // Prepare order data for backend
      const orderData = {
        items: cart.map((item) => ({
          productId: item.productId || item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image || null,
        })),
        shippingDetails: shippingDetails || {},
        totalAmount,
        paymentStatus: "paid",
        discount,
        subTotal,
        promoCode,
      };
      // 1. Create payment intent
      const response = await fetch(
        `${backendUrl}/payment/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalAmount }),
        }
      );
      const data = await response.json();
      if (!data.clientSecret) {
        setError("Failed to create payment intent.");
        setLoading(false);
        return;
      }
      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
      if (result.error) {
        setError(result.error.message);
      } else if (
        result.paymentIntent &&
        result.paymentIntent.status === "succeeded"
      ) {
        // 3. Save order to backend
        await saveOrderToBackend(orderData);
        toast.success("Payment & Order successful!");
        if (onSuccess) onSuccess();
      } else {
        setError("Payment failed. Please try again.");
      }
    } catch {
      setError("Payment error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      {!stripe || !elements ? (
        <div
          style={{
            color: "red",
            marginBottom: 12,
            textAlign: "center",
            maxWidth: 600,
            width: "100%",
            margin: "0 auto",
          }}
        >
          Stripe is not loaded. Please check your Stripe publishable key and
          reload the page.
        </div>
      ) : null}
      <div className="stripeCardBox">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {error && (
        <div
          style={{
            color: "red",
            marginBottom: 12,
            maxWidth: 600,
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
      <button
        className="placeOrderBtn"
        type="submit"
        disabled={!stripe || loading || totalAmount <= 0}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        {loading && <ClipLoader size={20} color="#fff" speedMultiplier={0.8} />}
        <span>{loading ? "Processing..." : "Pay with Card (Stripe)"}</span>
      </button>
    </form>
  );
}

const Payment = () => {
  const {
    cart,
    shippingDetails,
    totalAmount,
    discount,
    subTotal,
    promoCode,
    updateShippingDetails,
    updateCartItem,
    removeCartItem,
  } = useCart();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const [editShipping, setEditShipping] = useState(false);
  const [shippingForm, setShippingForm] = useState(shippingDetails || {});
  const [shippingLoading, setShippingLoading] = useState(false);

  useEffect(() => {
    if (!shippingDetails) {
      toast.error("Please complete shipping details first.");
      navigate("/shipping");
    }
  }, [shippingDetails, navigate]);

  // Handlers for shipping edit
  const handleShippingChange = (e) => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
  };
  const handleShippingSave = async () => {
    setShippingLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    updateShippingDetails(shippingForm);
    setEditShipping(false);
    setShippingLoading(false);
    toast.success("Delivery address updated!");
  };
  const handleShippingCancel = () => {
    setShippingForm(shippingDetails);
    setEditShipping(false);
  };

  // Stripe Checkout redirect handler (now with loading/error state)
  const handleStripeCheckoutSession = async () => {
    setCheckoutError("");
    setCheckoutLoading(true);
    try {
      const items = cart.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.title },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));
      const response = await fetch(
        `${backendUrl}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, shippingDetails }),
        }
      );
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.id) {
        window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
      } else {
        setCheckoutError("Failed to start Stripe Checkout session.");
      }
    } catch (err) {
      setCheckoutError("Error starting Stripe Checkout session.");
    }
    setCheckoutLoading(false);
  };

  // Helper to provide order data to StripeCardForm
  window.saveOrderData = () => ({
    cart,
    shippingDetails,
    totalAmount,
    discount,
    subTotal,
    promoCode,
    createdAt: Timestamp.now(),
    status: "paid",
  });

  return (
    <Layout>
      <div className="paymentSectionWrapper">
        <motion.div
          className="paymentBox"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="paymentTitle">Review & Pay</h2>

          <motion.div
            className="reviewSection"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="reviewBlock">
              <h3 className="reviewHeading">Delivery Location</h3>
              {editShipping ? (
                <div className="reviewDelivery">
                  <input
                    name="name"
                    value={shippingForm?.name || ""}
                    onChange={handleShippingChange}
                    placeholder="Name"
                  />
                  <input
                    name="address"
                    value={shippingForm?.address || ""}
                    onChange={handleShippingChange}
                    placeholder="Address"
                  />
                  <input
                    name="pincode"
                    value={shippingForm?.pincode || ""}
                    onChange={handleShippingChange}
                    placeholder="Pincode"
                  />
                  <input
                    name="country"
                    value={shippingForm?.country || ""}
                    onChange={handleShippingChange}
                    placeholder="Country"
                  />
                  <input
                    name="contact"
                    value={shippingForm?.contact || ""}
                    onChange={handleShippingChange}
                    placeholder="Phone"
                  />
                  <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                    <button
                      className="placeOrderBtn"
                      type="button"
                      onClick={handleShippingSave}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                      }}
                      disabled={shippingLoading}
                    >
                      {shippingLoading && (
                        <ClipLoader
                          size={20}
                          color="#fff"
                          speedMultiplier={0.8}
                        />
                      )}
                      <span>Save</span>
                    </button>
                    <button
                      className="placeOrderBtn"
                      type="button"
                      onClick={handleShippingCancel}
                      style={{ background: "#ccc", color: "#222" }}
                      disabled={shippingLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="reviewDelivery">
                  <div>
                    <b>Name:</b> {shippingDetails?.name}
                  </div>
                  <div>
                    <b>Address:</b> {shippingDetails?.address}
                  </div>
                  <div>
                    <b>Pincode:</b> {shippingDetails?.pincode}
                  </div>
                  <div>
                    <b>Country:</b> {shippingDetails?.country}
                  </div>
                  <div>
                    <b>Phone:</b> {shippingDetails?.contact}
                  </div>
                  <button
                    className="placeOrderBtn"
                    type="button"
                    style={{ marginTop: 8 }}
                    onClick={() => setEditShipping(true)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          <div className="reviewBlock">
            <h3 className="reviewHeading">Your Cart</h3>
            <div className="reviewCartItems">
              {cart.length === 0 ? (
                <div style={{ color: "#888", fontStyle: "italic" }}>
                  Your cart is empty.
                </div>
              ) : (
                cart.map((item) => (
                  <div className="reviewCartItem" key={item.id}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="reviewCartImg"
                    />
                    <div className="reviewCartInfo">
                      <div className="reviewCartTitle">{item.title}</div>
                      <>
                        <div
                          className="reviewCartQty"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <button
                            type="button"
                            className="iconBtn"
                            title="Decrease"
                            onClick={() =>
                              updateCartItem(
                                item.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={15} />
                          </button>
                          <span>Qty: {item.quantity}</span>
                          <button
                            type="button"
                            className="iconBtn"
                            title="Increase"
                            onClick={() =>
                              updateCartItem(item.id, item.quantity + 1)
                            }
                          >
                            <FaPlus size={15} />
                          </button>
                        </div>
                        <div className="reviewCartPrice">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div style={{ marginTop: 4, display: "flex", gap: 8 }}>
                          <button
                            type="button"
                            className="iconBtn delete"
                            title="Remove"
                            onClick={async () => {
                              const result = await Swal.fire({
                                title: "Are you sure?",
                                text: "Do you want to remove this item from your cart?",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#e74c3c",
                                cancelButtonColor: "#3085d6",
                                confirmButtonText: "Yes, remove it!",
                              });
                              if (result.isConfirmed) {
                                removeCartItem(item.id);
                                Swal.fire(
                                  "Removed!",
                                  "The item has been removed.",
                                  "success"
                                );
                              }
                            }}
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <motion.div
            className="totalAmount"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ fontWeight: 500, color: "#333", marginBottom: 2 }}>
              Order Summary
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1rem",
              }}
            >
              <span>Subtotal:</span>
              <span>${subTotal?.toFixed(2) ?? "0.00"}</span>
            </div>
            {discount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#1a4d1a",
                  fontWeight: 600,
                }}
              >
                <span>Discount{promoCode ? ` (${promoCode})` : ""}:</span>
                <span>- ${discount.toFixed(2)}</span>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1rem",
              }}
            >
              <span>Total:</span>
              <span className="amount">
                ${totalAmount ? totalAmount.toFixed(2) : "0.00"}
              </span>
            </div>
          </motion.div>

          <div className="supportedCardsRow">
            <div className="supportedCard">
              <img
                src={visaImg}
                alt="Visa"
                className="supportedCardImg visa-img-bg"
              />
              <span>Visa</span>
            </div>
            <div className="supportedCard">
              <img
                src={mastercardImg}
                alt="Mastercard"
                className="supportedCardImg"
              />
              <span>Mastercard</span>
            </div>
            <div className="supportedCard">
              <img
                src={amexImg}
                alt="American Express"
                className="supportedCardImg"
              />
              <span>Amex</span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: "100%" }}
          >
            <Elements stripe={stripePromise}>
              <StripeCardForm
                totalAmount={totalAmount}
                cart={cart}
                shippingDetails={shippingDetails}
                discount={discount}
                subTotal={subTotal}
                promoCode={promoCode}
                onSuccess={() => navigate("/orders")}
              />
            </Elements>
            <button
              className="placeOrderBtn stripeCheckoutBtn"
              style={{
                marginTop: 18,
                background: "#635bff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
              onClick={handleStripeCheckoutSession}
              type="button"
              disabled={
                cart.length === 0 ||
                !shippingDetails ||
                checkoutLoading ||
                totalAmount <= 0
              }
            >
              {checkoutLoading && (
                <ClipLoader size={20} color="#fff" speedMultiplier={0.8} />
              )}
              <span>
                {checkoutLoading
                  ? "Starting Stripe Checkout..."
                  : "Pay with Stripe Checkout (Popup UI)"}
              </span>
            </button>
            {checkoutError && (
              <div
                style={{
                  color: "red",
                  marginTop: 8,
                  textAlign: "center",
                  maxWidth: 600,
                  margin: "0 auto",
                }}
              >
                {checkoutError}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Payment;
