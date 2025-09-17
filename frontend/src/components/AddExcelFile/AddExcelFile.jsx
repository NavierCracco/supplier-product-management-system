import { useState } from "react";
import { useFileContext } from "../../contexts/FileContext.jsx";
import { toast } from "react-toastify";
import { IoMdAdd } from "react-icons/io";
import PropTypes from "prop-types";

const AddExcelFile = ({ setIsEditing, setSelectedFile }) => {
  const { addFile } = useFileContext();
  const [newFile, setNewFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewFile(file);
      setSelectedFile(file);
      setIsEditing(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newFile) {
      await addFile(newFile);
      toast.success("Archivo subido exitosamente", {
        autoClose: 3000,
        theme: "colored",
      });
      setNewFile(null);
      setIsEditing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center space-x-4 z-30">
        <label
          htmlFor="fileInput"
          className="flex justify-items-center gap-x-1 cursor-pointer p-2 rounded-md font-semibold transition-colors bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-gray-600"
        >
          <IoMdAdd size={24} className=" text-gray-500 hover:text-gray-600" />{" "}
          Agregar archivo
        </label>

        <input
          type="file"
          id="fileInput"
          accept=".xlsx, .xls, .XLS, .XLSX"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </form>
  );
};

export default AddExcelFile;

AddExcelFile.propTypes = {
  setIsEditing: PropTypes.func.isRequired,
  setSelectedFile: PropTypes.func.isRequired,
};
