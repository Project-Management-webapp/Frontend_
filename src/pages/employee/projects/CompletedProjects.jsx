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
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-600/20 rounded-lg">
              <FiCheckCircle className="text-green-400" size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Completed Projects
            </h1>
          </div>
          
         
        </div>

        {/* Loading / Empty / Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-[1600px] mx-auto">
            {[...Array(6)].map((_, idx) => (
              <CompletedProjectCardSkeleton key={idx} />
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-12 sm:p-16 flex flex-col items-center justify-center text-center shadow-2xl max-w-2xl mx-auto">
            <div className="p-6 bg-green-600/20 rounded-full mb-6 ring-8 ring-green-600/10">
              <FiInbox className="text-green-400" size={56} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">No Completed Projects Yet</h3>
            <p className="mt-2 text-gray-400 text-base sm:text-lg max-w-md">
              Your completed and verified projects will appear here once you finish your assignments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-[1600px] mx-auto">
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