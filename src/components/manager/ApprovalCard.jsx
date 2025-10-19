import React from 'react';
import PropTypes from 'prop-types';
import { MdEmail } from 'react-icons/md';
import { FaCalendarAlt } from 'react-icons/fa';

const ApprovalCard = ({ email, createdAt, onApprove, onReject, loading }) => {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-300">
            <MdEmail className="text-purple-400" size={18} />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <FaCalendarAlt className="text-purple-400" size={16} />
            <span>Joined: {formattedDate}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onApprove}
            disabled={loading}
            className={`flex-1 py-2 px-4 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 
              ${loading 
                ? 'bg-green-600/50 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'}`}
          >
            Approve
          </button>
          <button
            onClick={onReject}
            disabled={loading}
            className={`flex-1 py-2 px-4 cursor-pointer rounded-md text-sm font-medium transition-all duration-200 
              ${loading 
                ? 'bg-red-600/50 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'}`}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

ApprovalCard.propTypes = {
  email: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

ApprovalCard.defaultProps = {
  loading: false
};

export default ApprovalCard;
