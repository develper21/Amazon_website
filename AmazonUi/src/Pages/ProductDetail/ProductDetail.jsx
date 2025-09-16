import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Layout from "../../components/Layout";
// import Footer from "../../components/Footer";
import styles from "./productDetail.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import productBaseURL from "../../API/endPoints";
import PriceFormat from "../../components/Product/PriceFormat";
import Spinner from "../../components/Spinner";
import Rating from "@mui/material/Rating";
import { useCart } from "../../components/DataProvider/DataProvider";
import { toast } from "react-toastify";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("XL");
  const [added, setAdded] = useState(false);
  const imgRef = useRef(null);
  const { dispatch } = useCart();

  // Framer Motion 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Adjusted rotation logic to ensure edges tilt towards the user as per feedback
  const rotateX = useTransform(y, [-1, 1], [-15, 15]); // Flipped output range
  const rotateY = useTransform(x, [-1, 1], [15, -15]); // Flipped output range

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${productBaseURL}/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    setAdded(true);
    toast.success("Added to cart!");
    setTimeout(() => setAdded(false), 1200);
  };

  if (loading) {
    return (
      <Layout>
        <div
          style={{
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div
          style={{
            minHeight: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Product not found.</p>
        </div>
      </Layout>
    );
  }

  const { image, title, category, rating = {}, price, description } = product;
  const reviews = rating.count || 0;
  const rate = rating.rate || 0;
  const oldPrice = price * 1.7;
  const discount = "60% OFF";
  const isClothing =
    (category || "").toLowerCase() === "men's clothing" ||
    (category || "").toLowerCase() === "women's clothing";

  return (
    <Layout>
      <div
        className={
          product ? `${styles.detailWrapper} animate` : styles.detailWrapper
        }
      >
        <div className={styles.imgSection}>
          <motion.img
            src={image}
            alt={title}
            className={
              product?.image
                ? `${styles.productImg} img-style`
                : styles.productImg
            }
            style={{
              rotateX,
              rotateY,
              boxShadow:
                "0 12px 36px 0 rgba(20,40,80,0.18), 0 1.5px 8px 0 rgba(40,167,69,0.10)",
              borderRadius: "1.5rem",
              transition: "box-shadow 0.3s, filter 0.3s",
              filter:
                x.get() !== 0 || y.get() !== 0
                  ? "brightness(1.08) saturate(1.1) drop-shadow(0 0 12px #28a74533)"
                  : "none",
            }}
            whileHover={{ scale: 1.08 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 22,
              mass: 1.1,
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const px = (e.clientX - rect.left) / rect.width;
              const py = (e.clientY - rect.top) / rect.height;
             
              x.set((px - 0.5) * 2); 
              y.set(-(py - 0.5) * 2);
            }}
            onMouseLeave={() => {
              x.set(0);
              y.set(0);
            }}
          />
        </div>
        <div className={styles.infoSection}>
          <div className={styles.title}>{title}</div>
          <div className={styles.category}>{category}</div>
          <div className={styles.ratingRow}>
            <Rating value={rate} precision={0.1} size="medium" />
            <span className={styles.ratingValue}>{rate}</span>
            <span className={styles.reviews}>({reviews} reviews)</span>
          </div>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              <PriceFormat value={price} />
            </span>
            <span className={styles.oldPrice}>
              <PriceFormat value={oldPrice} />
            </span>
            <span className={styles.discount}>{discount}</span>
          </div>
          {/* Only show size options for clothing categories */}
          {isClothing && (
            <div className={styles.sizeRow}>
              <span>Choose a size</span>
              {SIZES.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${
                    selectedSize === size ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                  type="button"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
          <div className={styles.actionRow}>
            <button className={styles.buyBtn}>Buy Now</button>
            <button
              className={styles.addBtn}
              onClick={handleAddToCart}
              disabled={added}
              style={
                added
                  ? {
                      background: "#28a745",
                      color: "#fff",
                      cursor: "not-allowed",
                      boxShadow:
                        "0 0 0 2px #218838, 0 4px 16px rgba(40,167,69,0.15)",
                      transition: "background 0.3s, box-shadow 0.3s",
                    }
                  : {}
              }
            >
              <span role="img" aria-label="cart">
                🛒
              </span>{" "}
              {added ? "Added!" : "Add"}
            </button>
          </div>
          <div className={styles.description}>{description}</div>
        </div>
      </div>
      {/* <Footer /> */}
    </Layout>
  );
};

export default ProductDetail;
