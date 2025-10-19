import React, { useState, useEffect, useCallback } from 'react';
import { getMyAssignments } from "../../../api/employee/assignProject";
import Toaster from '../../../components/Toaster';
import { FiInbox, FiXCircle, FiClock } from 'react-icons/fi';
import { formatDate } from '../../../components/atoms/FormatedDate';

const RejectedProjects = () => {
  const [rejectedAssignments, setRejectedAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- Data Fetching ---
  const fetchRejectedProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getMyAssignments();
      if (response.success) {
        // Filter for rejected assignments
        const rejected = (response.assignments || []).filter(
          assignment => assignment.assignmentStatus === 'rejected'
        );
        setRejectedAssignments(rejected);
      } else {
        setToast({ show: true, message: 'Failed to load rejected projects', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: error.message || 'Error fetching data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRejectedProjects();
  }, [fetchRejectedProjects]);

  return (
    <>
      {/* Toast Notifications */}
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}

      <div className="p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-600/20 rounded-lg">
              <FiXCircle className="text-red-400" size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Rejected Projects
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Projects you have declined
              </p>
            </div>
          </div>
        </div>

        {/* Loading / Empty / List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg border border-gray-700 p-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : rejectedAssignments.length === 0 ? (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-10 sm:p-12 flex flex-col items-center justify-center text-center shadow-inner">
            <div className="p-4 bg-red-600/20 rounded-full mb-5 ring-4 ring-red-600/10">
              <FiInbox className="text-red-400" size={40} />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white">No Rejected Projects</h3>
            <p className="mt-2 text-gray-400 text-sm sm:text-base">
              You haven't rejected any project assignments.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rejectedAssignments.map(assignment => (
              <div 
                key={assignment.id} 
                className="bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500/50 transition-all duration-300 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <FiXCircle className="text-red-400" />
                      {assignment.project?.name || 'Unnamed Project'}
                    </h3>
                    <span className="text-sm font-semibold text-red-300 bg-red-600/20 px-2 py-0.5 rounded-full">
                      {assignment.role}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <FiClock size={12} />
                    {assignment.rejectedAt ? formatDate(assignment.rejectedAt) : 'Recently'}
                  </span>
                </div>

                {/* Rejection Reason */}
                {assignment.rejectedReason && (
                  <div className="bg-red-600/10 border border-red-600/30 rounded-md p-4 mb-4">
                    <label className="text-xs text-red-400 uppercase font-semibold">Your Rejection Reason</label>
                    <p className="text-sm text-red-300 mt-1 italic">"{assignment.rejectedReason}"</p>
                  </div>
                )}

                {/* Project Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
                  {assignment.project?.description && (
                    <div>
                      <label className="text-xs text-gray-400 uppercase font-semibold">Project Description</label>
                      <p className="text-gray-300 line-clamp-2">{assignment.project.description}</p>
                    </div>
                  )}
                  {assignment.assigner && (
                    <div>
                      <label className="text-xs text-gray-400 uppercase font-semibold">Was Assigned By</label>
                      <p className="text-gray-300">{assignment.assigner.fullName || assignment.assigner.email}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RejectedProjects;
