import { useEffect, useState } from "react";
import { useFileContext } from "../../contexts/FileContext.jsx";
import { MdOutlineInsertDriveFile, MdEdit } from "react-icons/md";
import { FaRegTrashCan } from "react-icons/fa6";
import { toast } from "react-toastify";
import ConfirmationModal from "../Modals/ConfirmationModal/confirmationModal.jsx";
import PropTypes from "prop-types";

const ExcelFileList = ({ setFilesExist, setIsEditing, setSelectedFile }) => {
  const { files, handleDelete } = useFileContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);

  const openModal = (action, fileId) => {
    setModalAction(action);
    setSelectedFileId(fileId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalAction(null);
    setSelectedFileId(null);
  };

  const confirmAction = () => {
    if (modalAction === "delete") {
      handleDelete(selectedFileId);
      toast.success("Archivo eliminado exitosamente", {
        autoClose: 2000,
        theme: "colored",
      });
    }
    closeModal();
  };

  useEffect(() => {
    setFilesExist(files.length > 0);
  }, [files, setFilesExist]);

  return (
    <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 border-b">
      {files.length === 0 ? (
        <p className="text-gray-500">No hay archivos disponibles.</p>
      ) : (
        <ul className="space-y-3 mb-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between border border-gray-200 p-3 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-grow">
                <MdOutlineInsertDriveFile
                  className="text-green-500"
                  size={24}
                />
                <span className="text-gray-800">{file.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedFile(file);
                    setIsEditing(true);
                  }}
                  className="px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition text-sm"
                >
                  <MdEdit size={20} />
                </button>
                <button
                  onClick={() => openModal("delete", file.id)}
                  className="px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600 transition text-sm"
                >
                  <FaRegTrashCan size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        title={modalAction === "delete" ? "¿Eliminar archivo?" : ""}
        message={
          modalAction === "delete" ? "Esta acción no se puede deshacer." : ""
        }
      />
    </div>
  );
};

export default ExcelFileList;

ExcelFileList.propTypes = {
  setFilesExist: PropTypes.func.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  setSelectedFile: PropTypes.func.isRequired,
};
