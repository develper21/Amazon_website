import React, { useEffect, useState, useMemo } from "react";
import Layout from "../../components/Layout";
// import Footer from "../../components/Footer";
import styles from "./results.module.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import productBaseURL from "../../API/endPoints";
import ProductCard from "../../components/Product/ProductCard";
import Spinner from "../../components/Spinner";

const Results = () => {
  const { categoryName } = useParams([]);
  const [res, setRes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${productBaseURL}/products/category/${categoryName}`)
      .then((res) => setRes(res.data))
      .catch((err) => setRes([]))
      .finally(() => setLoading(false));
  }, [categoryName]);

  const productList = useMemo(
    () =>
      res && res.length > 0 ? (
        res.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))
      ) : (
        <p>No products found in this category.</p>
      ),
    [res]
  );

  return (
    <Layout>
      <div className={styles.resultsWrapper}>
        <h2>
          {categoryName &&
            categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
        </h2>
        {loading ? (
          <Spinner />
        ) : (
          <div className={styles.productsGrid}>{productList}</div>
        )}
      </div>
      {/* <Footer /> */}
    </Layout>
  );
};

export default Results;
