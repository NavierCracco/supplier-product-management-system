import { useETLContext } from "../../contexts/ETLContext.jsx";
import { GrUpdate } from "react-icons/gr";
import ETLModal from "../Modals/ETLModal/ETLModal.jsx";
import ErrorNotification from "../Modals/ErrorsModal/errorModal.jsx";
import PropTypes from "prop-types";

const ETLButton = ({ filesExist }) => {
  const {
    runETL,
    etlStatus,
    etlProgress,
    showModal,
    etlError,
    showErrorModal,
    setShowErrorModal,
  } = useETLContext();

  const handleETLStart = () => {
    runETL();
  };

  return (
    <div className="flex justify-center items-center">
      <button
        className={`bg-green-500 hover:bg-green-600 transition-colors text-white font-bold m-2 py-2 px-4 rounded ${
          !filesExist ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleETLStart}
        disabled={!filesExist}
      >
        <GrUpdate className="inline mr-2 mb-1" /> Actualizar productos
      </button>

      {showErrorModal ? (
        <ErrorNotification
          message={etlError}
          onClose={() => setShowErrorModal(false)}
        />
      ) : (
        <ETLModal show={showModal} status={etlStatus} progress={etlProgress} />
      )}
    </div>
  );
};

ETLButton.propTypes = {
  filesExist: PropTypes.bool.isRequired,
};

export default ETLButton;
