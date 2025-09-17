import "../../App.css";
import { useState } from "react";
import { useProductsContext } from "../../contexts/ProductsContext.jsx";
import { IoIosArrowDown } from "react-icons/io";

const ProductFilter = () => {
  const { selectedProveedor, setSelectedProveedor, proveedores } =
    useProductsContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleProveedorChange = (event) => {
    const proveedorValue = event.target.value;
    setSelectedProveedor(proveedorValue);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        className="flex justify-between items-center w-auto min-w-52 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors focus:outline-none font-semibold"
        aria-haspopup="menu"
        aria-expanded={isOpen ? "true" : "false"}
        aria-label="Filtrar por proveedor"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedProveedor || "Filtrar por proveedor"}
        <IoIosArrowDown
          className={`h-5 w-5 ml-2 transition-transform duration-200 transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul
          className={`absolute left-0 top-11 mt-1 z-10 w-48 bg-white border border-neutral-200 rounded-md shadow-lg transition-colors ease-in-out transform ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          role="menu"
          aria-orientation="vertical"
        >
          <li>
            <button
              className="block w-full px-4 py-2 text-sm text-neutral-700 hover:bg-blue-100 text-left"
              onClick={() => {
                setSelectedProveedor("");
                setIsOpen(false);
              }}
            >
              Todos los productos
            </button>
          </li>
          {proveedores.map((proveedor) => (
            <li key={proveedor}>
              <button
                className="block w-full px-4 py-2 text-sm text-neutral-700 hover:bg-blue-100 transition-colors text-left"
                onClick={(e) => {
                  handleProveedorChange(e);
                  setIsOpen(false);
                }}
                value={proveedor}
              >
                {proveedor}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductFilter;
