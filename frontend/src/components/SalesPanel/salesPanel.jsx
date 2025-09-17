import "../../App.css";
import { useSalesPanelContext } from "../../contexts/SalesPanelContext.jsx";
import { IoMdTrash } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { formatPrice } from "../../../utils/format.js";

const SalesPanel = () => {
  const {
    selectedProducts,
    totalAmount,
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
    removeProduct,
    clearSalesPanel,
  } = useSalesPanelContext();

  return (
    <div className="flex-grow w-full bg-white shadow-xl rounded-lg p-3">
      <h2 className="text-xl font-semibold text-gray-800 p-4">
        Panel de Ventas
      </h2>
      <div className="text-lg font-medium text-gray-700 pl-4 border-b">
        <span className="block text-sm font-normal text-gray-500">
          Monto Total
        </span>
        <span className="block text-2xl font-semibold text-gray-800 pb-2">
          {formatPrice(totalAmount)}
        </span>
      </div>
      <div className="max-h-60 overflow-y-auto mb-6 divide-y divide-neutral-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 border-b">
        {selectedProducts.map((product) => (
          <div
            key={product.id}
            className="flex justify-between items-center text-sm p-3"
          >
            <span className="text-gray-700 flex-1 pr-1 text-xs">
              {product.product_name}
            </span>{" "}
            <div className="flex items-center space-x-2 gap-x-3">
              <div className="flex flex-col items-center">
                <button
                  onClick={() => incrementQuantity(product.id)}
                  className="w-4 h-5 flex items-center justify-center bg-gray-200 text-gray-600 rounded-t-md shadow hover:bg-gray-300 transition duration-300"
                >
                  <IoMdArrowDropup />
                </button>

                <button
                  onClick={() => decrementQuantity(product.id)}
                  className="w-4 h-5 flex items-center justify-center bg-gray-200 text-gray-600 rounded-b-md shadow hover:bg-gray-300 transition duration-300"
                >
                  <IoMdArrowDropdown />
                </button>
              </div>
              <input
                type="text"
                placeholder="..."
                value={product.quantity}
                onChange={(e) => {
                  const newQuantity = Math.max(
                    "",
                    parseInt(e.target.value) || ""
                  );
                  updateQuantity(product.id, newQuantity);
                }}
                className="w-14 text-center flex-row-reverse border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => removeProduct(product.id)}
                className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition duration-300"
              >
                <IoMdTrash className="text-xl" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={clearSalesPanel}
        className="w-full py-3 bg-green-500 text-white font-semibold rounded-md text-lg hover:bg-green-600 transition-colors"
      >
        Finalizar
      </button>
    </div>
  );
};

export default SalesPanel;
