import { useState, useEffect } from "react";
import { useETLContext } from "../../contexts/ETLContext.jsx";
import AddExcelFile from "../AddExcelFile/AddExcelFile";
import ETLButton from "../ETLButton/ETLButton.jsx";
import ExcelFileList from "../ExcelFileList/ExcelFileList.jsx";
import FileEditor from "../FileEditor/FileEditor.jsx";
import { MdInfo } from "react-icons/md";
import { Tooltip } from "react-tooltip";

const FileGestionatorPage = () => {
  const { etlLastUpdate } = useETLContext();
  const [filesExist, setFilesExist] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="px-6 pb-6 bg-white rounded-xl">
      <div className="flex justify-between items-center border-b">
        <h1 className="text-3xl font-semibold text-gray-800">
          {isEditing ? "Editar Archivo" : "Gestión de Proveedores"}
        </h1>
        {isEditing ? (
          <div></div>
        ) : (
          <div className="flex items-center space-x-2 pr-3">
            <ETLButton filesExist={filesExist} />
            <div className="flex flex-col items-center">
              <MdInfo
                data-tooltip-id="update-tooltip"
                className="text-white hover:text-gray-100 transition-colors bg-gray-500 rounded-full"
                size={18}
              />
              <Tooltip id="update-tooltip" place="top" effect="solid">
                Última actualización: {etlLastUpdate}
              </Tooltip>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 mt-3">
        {!isEditing ? (
          <>
            <ExcelFileList
              setFilesExist={setFilesExist}
              setIsEditing={setIsEditing}
              setSelectedFile={setSelectedFile}
            />
            <AddExcelFile
              setIsEditing={setIsEditing}
              setSelectedFile={setSelectedFile}
            />
          </>
        ) : (
          <FileEditor file={selectedFile} setIsEditing={setIsEditing} />
        )}
      </div>
    </div>
  );
};

export default FileGestionatorPage;
