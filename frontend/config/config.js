const config = {
  products: {
    VITE_API_URL_PRODUCTS: import.meta.env.VITE_API_URL_PRODUCTS,
  },
  files: {
    VITE_API_URL_FILES: import.meta.env.VITE_API_URL_FILES,
    VITE_API_URL_FILES_UPLOAD: import.meta.env.VITE_API_URL_FILES_UPLOAD,
    VITE_API_URL_FILES_DELETE: import.meta.env.VITE_API_URL_FILES_DELETE,
    VITE_API_URL_FILES_ADD: import.meta.env.VITE_API_URL_FILES_ADD,
    VITE_API_URL_FILE_CONFIG: import.meta.env.VITE_API_URL_FILE_CONFIG,
    VITE_API_URL_VALIDATE_CONFIG: import.meta.env.VITE_API_URL_VALIDATE_CONFIG,
    VITE_API_URL_FILE_CONFIG_ID: import.meta.env.VITE_API_URL_FILE_CONFIG_ID,
  },
  etl: {
    VITE_API_URL_ETL: import.meta.env.VITE_API_URL_ETL,
    VITE_API_URL_ETL_LAST_UPDATE: import.meta.env.VITE_API_URL_ETL_LAST_UPDATE,
    VITE_API_URL_ETL_STATUS: import.meta.env.VITE_API_URL_ETL_STATUS,
  },
};

export default config;
