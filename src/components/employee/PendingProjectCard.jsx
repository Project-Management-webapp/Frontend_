import React from 'react';
import { FiEye, FiClock } from 'react-icons/fi';
import { formatDate } from '../../components/atoms/FormatedDate'; 

const PendingProjectCard = ({ assignment, onAccept, onReject, onViewDetails }) => {
    const { project, role, allocatedAmount, responseDeadline } = assignment;
    const isExpired = new Date(responseDeadline) < new Date();

    return (
        <div className={`
      bg-gray-800 rounded-lg shadow-lg border 
      ${isExpired ? 'border-red-500/30 opacity-70' : 'border-gray-700 hover:border-purple-500/50'} 
      transition-all duration-300 flex flex-col
    `}>
            
            <div className="p-5 border-b border-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <h3
                        className="text-xl font-bold text-white truncate cursor-pointer hover:underline"
                        onClick={() => onViewDetails(assignment)}
                    >
                        {project.name}
                    </h3>
                    <button
                        onClick={() => onViewDetails(assignment)}
                        className="text-gray-400 hover:text-white"
                        aria-label="View details"
                    >
                        <FiEye />
                    </button>
                </div>
                <span className="text-sm font-semibold text-purple-300 bg-purple-600/20 px-2 py-0.5 rounded-full">
                    {role}
                </span>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-3 flex-grow">
                <div>
                    <label className="text-xs text-gray-400 uppercase font-semibold">Allocated Amount</label>
                    <p className="text-lg font-bold text-green-400">${parseFloat(allocatedAmount).toLocaleString()}</p>
                </div>
                <div>
                    <label className="text-xs text-gray-400 uppercase font-semibold">Response Deadline</label>
                    <p className={`text-sm text-gray-300 flex items-center gap-1.5 ${isExpired ? 'text-red-400' : ''}`}>
                        <FiClock size={14} />
                        {formatDate(responseDeadline)}
                        {isExpired && <span className="font-semibold">(Expired)</span>}
                    </p>
                </div>
            </div>
            
            {/* Card Footer with Actions */}
            <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex gap-3">
                <button
                    onClick={() => onAccept(assignment.id)}
                    disabled={isExpired}
                    className="flex-1 flex justify-center items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Accept
                </button>
                <button
                    onClick={() => onReject(assignment)}
                    disabled={isExpired}
                    className="flex-1 flex justify-center items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    
                   Reject
                </button>
            </div>
        </div>
    );
};

export const PendingProjectCardSkeleton = () => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 flex flex-col animate-pulse">
          
            <div className="p-5 border-b border-gray-700">
                <div className="flex justify-between items-center mb-2">
                    <div className="h-6 bg-gray-700 rounded-md w-3/4"></div>
                    <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                </div>
                <div className="h-5 bg-gray-700 rounded-full w-1/3 mt-2"></div>
            </div>

           
            <div className="p-5 space-y-4 flex-grow">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded-md w-1/2"></div>
                    <div className="h-6 bg-gray-700 rounded-md w-1/3"></div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded-md w-1/2"></div>
                    <div className="h-5 bg-gray-700 rounded-md w-2/3"></div>
                </div>
            </div>

            {/* Skeleton Footer */}
            <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex gap-3">
                <div className="h-10 bg-gray-700 rounded-md flex-1"></div>
                <div className="h-10 bg-gray-700 rounded-md flex-1"></div>
            </div>
        </div>
    );
};

export default PendingProjectCard;