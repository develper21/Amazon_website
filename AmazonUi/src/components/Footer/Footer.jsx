import React from "react";
import styles from "./footer.module.css";
import nav_logo from "../../assets/Images/nav_log.png";
import usa_flag from "../../assets/Images/usa_flag.png";

const Footer = () => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.disclaimerBar}>
        <span>
          Disclaimer: This website is an independent project created solely for
          educational and demonstration purposes. It is not affiliated with,
          endorsed by, or connected to Amazon in any way.
        </span>
      </div>
      <div className={styles.backToTop} onClick={handleBackToTop}>
        Back to top
      </div>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4>Get to Know Us</h4>
          <ul>
            <li>Careers</li>
            <li>Blog</li>
            <li>About Amazon</li>
            <li>Investor Relations</li>
            <li>Amazon Devices</li>
            <li>Amazon Science</li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Make Money with Us</h4>
          <ul>
            <li>Sell products on Amazon</li>
            <li>Sell on Amazon Business</li>
            <li>Sell apps on Amazon</li>
            <li>Become an Affiliate</li>
            <li>Advertise Your Products</li>
            <li>Self-Publish with Us</li>
            <li>Host an Amazon Hub</li>
            <li className={styles.moreLink}>
              &gt; See More Make Money with Us
            </li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Amazon Payment Products</h4>
          <ul>
            <li>Amazon Business Card</li>
            <li>Shop with Points</li>
            <li>Reload Your Balance</li>
            <li>Amazon Currency Converter</li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Let Us Help You</h4>
          <ul>
            <li>Amazon and COVID-19</li>
            <li>Your Account</li>
            <li>Your Orders</li>
            <li>Shipping Rates & Policies</li>
            <li>Returns & Replacements</li>
            <li>Manage Your Content and Devices</li>
            <li>Help</li>
          </ul>
        </div>
      </div>
      <div className={styles.footerLocaleRow}>
        <img src={nav_logo} alt="Amazon logo" className={styles.footerLogo} />
        <div className={styles.localeOptions}>
          <button className={styles.localeBtn}>English</button>
          <button className={styles.localeBtn}>$ USD - U.S. Dollar</button>
          <button className={styles.localeBtn}>
            <img src={usa_flag} alt="USA" className={styles.flagIcon} /> United
            States
          </button>
        </div>
      </div>
      <div className={styles.footerServicesGrid}>
        <div>
          <div>Amazon Music</div>
          <span>
            Stream millions
            <br />
            of songs
          </span>
        </div>
        <div>
          <div>Amazon Ads</div>
          <span>
            Reach customers
            <br />
            wherever they
            <br />
            spend their time
          </span>
        </div>
        <div>
          <div>6pm</div>
          <span>
            Score deals
            <br />
            on fashion brands
          </span>
        </div>
        <div>
          <div>AbeBooks</div>
          <span>
            Books, art
            <br />& collectibles
          </span>
        </div>
        <div>
          <div>ACX</div>
          <span>
            Audiobook
            <br />
            Publishing
            <br />
            Made Easy
          </span>
        </div>
        <div>
          <div>Sell on Amazon</div>
          <span>
            Start a Selling
            <br />
            Account
          </span>
        </div>
        <div>
          <div>Veeqo</div>
          <span>
            Shipping Software
            <br />
            Inventory
            <br />
            Management
          </span>
        </div>
        <div>
          <div>Amazon Business</div>
          <span>
            Everything For
            <br />
            Your Business
          </span>
        </div>
        <div>
          <div>AmazonGlobal</div>
          <span>
            Ship Orders
            <br />
            Internationally
          </span>
        </div>
        <div>
          <div>Amazon Web Services</div>
          <span>
            Scalable Cloud
            <br />
            Computing
            <br />
            Services
          </span>
        </div>
        <div>
          <div>Audible</div>
          <span>
            Listen to Books &<br />
            Original
            <br />
            Audio
            <br />
            Performances
          </span>
        </div>
        <div>
          <div>Box Office Mojo</div>
          <span>
            Find Movie
            <br />
            Box Office Data
          </span>
        </div>
        <div>
          <div>Goodreads</div>
          <span>
            Book reviews
            <br />& recommendations
          </span>
        </div>
        <div>
          <div>IMDb</div>
          <span>
            Movies, TV
            <br />& Celebrities
          </span>
        </div>
        <div>
          <div>IMDbPro</div>
          <span>
            Get Info
            <br />
            Entertainment
            <br />
            Professionals Need
          </span>
        </div>
        <div>
          <div>Kindle Direct Publishing</div>
          <span>
            Indie Digital &<br />
            Print Publishing
            <br />
            Made Easy
          </span>
        </div>
        <div>
          <div>Prime Video Direct</div>
          <span>
            Video Distribution
            <br />
            Made Easy
          </span>
        </div>
        <div>
          <div>Shopbop</div>
          <span>
            Designer
            <br />
            Fashion Brands
          </span>
        </div>
        <div>
          <div>Woot!</div>
          <span>
            Deals and
            <br />
            Shenanigans
          </span>
        </div>
        <div>
          <div>Zappos</div>
          <span>
            Shoes &<br />
            Clothing
          </span>
        </div>
        <div>
          <div>Ring</div>
          <span>
            Smart Home
            <br />
            Security Systems
          </span>
        </div>
        <div>
          <div>eero WiFi</div>
          <span>
            Stream 4K Video
            <br />
            in Every Room
          </span>
        </div>
        <div>
          <div>Blink</div>
          <span>
            Smart Security
            <br />
            for Every Home
          </span>
        </div>
        <div>
          <div>Neighbors App</div>
          <span>
            Real-Time Crime
            <br />& Safety Alerts
          </span>
        </div>
        <div>
          <div>Amazon Subscription Boxes</div>
          <span>
            Top subscription
            <br />
            boxes – right to
            <br />
            your door
          </span>
        </div>
        <div>
          <div>PillPack</div>
          <span>
            Pharmacy
            <br />
            Simplified
          </span>
        </div>
      </div>
      <div className={styles.footerBottomLinks}>
        <ul>
          <li>Conditions of Use</li>
          <li>Privacy Notice</li>
          <li>Consumer Health Data Privacy Disclosure</li>
          <li>Your Ads Privacy Choices</li>
        </ul>
        <div className={styles.copyright}>
          &copy; 1996-2025, Amazon.com, Inc. or its affiliates
        </div>
      </div>
    </footer>
  );
};

export default Footer;
