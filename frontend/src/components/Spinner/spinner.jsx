import "../../App.css";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin-custom"></div>
    </div>
  );
};

export default Spinner;
