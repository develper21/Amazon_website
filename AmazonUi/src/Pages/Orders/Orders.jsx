import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import styles from "./orders.module.css";
import orderNowGif from "../../assets/Images/order-now.gif";
import { auth } from "../../Utility/firebase";
const backendUrl =
  import.meta.env.VITE_REACT_APP_BACKEND_URL || "http://localhost:5000/api";
import OrderMap from "./OrderMap";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");
        const idToken = await user.getIdToken();
        const response = await fetch(`${backendUrl}/orders`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        let data = await response.json();
        // Parse address JSON to shippingDetails
        data = data.map((order) => {
          let shippingDetails = {};
          try {
            shippingDetails = order.address ? JSON.parse(order.address) : {};
          } catch {
            shippingDetails = {};
          }
          return { ...order, shippingDetails };
        });
        setOrders(data);
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <Layout>
      <div className={styles.ordersWrapper}>
        <h2>Your Orders</h2>
        {orders.length === 0 && !loading && (
          <div className={styles.orderNowGifWrap}>
            <img
              src={orderNowGif}
              alt="Order Now"
              className={styles.orderNowGifFull}
            />
          </div>
        )}
        <div className={styles.ordersList}>
          {loading ? (
            <div style={{ textAlign: "center", color: "#888", marginTop: 24 }}>
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: "center", color: "#888", marginTop: 24 }}>
              No orders found.
            </div>
          ) : (
            <div className={styles.ordersGrid}>
              {orders.map((order) => (
                <div className={styles.orderCard} key={order.id}>
                  <div className={styles.orderHeader}>
                    <div>
                      <span className={styles.orderId}>
                        Order #{order.id.slice(0, 8)}...
                      </span>
                    </div>
                    <div className={styles.orderDate}>
                      {order.createdAt && order.createdAt.seconds
                        ? new Date(
                            order.createdAt.seconds * 1000
                          ).toLocaleString()
                        : order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : ""}
                    </div>
                  </div>
                  <div className={styles.orderStatusRow}>
                    <span className={styles.orderStatus}>
                      <b>Status:</b> {order.status || "Processing"}
                    </span>
                  </div>
                  <div className={styles.orderShippingBlock}>
                    <b>Shipping:</b>
                    <div className={styles.orderShippingDetails}>
                      <span>{order.shippingDetails?.name}</span>
                      <span>{order.shippingDetails?.address}</span>
                      <span>{order.shippingDetails?.country}</span>
                      <span>{order.shippingDetails?.pincode}</span>
                      <span>{order.shippingDetails?.contact}</span>
                    </div>
                  </div>
                  <div className={styles.orderItemsBlock}>
                    <b>Items:</b>
                    <ul className={styles.orderItemsList}>
                      {(order.items || order.cart || []).map((item, idx) => (
                        <li key={idx} className={styles.orderItem}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className={styles.orderItemImg}
                          />
                          <span className={styles.orderItemLabel}>Product</span>
                          <span
                            className={styles.orderItemTitle}
                            title={item.title}
                          >
                            {item.title}
                          </span>
                          <span className={styles.orderItemLabel}>Qty</span>
                          <span className={styles.orderItemQty}>
                            x{item.quantity}
                          </span>
                          <span className={styles.orderItemLabel}>Total</span>
                          <span className={styles.orderItemPrice}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.orderSummaryBlock}>
                    <div className={styles.orderSummaryRow}>
                      <span>Total:</span>
                      <span>${order.subTotal?.toFixed(2) ?? "0.00"}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className={styles.orderSummaryRow}>
                        <span>
                          Discount
                          {order.promoCode ? ` (${order.promoCode})` : ""}:
                        </span>
                        <span>- ${order.discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.orderMap}>
                    <OrderMap address={order.shippingDetails?.address} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {(!orders || orders.length === 0) && (
          <div className={styles.orderMap}>
            <OrderMap address={null} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
