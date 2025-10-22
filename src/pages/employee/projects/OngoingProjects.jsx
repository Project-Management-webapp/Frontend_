import React, { useState, useEffect, useCallback } from 'react';
import { getOngoingProjects, submitWork } from "../../../api/employee/assignProject"; // Added submitWork
import OngoingProjectCard, { OngoingProjectCardSkeleton } from '../../../components/employee/cards/OngoingProjectCard';
import ChatModal from '../../../components/modals/ChatModal';
import Toaster from '../../../components/Toaster';
import { FiInbox, FiActivity } from 'react-icons/fi';
import ProjectAssignmentDetail from './ProjectAssignmentDetail';

const OngoingProjects = () => {
  const [assignments, setAssignments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success', loading: false }); // Added loading to toast state
  const [selectedAssignment, setSelectedAssignment] = useState(null); 
  const [isChatOpen, setIsChatOpen] = useState(false); 

  const fetchOngoingProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getOngoingProjects();
      if (response.success) {
        setAssignments(response.projects || []);
        setSummary(response.summary || null);
      } else {
        setToast({ show: true, message: 'Failed to load projects', type: 'error', loading: false });
      }
    } catch (error) {
      setToast({ show: true, message: error.message || 'Error fetching data', type: 'error', loading: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOngoingProjects();
  }, [fetchOngoingProjects]);

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  // Removed handleOpenSubmitModal

  const handleOpenChatModal = () => {
    setIsChatOpen(true);
  };
  
  const handleBackToList = () => {
    setSelectedAssignment(null);
  };

  // --- New Handler for Finishing Work ---
  const handleFinishWork = async (assignmentId) => {
    // Show loading toast
    setToast({ show: true, message: 'Submitting your work...', type: 'loading', loading: true });
    try {
      const response = await submitWork(assignmentId);
      
      if (response.success) {
        setToast({ show: true, message: 'Work submitted successfully!', type: 'success', loading: false });
        fetchOngoingProjects(); 
        handleBackToList();     
      } else {
        
        throw new Error(response.message || 'Failed to submit work.');
      }
    } catch (error) {
     
      setToast({ show: true, message: error.message || 'An error occurred.', type: 'error', loading: false });
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <OngoingProjectCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (assignments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-800 rounded-lg text-gray-400">
          <FiInbox size={40} className="mb-4" />
          <h3 className="text-xl font-semibold text-white">No Ongoing Projects</h3>
          <p>You have no active projects at the moment.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(assignment => (
          <OngoingProjectCard
            key={assignment.id}
            assignment={assignment}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          loading={toast.loading} 
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {selectedAssignment ? (
        <ProjectAssignmentDetail 
          assignment={selectedAssignment}
          onBack={handleBackToList}
          onOpenChatModal={handleOpenChatModal}
          onFinishWork={() => handleFinishWork(selectedAssignment.id)} 
        />
      ) : (
      
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-white">Ongoing Projects</h1>
            {summary && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg">
                <FiActivity className="text-purple-400" />
                <span className="text-white font-semibold">{summary.totalOngoing || 0}</span>
                <span className="text-gray-400">Active</span>
              </div>
            )}
          </div>
          {renderContent()}
        </>
      )}


      {selectedAssignment && isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          assignmentId={selectedAssignment.id} 
        />
      )}

     
    </div>
  );
};

export default OngoingProjects;