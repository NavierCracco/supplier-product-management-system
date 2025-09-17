import "../../App.css";
import { useProductsContext } from "../../contexts/ProductsContext.jsx";
import { useSalesPanelContext } from "../../contexts/SalesPanelContext.jsx";
import { IoIosArrowForward } from "react-icons/io";
import Spinner from "../Spinner/spinner.jsx";
import "animate.css";
import ErrorNotification from "../Modals/ErrorsModal/errorModal.jsx";

const Products = () => {
  const { productos, loading, error } = useProductsContext();
  const { addToSalesPanel } = useSalesPanelContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ErrorNotification message="Ocurrió un error inesperado." />
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-2xl font-semibold text-gray-800">
          No se encontraron productos con ese nombre!
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-start min-h-screen pt-2 px-2 col-span-4 flex-col w-full">
      <div className="overflow-x-auto w-full max-w-7xl">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr className="text-neutral-800 ">
              <th className="px-5 py-3 text-xs font-bold text-left uppercase">
                Código
              </th>
              <th className="px-5 py-3 text-xs font-bold text-left uppercase">
                Producto
              </th>
              <th className="px-5 py-3 text-xs font-bold text-left uppercase">
                Precio
              </th>
              <th className="px-5 py-3 text-xs font-bold text-left uppercase">
                Proveedor
              </th>
              <th className="px-5 py-3 text-xs font-bold text-left uppercase">
                Fecha
              </th>
              <th className="px-5 py-3 text-xs font-bold text-right uppercase"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {productos.map((p, index) => (
              <tr
                className={`text-neutral-800 animate__animated animate__fadeIn`}
                key={p.item}
                style={{ animationDelay: `${index * 0.01}s` }}
              >
                <td className="min-w-28 px-5 py-3 text-xs font-medium">
                  {p.item}
                </td>
                <td className="px-4 py-3 text-xs">{p.product_name}</td>
                <td className="min-w-32 px-5 py-3 text-sm ">
                  {p.formatted_price}
                </td>
                <td className="px-5 py-3 text-sm ">{p.proveedor}</td>
                <td className="min-w-28 px-5 py-3 text-sm">
                  {p.fecha_actualizacion}
                </td>
                <td className="px-5 py-3 text-sm">
                  <button
                    onClick={() => addToSalesPanel(p)}
                    className="text-blue-600 hover:text-blue-700 hover:scale-150 transition ease-in duration-100"
                  >
                    <IoIosArrowForward className="text-xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
