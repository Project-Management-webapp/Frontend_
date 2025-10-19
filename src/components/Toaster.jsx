import React, { useEffect, useState } from "react";

// Spinner
const Spinner = () => (
  <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent mr-2"></div>
);

const SuccessIcon = () => (
  <div className="h-4 w-4 mr-2 flex items-center justify-center bg-white rounded-full animate-scale-fade">
    <svg
      className="h-3 w-3 text-green-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

const ErrorIcon = () => (
  <div className="h-4 w-4 mr-2 flex items-center justify-center bg-white rounded-full animate-scale-fade">
    <svg
      className="h-3 w-3 text-red-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
    </svg>
  </div>
);

const CloseButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="ml-3 text-white hover:text-gray-200 cursor-pointer focus:outline-none flex-shrink-0"
  >
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

const Toaster = ({
  message,
  type = "info",
  loading = false,
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [loading, duration, onClose]);

  if (!visible) return null;

  let bgColor = "bg-gray-700";
  if (type === "success") bgColor = "bg-green-600";
  if (type === "error") bgColor = "bg-red-600";
  if (type === "info") bgColor = "bg-blue-600";

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center ${bgColor} text-white px-4 py-2 rounded-md shadow-lg transition-all duration-300`}
      style={{
        width: "220px", 
        minHeight: "48px",
      }}
    >
      {loading && <Spinner />}
      {!loading && type === "success" && <SuccessIcon />}
      {!loading && type === "error" && <ErrorIcon />}

      <span
        className="flex-1 text-sm leading-tight break-words truncate"
        style={{ whiteSpace: "normal" }}
      >
        {loading ? message || "Processing..." : message}
      </span>

      {!loading && (type === "success" || type === "error") && (
        <CloseButton onClick={() => setVisible(false)} />
      )}
    </div>
  );
};

export default Toaster;
