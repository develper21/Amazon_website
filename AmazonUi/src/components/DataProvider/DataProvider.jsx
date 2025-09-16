import React, {
  createContext,
  useReducer,
  useContext,
  useEffect,
  useState,
} from "react";
import { cartReducer, initialCartState } from "../../Utility/reducer.js";

const CartContext = createContext();

export function CartProvider({ children }) {
  let localCart = initialCartState.cart;
  let localShipping = initialCartState.shippingDetails;
  let localPromo = "";
  let localUser = initialCartState.user;
  try {
    const stored = JSON.parse(localStorage.getItem("cart"));
    if (Array.isArray(stored)) {
      localCart = stored;
    }
    const storedShipping = JSON.parse(localStorage.getItem("shippingDetails"));
    if (storedShipping) {
      localShipping = storedShipping;
    }
    const storedPromo = localStorage.getItem("promoCode");
    if (storedPromo) localPromo = storedPromo;
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) localUser = storedUser;
  } catch (e) {
    localCart = initialCartState.cart;
    localShipping = initialCartState.shippingDetails;
    localPromo = "";
    localUser = initialCartState.user;
  }
  const [state, dispatch] = useReducer(cartReducer, {
    cart: localCart,
    user: localUser,
    shippingDetails: localShipping,
  });
  const [promoCode, setPromoCode] = useState(localPromo);

  // Persist cart, shippingDetails, promoCode, and user to localStorage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);
  useEffect(() => {
    localStorage.setItem(
      "shippingDetails",
      JSON.stringify(state.shippingDetails)
    );
  }, [state.shippingDetails]);
  useEffect(() => {
    if (promoCode) {
      localStorage.setItem("promoCode", promoCode);
    } else {
      localStorage.removeItem("promoCode");
    }
  }, [promoCode]);
  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }
  }, [state.user]);

  // subTotal, discount, totalAmount
  const subTotal = state.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const delivery = 0;
  const tax = subTotal > 0 ? Math.round(subTotal * 0.05 * 100) / 100 : 0;
  let discount = 0;
  if (promoCode && promoCode.trim().toUpperCase() === "TESFAMICHAEL12") {
    discount = Math.round(subTotal * 0.22 * 100) / 100;
  }
  const totalAmount = subTotal + delivery + tax - discount;

  // Helper: Remove cart item
  const removeCartItem = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  // Helper: Update shipping details
  const updateShippingDetails = (details) => {
    dispatch({ type: "SET_SHIPPING_DETAILS", payload: details });
  };

  // Helper: Update cart item quantity (cart page logic)
  const updateCartItem = (id, quantity) => {
    const item = state.cart.find((item) => item.id === id);
    if (!item) return;
    if (quantity > item.quantity) {
      dispatch({ type: "INCREASE_CART_ITEM", payload: id });
    } else if (quantity < item.quantity && item.quantity > 1) {
      dispatch({ type: "DECREASE_CART_ITEM", payload: id });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        dispatch,
        user: state.user,
        shippingDetails: state.shippingDetails,
        subTotal,
        discount,
        totalAmount,
        promoCode,
        setPromoCode,
        removeCartItem,
        updateShippingDetails,
        updateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
