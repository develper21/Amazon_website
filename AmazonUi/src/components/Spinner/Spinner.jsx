import React from "react";
import { ClipLoader } from "react-spinners";
import styles from "./Spinner.module.css";

function Spinner() {
  return (
    <div className={styles.spinnerWrapper}>
      <ClipLoader color="#ff9900" size={64} speedMultiplier={0.85} />
    </div>
  );
}

export default Spinner;
