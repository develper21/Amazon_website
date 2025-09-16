import React, { useState } from "react";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import PriceFormat from "./PriceFormat";
import styles from "./productCard.module.css";
import { useCart } from "../DataProvider/DataProvider";

const ProductCard = ({ product }) => {
  const { id, image, title, category, rating = {}, price } = product;
  const reviews = rating.count || 0;
  const rate = rating.rate || 0;
  const oldPrice = price * 1.7;
  const discount = "60% OFF";
  const displayTitle = title.length > 50 ? title.slice(0, 50) + "..." : title;
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    setAdded(true);
    toast.success("Added to cart!");
    setTimeout(() => setAdded(false), 1200); // Reset after 1.2s
  };

  return (
    <div className={styles.card}>
      <Link to={`/product/${id}`} style={{ textDecoration: "none" }}>
        <div className={styles.imgWrapper}>
          <div className={styles.imgHoverOverlay}></div>
          <img src={image} alt={title} className={styles.img} />
          <button className={styles.viewBtn}>View product</button>
        </div>
      </Link>
      <button
        className={styles.addToCartBtn}
        onClick={handleAddToCart}
        disabled={added}
        style={
          added
            ? { background: "#ccc", color: "#fff", cursor: "not-allowed" }
            : {}
        }
      >
        <span className={styles.cartIcon}>🛒</span>{" "}
        {added ? "Added!" : "Add to cart"}
      </button>
      <div className={styles.info}>
        <h3 className={styles.title}>{displayTitle}</h3>
        <div className={styles.category}>{category}</div>
        <div className={styles.ratingRow}>
          <Rating value={rate} precision={0.1} readOnly size="small" />
          <span className={styles.ratingValue}>{rate}</span>
          <span className={styles.reviewsSmall}>({reviews} reviews)</span>
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
      </div>
    </div>
  );
};

export default ProductCard;
