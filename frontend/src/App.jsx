import "./App.css";
import ProductsPage from "./pages/ProductsPage.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ProductsPage />
      <ToastContainer />
    </>
  );
}

export default App;
