// utils/Spinner.jsx
const Spinner = ({ size = "5", color = "white" }) => {
  return (
    <div className={`animate-spin rounded-full border-4 border-t-${color}-500 border-r-${color}-500 border-b-transparent border-l-transparent w-${size} h-${size}`}></div>
  );
};

export default Spinner;
