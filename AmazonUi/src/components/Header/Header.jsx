import React, { useState, useEffect, useRef } from "react";
import styles from "./header.module.css";
import { FaSearch, FaBars, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import nav_logo from "../../assets/Images/nav_log.png";
import usa_flag from "../../assets/Images/usa_flag.png";
import { useCart } from "../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase";
import { ACTIONS } from "../../Utility/actions";
import { toast } from "react-toastify";

function Header() {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerState, setHeaderState] = useState("visible"); // 'visible', 'hidden', 'topFixed'
  const [country, setCountry] = useState("");
  const headerRef = useRef(null);
  const { cart, user, dispatch, shippingDetails } = useCart();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const headerHeight = headerRef.current
        ? headerRef.current.offsetHeight
        : 0;

      if (currentScrollY > lastScrollY && currentScrollY > headerHeight) {
        // Scrolling Down and past the header
        if (headerState !== "hidden") setHeaderState("hidden");
      } else if (currentScrollY < lastScrollY && currentScrollY > 0) {
        // Scrolling Up (not at top)
        if (headerState !== "topFixed") setHeaderState("topFixed");
      } else if (currentScrollY === 0) {
        // At the very top
        if (headerState !== "visible") setHeaderState("visible");
      }
      setLastScrollY(currentScrollY <= 0 ? 0 : currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, headerState]);

  useEffect(() => {
    if (!shippingDetails?.country) {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.country_name) {
            setCountry(data.country_name);
          }
        })
        .catch(() => {});
    }
  }, [shippingDetails]);

  const displayCountry = shippingDetails?.country || country || "Country";

  const desktopNavLinks = [
    { name: "All", icon: FaBars },
    "Today's Deals",
    "Customer Service",
    "Registry",
    "Gift Cards",
    "Sell",
  ];

  const secondaryNavLinks = [
    "Video",
    "Deals",
    "Amazon Basics",
    "Best Sellers",
    "Livestreams",
    "Prime",
    "Gift Cards",
    "Buy Again",
    "Customer Service",
    "Home & Kitchen",
    "Electronics",
    "Books",
    "Fashion",
    "Toys & Games",
    "Health & Personal Care",
    "Beauty & Personal Care",
    "Sports & Outdoors",
    "Automotive",
    "Coupons",
    "Gift Ideas",
  ];

  // Sign out handler
  const handleSignOut = async () => {
    await auth.signOut();
    dispatch({ type: ACTIONS.SET_USER, payload: null });
    toast.success("Signed out successfully!");
  };

  return (
    <header
      ref={headerRef}
      className={`
        ${styles.headerWrapper}
        ${headerState === "hidden" ? styles.headerHidden : ""}
        ${headerState === "topFixed" ? styles.headerTopFixed : ""}
      `}
    >
      {/* Top Row */}
      <div className={styles.topRow}>
        <div className={styles.leftSection}>
          <button
            className={`${styles.menuBtn} ${
              isMobile ? "" : styles.hideOnDesktopFlex
            }`}
            onClick={() => setShowMenu(!showMenu)}
          >
            <FaBars />
          </button>
          <Link to="/" className={styles.logoLink}>
            <img src={nav_logo} alt="Amazon Logo" className={styles.logo} />
          </Link>
          {/* DeliverTo for DESKTOP - hidden on mobile via CSS */}
          <Link
            to="/shipping"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className={`${styles.deliverTo} ${styles.deliverToDesktop}`}>
              <FaMapMarkerAlt className={styles.locationIcon} />
              <div className={styles.deliverTextWrap}>
                <span className={styles.deliverLabel}>Deliver to</span>
                <span className={styles.deliverCountry}>{displayCountry}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <form className={styles.searchBar}>
          <select className={styles.searchDropdown} title="Search category">
            <option>All</option>
            <option>Books</option>
            <option>Electronics</option>
            <option>Clothing</option>
          </select>
          <input
            className={styles.searchInput}
            placeholder="Search Amazon"
            aria-label="Search Amazon"
          />
          <button className={styles.searchBtn} type="submit" title="Search">
            <FaSearch />
          </button>
        </form>

        {/* Right: Language, Account, Orders, Cart */}
        <div className={styles.rightSection}>
          <div
            className={`${styles.langWrap} ${styles.hideOnMobile}`}
            onMouseEnter={() => setShowLangDropdown(true)}
            onMouseLeave={() => setShowLangDropdown(false)}
          >
            <img src={usa_flag} alt="EN" className={styles.flag} />
            <span className={styles.langText}>EN</span>
            <FiChevronDown className={styles.chevronIcon} />
            {showLangDropdown && (
              <div className={styles.dropdownMenu}>
                <div>EN - English</div>
                <div>ES - Español</div>
                <div>DE - Deutsch</div>
              </div>
            )}
          </div>
          {/* Account & Lists - Adapts for mobile */}
          <div
            className={styles.accountWrap}
            onMouseEnter={() => setShowAccountDropdown(true)}
            onMouseLeave={() => setShowAccountDropdown(false)}
          >
            <FaUser
              className={`${styles.accountIcon} ${styles.showOnMobile}`}
            />
            {isMobile ? (
              user ? (
                <>
                  <span className={styles.smallText}>
                    Hello,{` `}
                    {user.reloadUserInfo?.displayName ||
                      user.displayName ||
                      (user.email
                        ? user.email.split("@")[0]
                        : user.reloadUserInfo?.email?.split("@")[0])}
                  </span>
                  <span
                    className={styles.boldText}
                    onClick={handleSignOut}
                    style={{ cursor: "pointer" }}
                  >
                    Sign Out
                  </span>
                </>
              ) : (
                <Link
                  to="/auth/signin"
                  className={`${styles.boldText} ${styles.signInMobile}`}
                >
                  Sign In{" "}
                  <FiChevronDown className={styles.chevronIconMobileSignIn} />
                </Link>
              )
            ) : user ? (
              <>
                <span className={styles.smallText}>
                  Hello,{` `}
                  {user.reloadUserInfo?.displayName ||
                    user.displayName ||
                    (user.email
                      ? user.email.split("@")[0]
                      : user.reloadUserInfo?.email?.split("@")[0])}
                </span>
                <span className={styles.boldText}>
                  Account & Lists{" "}
                  <FiChevronDown className={styles.chevronIcon} />
                </span>
              </>
            ) : (
              <>
                <span className={styles.smallText}>Hello, sign in</span>
                <Link to="/auth/signin" className={styles.boldText}>
                  Account & Lists{" "}
                  <FiChevronDown className={styles.chevronIcon} />
                </Link>
              </>
            )}
            {showAccountDropdown && (
              <div className={styles.dropdownMenu}>
                {user ? (
                  <>
                    <Link to="/account">Your Account</Link>
                    <Link to="/orders">Your Orders</Link>
                    <span onClick={handleSignOut} style={{ cursor: "pointer" }}>
                      Sign Out
                    </span>
                  </>
                ) : (
                  <>
                    <Link to="/auth/signin">Sign In</Link>
                    <Link to="/orders">Your Orders</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className={`${styles.ordersWrap} ${styles.hideOnMobile}`}>
            <span className={styles.smallText}>Returns</span>
            <Link to="/orders" className={styles.boldText}>
              & Orders
            </Link>
          </div>
          {/* Cart  */}
          <Link to="/cart" className={styles.cartWrap}>
            <HiOutlineShoppingCart className={styles.cartIcon} />
            <span className={styles.cartCount}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
            <span className={styles.cartText}>Cart</span>
          </Link>
        </div>
      </div>
      {/* Secondary Nav Links (Scrollable on Mobile) */}
      <nav
        className={`
          ${styles.bottomRow}
          ${headerState !== "visible" ? styles.bottomRowHidden : ""}
        `}
      >
        {isMobile
          ? secondaryNavLinks.map((link) => (
              <span key={link} className={styles.navLink}>
                {link}
              </span>
            ))
          : desktopNavLinks.map((link) =>
              typeof link === "string" ? (
                <span key={link} className={styles.navLink}>
                  {link}
                </span>
              ) : (
                <span
                  key={link.name}
                  className={`${styles.navLink} ${styles.navLinkWithIcon}`}
                >
                  <link.icon className={styles.navIcon} />
                  {link.name}
                </span>
              )
            )}
      </nav>

      <div
        className={`
          ${styles.deliverTo}
          ${styles.deliverToMobile}
          ${headerState !== "visible" ? styles.bottomRowHidden : ""} 
        `}
      >
        <Link
          to="/shipping"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className={styles.deliverToMobile}>
            <FaMapMarkerAlt className={styles.locationIcon} />
            <span>Deliver to {displayCountry}</span>
          </div>
        </Link>
      </div>

      {/* Responsive Mobile Menu (triggered by top-left hamburger) */}
      {/* Hamburger Mobile Menu Overlay */}
      <div
        className={`${styles.mobileMenu} ${
          showMenu ? styles.mobileMenuOpen : ""
        }`}
        style={{ pointerEvents: showMenu ? "auto" : "none" }}
      >
        <div className={styles.mobileMenuHeader}>
          <FaUser className={styles.accountIcon} />
          <h3 style={{ flex: 1 }}>
            Hello,{" "}
            {user ? (
              user.displayName || user.email
            ) : (
              <Link to="/auth/signin">Sign In</Link>
            )}
          </h3>
          <button
            className={styles.menuCloseBtn}
            aria-label="Close menu"
            onClick={() => setShowMenu(false)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        <Link
          to="/"
          className={styles.navLink}
          onClick={() => setShowMenu(false)}
        >
          Home
        </Link>
        <span className={styles.navLink}>Shop by Department</span>
        <Link
          to="/results"
          className={styles.navLink}
          onClick={() => setShowMenu(false)}
        >
          Today's Deals
        </Link>
        <div className={styles.mobileMenuItem}>
          <Link
            to="/orders"
            className={styles.navLink}
            onClick={() => setShowMenu(false)}
          >
            Your Orders
          </Link>
        </div>
        <div className={styles.mobileMenuItem}>
          <span className={styles.navLink}>Language: EN</span>
        </div>
        <span className={styles.navLink}>Customer Service</span>
        <span className={styles.navLink}>Settings</span>
        <span
          className={styles.navLink}
          onClick={() => {
            handleSignOut();
            setShowMenu(false);
          }}
          style={{ cursor: "pointer" }}
        >
          Sign Out
        </span>
      </div>
    </header>
  );
}

export default Header;
