/***
  Strategic Context Architecture: Centralized product state management
  Handles server-side pagination + client-side instant search for optimal UX
  Single API endpoint approach reduces complexity while maintaining performance
***/

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import config from "../../config/config.js";
import PropTypes from "prop-types";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProveedor, setSelectedProveedor] = useState("");
  const [proveedores, setProveedores] = useState([]);

  const fetchProducts = async (page = 1) => {
    // Core business logic integration with backend ETL pipeline
    setLoading(true);
    try {
      const response = await axios.get(config.products.VITE_API_URL_PRODUCTS, {
        params: {
          page: page,
          search: searchQuery,
          proveedor: selectedProveedor,
        },
      });

      setProductos(response.data.results);
      setFilteredProducts(response.data.results);
      setProveedores(response.data.proveedores);
      setCurrentPage(page);
      setTotalPages(Math.ceil(response.data.count / 20));
      setError(null);
    } catch (err) {
      setError("Error al obtener los productos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProveedor]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, searchQuery, selectedProveedor]);

  const applyFilters = () => {
    // Client-side filtering for instant search feedback
    // startsWith() provides predictable catalog-style search behavior
    let updatedProducts = [...productos];

    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.product_name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(updatedProducts);
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery]);

  return (
    <ProductsContext.Provider
      value={{
        // Data access
        productos,
        filteredProducts,

        // State indicators
        loading,
        error,

        // Search functionality
        searchQuery,
        setSearchQuery,

        // Pagination controls
        currentPage,
        setCurrentPage,
        totalPages,

        // Filtering capabilities
        selectedProveedor,
        setSelectedProveedor,
        proveedores,

        // Actions
        fetchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => useContext(ProductsContext);

ProductsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
