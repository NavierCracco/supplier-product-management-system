/***
  ETL Pipeline Integration: Real-time data processing orchestration from frontend
  Manages async ETL operations with live progress tracking and error handling 
***/

import { createContext, useContext, useEffect, useState } from "react";
import { useProductsContext } from "./ProductsContext.jsx";
import axios from "axios";
import PropTypes from "prop-types";
import config from "../../config/config.js";

const ETLContext = createContext();

export const ETLProvider = ({ children }) => {
  const [etlRunning, setEtlRunning] = useState(false);
  const [etlStatus, setEtlStatus] = useState("No iniciado");
  const [etlProgress, setEtlProgress] = useState(0);
  const [etlLastUpdate, setEtlLastUpdate] = useState(null);
  const [etlError, setEtlError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { fetchProducts } = useProductsContext();

  useEffect(() => {
    fetchLastUpdate();
  }, []);

  const fetchLastUpdate = async () => {
    try {
      const response = await axios.get(config.etl.VITE_API_URL_ETL_LAST_UPDATE);

      setEtlLastUpdate(response.data.last_update);
    } catch (error) {
      console.error(
        "Error al obtener la última fecha de actualización:",
        error
      );
    }
  };

  // ETL Pipeline Trigger - initiates backend data processing workflow
  // Handles async operations with comprehensive error handling
  const runETL = async () => {
    setEtlRunning(true);
    setEtlStatus("Ejecutando...");
    setEtlProgress(0);
    setShowModal(true);
    setEtlError("");

    try {
      await axios.post(config.etl.VITE_API_URL_ETL, {
        headers: { "Content-Type": "application/json" },
      });

      // Start real-time status polling after successful trigger
      pollETLStatus();
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : error.message || "Error desconocido durante el ETL.";
      setEtlError(errorMessage);
      setShowErrorModal(true);
      setShowModal(false);
      setEtlRunning(false);
      setEtlProgress(0);
    }
  };

  const getETLStatus = async () => {
    try {
      const response = await axios.get(config.etl.VITE_API_URL_ETL_STATUS);

      setEtlStatus(response.data.status);
      setEtlProgress(response.data.progress);
      return response.data;
    } catch (error) {
      console.error("Error al obtener el estado del ETL:", error);
    }
  };

  // Real-time ETL monitoring - polling strategy for long-running processes
  // Auto-refreshes product data upon completion for seamless user experience
  const pollETLStatus = () => {
    const interval = setInterval(async () => {
      const data = await getETLStatus();

      if (data?.status === "Finalizado" || data?.status === "Error") {
        fetchProducts();
        fetchLastUpdate();
        clearInterval(interval);
        setTimeout(() => setShowModal(false), 1000);
      }
    }, 2000);
  };

  return (
    <ETLContext.Provider
      value={{
        // ETL execution control
        runETL,

        // Process monitoring
        etlRunning,
        etlStatus,
        etlProgress,
        etlLastUpdate,

        // Error handling
        etlError,
        showErrorModal,
        setShowErrorModal,

        // UI state management
        showModal,
        setShowModal,
      }}
    >
      {children}
    </ETLContext.Provider>
  );
};

export const useETLContext = () => useContext(ETLContext);

ETLProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
