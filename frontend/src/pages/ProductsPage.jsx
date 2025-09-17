import "../App.css";
import Navbar from "../components/Navbar/navbar.jsx";
import Pagination from "../components/Pagination/pagination.jsx";
import Products from "../components/Products/product.jsx";
import SalesPanel from "../components/SalesPanel/salesPanel.jsx";

const ProductsPage = () => {
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-y-6 gap-x-3 p-4">
        <div className="col-span-4 flex flex-col w-full">
          <Products />
          <Pagination />
        </div>

        <div className="flex flex-col lg:col-span-2 py-4 max-h-[82vh]">
          <SalesPanel />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
