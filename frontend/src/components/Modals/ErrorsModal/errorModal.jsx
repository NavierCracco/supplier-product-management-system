import { FaExclamationCircle } from "react-icons/fa";
import PropTypes from "prop-types";
import "animate.css";
import "../../../App.css";

const ErrorNotification = ({ message, onClose }) => {
  return (
    <div
      className="flex items-center justify-center min-h-screen fixed top-0 left-0 right-0 z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      onClick={onClose}
    >
      <div
        className="error-notification bg-red-600 text-white rounded-lg p-6 w-full max-w-lg shadow-lg flex items-center transform transition duration-400 ease-in-out animate-bounce-in"
        role="alert"
        onClick={(e) => e.stopPropagation()}
      >
        <FaExclamationCircle className="text-4xl mr-4" />
        <div>
          <h2 className="font-semibold text-lg">¡Algo salió mal!</h2>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;

ErrorNotification.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
