import React from "react";
import CategoryCard from "./CategoryCard";
import styles from "./category.module.css";

const categories = [
  {
    title: "Electronics",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=facearea&w=600&q=90",
  },
  {
    title: "Jewelries",
    image:
      "https://images.unsplash.com/photo-1741498413585-707c7ffa5f58?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8SmV3ZWxyaWVzJTIwY2xvdGhpbmd8ZW58MHx8MHx8fDA%3D",
  },
  {
    title: "Men",
    image:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1lbnMlMjBjbG90aGluZ3xlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Women",
    image:
      "https://images.unsplash.com/photo-1643825664857-7e6e4124f289?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29tZW5zJTIwY2xvdGhpbmd8ZW58MHx8MHx8fDA%3D",
  },
];

const Category = () => {
  return (
    <div className={styles.categoryWrapper}>
      {categories.map((cat, idx) => (
        <CategoryCard key={idx} title={cat.title} image={cat.image} />
      ))}
    </div>
  );
};

export default Category;
