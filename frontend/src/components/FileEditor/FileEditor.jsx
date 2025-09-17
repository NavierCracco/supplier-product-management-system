import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useFileContext } from "../../contexts/FileContext";
import WarningNotification from "../Modals/WarningsModal/warningsModal.jsx";
import ErrorNotification from "../Modals/ErrorsModal/errorModal.jsx";

const FileEditor = ({ file, setIsEditing }) => {
  const { saveConfig, saveEditing, addFile, fetchFileConfig } =
    useFileContext();

  const [fileName, setFileName] = useState(file.name.split(".")[0]);
  const [columnMapping, setColumnMapping] = useState({
    item: "",
    product_name: "",
    price: "",
  });
  const [startRow, setStartRow] = useState(1);
  const [columnRange, setColumnRange] = useState({ start: "", end: "" });
  const [warningMessage, setWarningMessage] = useState("");

  const getConfig = async () => {
    const fileName = file.name;

    try {
      const configData = await fetchFileConfig(fileName);

      if (!configData) {
        setFileName(file.name.split(".")[0]);
        setColumnMapping({ item: "", product_name: "", price: "" });
        setStartRow(1);
        setColumnRange({ start: "", end: "" });
      }

      if (configData) {
        const configColumnMapping = {
          ...configData.transform_config.column_mappings,
        };

        const columnRange = configData.extract_config.usecols;
        const separateColumnRange = columnRange.split(":");
        setFileName(fileName.split(".")[0]);
        setColumnMapping({
          item: configColumnMapping.item,
          product_name: configColumnMapping.product_name,
          price: configColumnMapping.product_price,
        });
        setStartRow(configData.extract_config.skiprows + 1);
        setColumnRange({
          start: separateColumnRange[0],
          end: separateColumnRange[1],
        });
      }
    } catch (error) {
      console.log(error);
      onClose();
    }
  };

  useEffect(() => {
    getConfig();
  }, []);

  const onClose = () => {
    setFileName("");
    setStartRow(1);
    setColumnRange({ start: "", end: "" });
    setWarningMessage("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (
      !fileName.trim() ||
      !columnMapping.item.trim() ||
      !columnMapping.product_name.trim() ||
      !columnMapping.price.trim() ||
      !startRow ||
      isNaN(startRow) ||
      !columnRange.start.trim() ||
      !columnRange.end.trim()
    ) {
      setWarningMessage("Por favor, completa todos los campos.");
      return;
    }
    setWarningMessage("");

    const extension = file.name.split(".").pop();
    const updatedName = `${fileName}.${extension}`;

    const newConfig = {
      file_name: updatedName,
      columns: columnMapping,
      start_row: startRow,
      column_range: columnRange,
    };

    try {
      await saveConfig(newConfig);

      if (file.id) {
        await saveEditing(file.id, newConfig.file_name);
      } else {
        const newFile = new File([file], updatedName, { type: file.type });
        await addFile(newFile);
      }
      onClose();
    } catch (error) {
      console.error("Error updating file configuration:", error);
      <ErrorNotification
        message="Error al actualizar la configuración. Inténtalo de nuevo."
        onClose={onClose()}
      />;
    }
  };

  return (
    <>
      {warningMessage && (
        <WarningNotification
          message={warningMessage}
          onClose={() => setWarningMessage("")}
        />
      )}
      <div className="p-2 h-auto border-b">
        <label className="block text-gray-700 pb-1 font-semibold">
          Nombre del archivo
        </label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full p-2 border border-gray-300 outline-none text-gray-700  focus:ring-blue-500 transition-all duration-200 ease-in-out rounded-md h-8"
        />

        <div className="flex flex-grow pb-2">
          <div className="w-96">
            <p className="text-gray-700 pt-4 pb-2 font-semibold">
              Nombres de las columnas
            </p>
            <label className="flex items-center mb-2 text-sm text-gray-700 pb-1">
              Código:
              <input
                type="text"
                placeholder="Ej: Código"
                value={columnMapping.item}
                onChange={(e) =>
                  setColumnMapping({ ...columnMapping, item: e.target.value })
                }
                className="w-full ml-2 p-2 border border-gray-300 outline-none text-gray-700  focus:ring-blue-500 transition-all duration-200 ease-in-out rounded-md h-8"
              />
            </label>

            <label className="flex items-center mb-2 text-sm text-gray-700 pb-1">
              Nombre:
              <input
                type="text"
                placeholder="Ej: Nombre"
                value={columnMapping.product_name}
                onChange={(e) =>
                  setColumnMapping({
                    ...columnMapping,
                    product_name: e.target.value,
                  })
                }
                className="ml-2 p-2 w-full border border-gray-300 outline-none text-gray-700  focus:ring-blue-500 transition-all duration-200 ease-in-out rounded-md h-8"
              />
            </label>

            <label className="flex items-center mb-2 text-sm text-gray-700 pb-1">
              Precio:
              <input
                type="text"
                placeholder="Ej: Precio Neto"
                value={columnMapping.price}
                onChange={(e) =>
                  setColumnMapping({ ...columnMapping, price: e.target.value })
                }
                className="w-full ml-2 p-2 border border-gray-300 outline-none text-gray-700  focus:ring-blue-500 transition-all duration-200 ease-in-out rounded-md h-8"
              />
            </label>
          </div>
          <div className="flex flex-col pl-12">
            <p className="text-gray-700 pt-4 pb-2 font-semibold">
              Definir filas y columnas
            </p>
            <div className="mb-4 flex items-center">
              <p className=" text-gray-700 text-sm w-28">Fila de inicio:</p>
              <input
                type="number"
                value={startRow}
                onChange={(e) => setStartRow(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 outline-none text-gray-700  focus:ring-blue-500 transition-all duration-200 ease-in-out rounded-md h-8 ml-2"
                placeholder="Ej: 1"
              />
            </div>

            <div className="mb-4 flex items-center pr-4">
              <p className="text-sm text-gray-700">Rango de columnas:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={columnRange.start}
                  onChange={(e) =>
                    setColumnRange({ ...columnRange, start: e.target.value })
                  }
                  className="w-16 p-2 border border-gray-300 outline-none text-gray-700  focus:ring-blue-500 transition-all duration-200 ease-in-out rounded-md h-8 ml-2"
                  placeholder="Ej: A"
                />
                <span>-</span>
                <input
                  type="text"
                  value={columnRange.end}
                  onChange={(e) =>
                    setColumnRange({ ...columnRange, end: e.target.value })
                  }
                  className="w-16 p-2 border border-gray-300 outline-none text-gray-700  focus:ring-blue-500 transition-all duration-200 ease-in-out rounded-md h-8"
                  placeholder="Ej: D"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mr-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-gray-700 font-semibold"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-semibold"
        >
          Guardar
        </button>
      </div>
    </>
  );
};

FileEditor.propTypes = {
  file: PropTypes.object.isRequired,
  setIsEditing: PropTypes.func.isRequired,
};

export default FileEditor;
