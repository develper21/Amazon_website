import React from "react";
import styles from "./category.module.css";
import { Link } from "react-router-dom";

// Map display titles to fakestoreapi category slugs
const getCategorySlug = (title) => {
  switch (title) {
    case "Electronics":
      return "electronics";
    case "Jewelries":
      return "jewelery"; // fakestoreapi uses 'jewelery'
    case "Men":
      return "men's clothing";
    case "Women":
      return "women's clothing";
    default:
      return title.toLowerCase();
  }
};

const CategoryCard = ({ title, image }) => {
  const categorySlug = getCategorySlug(title);
  return (
    <Link to={`/category/${categorySlug}`} className={styles.card}>
      <div className={styles.cardTitle}>{title}</div>
      <img
        src={image}
        alt={title}
        className={styles.cardImage}
        width="300"
        height="200"
        loading="lazy"
      />
      <span className={styles.shopNowLabel}>Shop Now</span>
    </Link>
  );
};

export default CategoryCard;
