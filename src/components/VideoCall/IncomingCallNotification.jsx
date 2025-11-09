import React from 'react';
import { IoVideocam, IoClose } from 'react-icons/io5';

const IncomingCallNotification = ({ callerName, projectName, onAccept, onDecline }) => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-800 border-2 border-purple-500 rounded-lg shadow-2xl p-4 min-w-[320px] animate-bounce-slow">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
          <IoVideocam size={24} className="text-white animate-pulse" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg mb-1">Incoming Video Call</h3>
          <p className="text-gray-300 text-sm mb-1">
            <span className="font-medium">{callerName}</span> is calling
          </p>
          <p className="text-gray-400 text-xs">{projectName}</p>
        </div>

        <button
          onClick={onDecline}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <IoClose size={24} />
        </button>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onDecline}
          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          Decline
        </button>
        <button
          onClick={onAccept}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
        >
          Accept
        </button>
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(-5px);
          }
          50% {
            transform: translateY(0);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default IncomingCallNotification;
