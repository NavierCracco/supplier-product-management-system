import { useState } from "react";
import "../../App.css";
import myLogo from "../../assets/icon-logo.png";
import { useProductsContext } from "../../contexts/ProductsContext.jsx";
import ProductFilter from "../ProductFilter/productFilter.jsx";
import FileGestionatorPage from "../FileGestionatorPage/FileGestionatorPage.jsx";
import { MdOutlineManageSearch } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

const Navbar = () => {
  const [showFileManager, setShowFileManager] = useState(false);
  const { setSearchQuery } = useProductsContext();

  const handleFileManagerToggle = () => {
    setShowFileManager(!showFileManager);
  };

  const handleInputChange = (event) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
  };

  return (
    <div className="bg-slate-50 shadow">
      <div className="w-auto mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex">
          <img src={myLogo} alt="Blynt logo" width={40} />
          <h1 className="text-3xl font-bold text-neutral-800">Blynt</h1>
        </div>
        <div className="flex items-center space-x-6 mr-2">
          <div className="relative">
            <MdOutlineManageSearch className="absolute text-xl left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              onChange={handleInputChange}
              placeholder="Buscar producto..."
              className="w-full p-2 pl-10 pr-4 border border-neutral-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500/50 transition-colors"
            />
          </div>
          <ProductFilter />

          <button
            onClick={handleFileManagerToggle}
            className="bg-blue-500 hover:bg-blue-600 transition-colors text-white font-semibold px-4 py-2 rounded-lg"
          >
            Gestión de proveedores
          </button>
          {showFileManager && (
            <div className="fixed top-0 -left-6 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
              <div className="w-[90%] h-[90%] md:w-3/4 md:h-3/4 p-6 rounded-xl shadow-lg bg-white flex flex-col">
                <button
                  className="flex justify-end mb-4 text-red-600 hover:text-red-800"
                  onClick={handleFileManagerToggle}
                >
                  <RxCross2 size={24} />
                </button>
                <FileGestionatorPage />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
