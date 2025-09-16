import React, { useState, useMemo, useCallback } from "react";
import Layout from "../../components/Layout";
// import Footer from "../../components/Footer";
import styles from "./cart.module.css";
import { Link } from "react-router-dom";
import { useCart } from "../../components/DataProvider/DataProvider";
import { FaTrashAlt } from "react-icons/fa";
import { ACTIONS } from "../../Utility/actions";

const Cart = () => {
  const { cart, dispatch } = useCart();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const [promoTimeout, setPromoTimeout] = useState(null);

  const subTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const delivery = 0;
  const tax = useMemo(
    () => (subTotal > 0 ? Math.round(subTotal * 0.05 * 100) / 100 : 0),
    [subTotal]
  );
  const total = useMemo(
    () => subTotal + delivery + tax - discount,
    [subTotal, delivery, tax, discount]
  );

  // Coupon logic
  const handleApplyPromo = useCallback(() => {
    if (promo.trim().toUpperCase() === "TESFAMICHAEL12") {
      const off = Math.round(subTotal * 0.22 * 100) / 100;
      setDiscount(off);
      setPromoMsg("22% discount applied!");
      if (promoTimeout) clearTimeout(promoTimeout);
      const timeout = setTimeout(() => setPromoMsg(""), 2500);
      setPromoTimeout(timeout);
    } else if (promo.trim() !== "") {
      setDiscount(0);
      setPromoMsg("Invalid code");
      if (promoTimeout) clearTimeout(promoTimeout);
      const timeout = setTimeout(() => setPromoMsg(""), 2500);
      setPromoTimeout(timeout);
    } else {
      setDiscount(0);
      setPromoMsg("");
      if (promoTimeout) clearTimeout(promoTimeout);
    }
  }, [promo, subTotal, promoTimeout]);

  React.useEffect(() => {
    if (promo.trim().toUpperCase() === "TESFAMICHAEL12") {
      const off = Math.round(subTotal * 0.22 * 100) / 100;
      setDiscount(off);
    } else {
      setDiscount(0);
    }
  }, [cart]);

  return (
    <Layout>
      <div className={styles.cartPageGrid}>
        {/* Left: Cart Items */}
        <div className={styles.cartItemsSection}>
          <h2>Your Cart</h2>
          {cart.length === 0 ? (
            <div className={styles.emptyCartMsg}>Your cart is empty.</div>
          ) : (
            cart.map((item) => (
              <div className={styles.cartItemCard} key={item.id}>
                <div className={styles.cartItemImgWrap}>
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.cartItemImg}
                      style={{ cursor: "pointer" }}
                    />
                  </Link>
                </div>
                <div className={styles.cartItemInfo}>
                  <Link
                    to={`/product/${item.id}`}
                    className={styles.cartItemTitle}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {item.title}
                  </Link>
                  <div className={styles.cartItemPrice}>${item.price}</div>
                  {item.size && (
                    <div className={styles.cartItemSize}>Size: {item.size}</div>
                  )}
                  <div className={styles.cartItemActions}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.INCREASE_CART_ITEM,
                          payload: item.id,
                        })
                      }
                    >
                      +
                    </button>
                    <span className={styles.cartItemQty}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() =>
                        item.quantity > 1
                          ? dispatch({
                              type: ACTIONS.DECREASE_CART_ITEM,
                              payload: item.id,
                            })
                          : dispatch({
                              type: ACTIONS.REMOVE_FROM_CART,
                              payload: item.id,
                            })
                      }
                    >
                      -
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.REMOVE_FROM_CART,
                          payload: item.id,
                        })
                      }
                      aria-label="Delete item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginLeft: "auto",
                      }}
                    >
                      <FaTrashAlt size={18} color="#e53935" />
                      <span style={{ color: "#e53935", fontWeight: 500 }}>
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Right: Summary */}
        <div className={styles.cartSummarySection}>
          <div className={styles.cartPromoBanner}>
            <span>
              Congrats! You're eligible for <b>Free Delivery</b>.<br />
              Use code <b>TESFAMICHAEL12</b> for 22% discount.
            </span>
          </div>
          <hr className={styles.cartDivider} />
          <div className={styles.cartPromoInputRow}>
            <input
              className={styles.cartPromoInput}
              placeholder="Promocode"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
            />
            <button className={styles.cartPromoBtn} onClick={handleApplyPromo}>
              Apply
            </button>
          </div>
          {promoMsg &&
            (discount ? (
              <div className={styles.promoSuccessTag}>
                <span className={styles.promoSuccessCheck}>
                  <span style={{ fontSize: "1.2em" }}>✔</span> 22% discount
                  applied!
                </span>
              </div>
            ) : (
              <div className={styles.promoErrorTag}>{promoMsg}</div>
            ))}
          <div className={`${styles.cartSummaryRow} ${styles.subtotal}`}>
            <span>Sub-Total</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className={styles.cartSummaryRow}>
              <span>Discount</span>
              <span
                style={{ color: "#1a4d1a", fontWeight: 600 }}
              >{`- $${discount.toFixed(2)}`}</span>
            </div>
          )}
          <div className={styles.cartSummaryRow}>
            <span>Delivery</span>
            <span>${delivery.toFixed(2)}</span>
          </div>
          <div className={styles.cartSummaryRow}>
            <span>Tax</span>
            <span>(5%) + ${tax.toFixed(2)}</span>
          </div>
          <hr className={styles.cartDivider} />
          <div className={styles.cartSummaryTotalRow}>
            <span>Total</span>
            <span>${total > 0 ? total.toFixed(2) : "0.00"}</span>
          </div>
          <Link to="/shipping" className={styles.cartCheckoutBtn}>
            <button className={styles.cartCheckoutBtnInner}>
              Proceed to Payment
            </button>
          </Link>
        </div>
      </div>
      {/* <Footer /> */}
    </Layout>
  );
};

export default Cart;
