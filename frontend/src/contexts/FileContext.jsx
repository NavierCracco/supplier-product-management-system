/*** 
  File Management System: Complete CRUD operations for data source files
  Integrates with ETL pipeline - file changes trigger automatic data refresh 
***/

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import config from "../../config/config.js";
import { useProductsContext } from "./ProductsContext.jsx";

const FileContext = createContext();

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [fileConfig, setFileConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const { fetchProducts } = useProductsContext();

  const fetchFiles = async () => {
    try {
      const response = await axios.get(config.files.VITE_API_URL_FILES);

      setFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  // Inline editing pattern - better UX than separate forms
  const startEditing = (id, name) => {
    setEditingId(id);
    setEditingName(name.split(".").slice(0, -1).join("."));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  // File operations automatically refresh product data - maintains data consistency
  const saveEditing = async (id, updatedName) => {
    try {
      const fileToEdit = files.find((f) => f.id === id);
      if (!fileToEdit) {
        return;
      }

      await axios.post(config.files.VITE_API_URL_FILES_UPLOAD, {
        name: updatedName,
        id: id,
      });

      // Cascade refresh - file changes impact product catalog
      await fetchFiles();
      await fetchProducts();
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      console.error("Error updating file name:", error);
    }
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(config.files.VITE_API_URL_FILES_DELETE + filename);

      // Automatic data synchronization after file operations
      await fetchFiles();
      await fetchProducts();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // File upload with FormData - handles multipart/form-data properly
  const addFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(config.files.VITE_API_URL_FILES_ADD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Dynamic configuration system - each file can have custom ETL mappings
  // Enables flexible data source integration without code changes
  const fetchFileConfig = async (fileIdentifier) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.files.VITE_API_URL_FILE_CONFIG_ID}${fileIdentifier}/`
      );

      setFileConfig(response.data.config);
      return response.data.config;
    } catch (error) {
      console.error("Error fetching config:", error);
      setFileConfig(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (newConfig) => {
    try {
      await axios.put(config.files.VITE_API_URL_FILE_CONFIG, newConfig, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      await fetchFileConfig(newConfig.file_name.split(".")[0].toLowerCase());
    } catch (error) {
      console.error("Error saving config:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <FileContext.Provider
      value={{
        // File system management
        files,
        setFiles,
        file,
        setFile,

        // File operations
        handleDelete,
        addFile,

        // Inline editing functionality
        editingId,
        editingName,
        setEditingId,
        setEditingName,
        startEditing,
        cancelEditing,
        saveEditing,

        // Dynamic configuration system
        fetchFileConfig,
        fileConfig,
        saveConfig,
        loading,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => useContext(FileContext);

FileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
