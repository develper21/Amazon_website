import React from "react";
import styles from "./account.module.css";
import { useCart } from "../../components/DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";
import { ACTIONS } from "../../Utility/actions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaRegCalendarAlt,
  FaGlobe,
  FaEnvelope,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Layout from "../../components/Layout";

const Account = () => {
  const { user, dispatch } = useCart();
  const navigate = useNavigate();

  const displayName =
    user?.reloadUserInfo?.displayName || user?.displayName || "-";
  const email = user?.email || user?.reloadUserInfo?.email || "-";

  const dateOfBirth = user?.dateOfBirth || "-";
  const countryRegion = user?.countryRegion || "-";
  const language = user?.language || "English (US)";

  const handleSignOut = async () => {
    await auth.signOut();
    dispatch({ type: ACTIONS.SET_USER, payload: null });
    toast.success("Signed out successfully!");
    navigate("/");
  };

  return (
    <Layout>
      <div className={styles.accountPageWrapper}>
        <div className={styles.accountHeaderRow}>
          <h2 className={styles.accountTitle}>{displayName} Account</h2>
          <button className={styles.signOutBtn} onClick={handleSignOut}>
            Sign out
          </button>
        </div>
        <div className={styles.accountMainGrid}>
          {/* Sidebar */}
          <aside className={styles.accountSidebar}>
            <div className={styles.avatarWrap}>
              <FaUserCircle className={styles.avatarIcon} />
              <div className={styles.userName}>{displayName}</div>
              <div className={styles.userEmail}>{email}</div>
            </div>
            <nav className={styles.accountNav}>
              <ul>
                <li className={styles.active}>Personal information</li>
                <li>Billing & Payments</li>
                <li>Order History</li>
                <li>Gift Cards</li>
              </ul>
            </nav>
          </aside>
          {/* Main Content */}
          <section className={styles.accountContent}>
            <h3 className={styles.sectionTitle}>Personal information</h3>
            <p className={styles.sectionDesc}>
              Manage your personal information , including phone numbers and
              email address where you can be contacted
            </p>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>
                  Name <FaUser className={styles.infoIcon} />
                </div>
                <div className={styles.infoValue}>{displayName}</div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>
                  Date of Birth <FaRegCalendarAlt className={styles.infoIcon} />
                </div>
                <div className={styles.infoValue}>{dateOfBirth}</div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>
                  Country Region <FaMapMarkerAlt className={styles.infoIcon} />
                </div>
                <div className={styles.infoValue}>{countryRegion}</div>
              </div>
              <div className={styles.infoCard}>
                <div className={styles.infoLabel}>
                  Language <FaGlobe className={styles.infoIcon} />
                </div>
                <div className={styles.infoValue}>{language}</div>
              </div>
              <div className={styles.infoCardFull}>
                <div className={styles.infoLabel}>
                  Contactable at <FaEnvelope className={styles.infoIcon} />
                </div>
                <div className={styles.infoValue}>{email}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
