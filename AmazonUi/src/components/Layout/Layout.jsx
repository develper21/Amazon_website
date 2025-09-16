import React from "react";
import Header from "../Header";
import Footer from "../Footer"; // Import the Footer component
function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer /> {/* Add the Footer component here */}
    </>
  );
}

export default Layout;
