import "animate.css";
import Spinner from "../../Spinner/spinner.jsx";
import PropTypes from "prop-types";

const ETLModal = ({ show, status, progress }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center animate__animated animate__bounceIn">
        <h2 className="text-xl font-semibold text-gray-900">
          Actualizando productos
        </h2>
        <p className="text-gray-600 my-4">
          Este proceso puede tardar unos segundos...
        </p>

        <Spinner />

        <p className="text-sm text-gray-500 mt-4">
          {status} - Progreso: {progress}%
        </p>
      </div>
    </div>
  );
};

export default ETLModal;

ETLModal.propTypes = {
  show: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
};
