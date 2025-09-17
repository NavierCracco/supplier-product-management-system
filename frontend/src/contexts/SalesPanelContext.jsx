/***
  Business Logic Context: Real-time sales calculations
  Provides instant price calculations and quantity management for sales operations
***/

import { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";

const SalesPanelContext = createContext();

export const SalesPanelProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Smart product addition - handles both new products and quantity updates
  // Business logic: Auto-increment existing products, calculate totals on-the-fly
  const addToSalesPanel = (product) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id);
      if (existingProduct) {
        return prev.map((p) =>
          p.id === product.id
            ? {
                ...p,
                quantity: p.quantity + 1,
                total: (p.quantity + 1) * p.product_price,
              }
            : p
        );
      } else {
        return [
          ...prev,
          { ...product, quantity: 1, total: parseFloat(product.product_price) },
        ];
      }
    });
  };

  const incrementQuantity = (productId) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              quantity: p.quantity + 1,
              total: (p.quantity + 1) * p.product_price,
            }
          : p
      )
    );
  };

  // Smart decrement - auto-removes products when quantity reaches zero
  const decrementQuantity = (productId) => {
    setSelectedProducts((prev) =>
      prev
        .map((p) =>
          p.id === productId && p.quantity > 1
            ? {
                ...p,
                quantity: p.quantity - 1,
                total: (p.quantity - 1) * p.product_price,
              }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              quantity: newQuantity,
              total: newQuantity * p.product_price,
            }
          : p
      )
    );
  };

  const clearSalesPanel = () => {
    setSelectedProducts([]);
  };

  // Real-time calculation - instant total updates without manual refresh
  const totalAmount = selectedProducts.reduce((sum, p) => sum + p.total, 0);

  const removeProduct = (productId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };
  return (
    <SalesPanelContext.Provider
      value={{
        // Data access
        selectedProducts,
        totalAmount,

        // Product management actions
        addToSalesPanel,
        removeProduct,

        // Quantity controls
        incrementQuantity,
        decrementQuantity,
        updateQuantity,

        // Panel management
        clearSalesPanel,
      }}
    >
      {children}
    </SalesPanelContext.Provider>
  );
};

export const useSalesPanelContext = () => useContext(SalesPanelContext);

SalesPanelProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
