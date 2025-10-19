import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmationDeleteNotification = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        // Backdrop
        <div 
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
            {/* Modal Content */}
            <div
                onClick={(e) => e.stopPropagation()} // Prevent closing modal on content click
                className="relative w-full max-w-md rounded-lg bg-gray-800 border border-gray-700 shadow-xl p-6"
            >
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1.5 rounded-full text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-colors"
                >
                    <FiX size={18} />
                </button>

                <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-red-500/20 text-red-400">
                        <FiAlertTriangle size={24} />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            {message}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700/60 text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:bg-red-800"
                            >
                                {isLoading ? (
                                    "Deleting..."
                                ) : (
                                    confirmText
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDeleteNotification;