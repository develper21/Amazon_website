import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Utility/firebase";
import { useCart } from "./components/DataProvider/DataProvider";
import { ACTIONS } from "./Utility/actions";
import "./App.css";
import AppRouter from "./Router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { dispatch } = useCart();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch({ type: ACTIONS.SET_USER, payload: user });
    });
    return () => unsubscribe();
  }, [dispatch]);
  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
