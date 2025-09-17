import "../../App.css";
import { useProductsContext } from "../../contexts/ProductsContext.jsx";
import Spinner from "../Spinner/spinner.jsx";

const Pagination = () => {
  const { currentPage, totalPages, fetchProducts, loading } =
    useProductsContext();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchProducts(newPage);
    }
  };

  if (loading) {
    <div className="flex justify-center items-center min-h-screen">
      <Spinner />
    </div>;
  }

  return (
    <div className="px-4 pb-6">
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className={`transition duration-200 px-4 py-2 text-sm font-semibold border rounded-md ${
            currentPage === 1
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white font-semibold rounded-md text-lg hover:bg-blue-700 transition duration-300"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span className="text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className={`transition duration-200 px-4 py-2 text-sm font-semibold border rounded-md ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white font-semibold rounded-md text-lg hover:bg-blue-700 transition duration-300"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Pagination;
