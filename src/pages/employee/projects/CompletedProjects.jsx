import React, { useState, useEffect, useCallback } from 'react';
import { getCompletedProjects } from "../../../api/employee/assignProject";
import CompletedProjectCard, { CompletedProjectCardSkeleton } from '../../../components/employee/cards/CompletedProjectCard';
import Toaster from '../../../components/Toaster';
import { FiInbox, FiCheckCircle } from 'react-icons/fi';
import CompleteProjectDetailModal from '../../../components/employee/modals/CompleteProjectDetailModal';

const CompletedProjects = () => {
  const [assignments, setAssignments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [totalEarned, setTotalEarned] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // --- Data Fetching ---
  const fetchCompletedProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getCompletedProjects();
      if (response.success) {
        setAssignments(response.projects || []);
        setSummary(response.summary || null);
        setTotalEarned(response.totalEarned || null);
      } else {
        setToast({ show: true, message: 'Failed to load completed projects', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: error.message || 'Error fetching data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompletedProjects();
  }, [fetchCompletedProjects]);

  // --- Handlers ---
  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

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
      

        {/* Loading / Empty / Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, idx) => (
              <CompletedProjectCardSkeleton key={idx} />
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-10 sm:p-12 flex flex-col items-center justify-center text-center shadow-inner">
            <div className="p-4 bg-green-600/20 rounded-full mb-5 ring-4 ring-green-600/10">
              <FiInbox className="text-green-400" size={40} />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white">No Completed Projects Yet</h3>
            <p className="mt-2 text-gray-400 text-sm sm:text-base">
              Your completed and verified projects will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {assignments.map(assignment => (
              <CompletedProjectCard
                key={assignment.id}
                assignment={assignment}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedAssignment && (
        <CompleteProjectDetailModal
          assignment={selectedAssignment}
          onClose={() => setSelectedAssignment(null)}
        />
      )}
    </>
  );
};

export default CompletedProjects;