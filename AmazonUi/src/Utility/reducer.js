import { ACTIONS } from "./actions";

// Cart reducer for useReducer
export const initialCartState = {
  cart: [],
  user: null,
  shippingDetails: null,
};

export function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART: {
      const exists = state.cart.find((item) => item.id === action.payload.id);
      if (exists) {
        // If item exists, increase quantity
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      // Add new item with quantity 1
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }
    case ACTIONS.REMOVE_FROM_CART: {
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    }
    case ACTIONS.CLEAR_CART: {
      return { ...state, cart: [] };
    }
    case ACTIONS.DECREASE_CART_ITEM: {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    }
    case ACTIONS.INCREASE_CART_ITEM: {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
    case ACTIONS.SET_USER: {
      return {
        ...state,
        user: action.payload,
      };
    }
    case ACTIONS.SET_SHIPPING_DETAILS: {
      // Save to localStorage
      localStorage.setItem("shippingDetails", JSON.stringify(action.payload));
      return {
        ...state,
        shippingDetails: action.payload,
      };
    }
    default:
      return state;
  }
}
