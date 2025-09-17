import "animate.css";
import "../../../App.css";
import PropTypes from "prop-types";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-100 h-52 flex flex-col justify-between text-center animate-bounce-in">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2">{message}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-600 transition-colors"
          >
            Confirmar
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};
