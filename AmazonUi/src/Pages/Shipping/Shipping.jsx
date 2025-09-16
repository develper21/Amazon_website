import React, { useState, useEffect } from "react";
import styles from "./shipping.module.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../components/DataProvider/DataProvider";
import { ACTIONS } from "../../Utility/actions";
import Layout from "../../components/Layout";

const Shipping = () => {
  const navigate = useNavigate();
  const { dispatch, shippingDetails } = useCart();
  const [form, setForm] = useState({
    country: shippingDetails?.country || "",
    name: shippingDetails?.name || "",
    contact: shippingDetails?.contact || "",
    email: shippingDetails?.email || "",
    address: shippingDetails?.address || "",
    pincode: shippingDetails?.pincode || "",
  });
  const [error, setError] = useState("");

  // Dynamically get user's country using geolocation API
  useEffect(() => {
    if (!form.country) {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.country_name) {
            setForm((prev) => ({ ...prev, country: data.country_name }));
          }
        })
        .catch(() => {});
    }
  }, [form.country]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.country ||
      !form.name ||
      !form.contact ||
      !form.email ||
      !form.address ||
      !form.pincode
    ) {
      setError("Please fill all required fields.");
      return;
    }
    // Save shipping details (without orderId)
    dispatch({
      type: ACTIONS.SET_SHIPPING_DETAILS,
      payload: { ...form },
    });
    navigate("/payment");
  };

  return (
    <Layout>
      <div className={styles.shippingContainer}>
        <div className={styles.shippingBox}>
          <h2>Shipping details</h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Country*</label>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Email address*</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Name*</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Home Address*</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  required
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Contact Number*</label>
                <input
                  type="text"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Number"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Pincode*</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                />
              </div>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.saveBtn} type="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Shipping;
