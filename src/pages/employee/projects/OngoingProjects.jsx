import React, { useState, useEffect, useCallback } from 'react';
import { getOngoingProjects } from "../../../api/employee/assignProject";
import OngoingProjectCard, { OngoingProjectCardSkeleton } from '../../../components/employee/OngoingProjectCard';
import ChatModal from '../../../components/modals/ChatModal';
import Toaster from '../../../components/Toaster';
import { FiInbox, FiActivity } from 'react-icons/fi';
import ProjectAssignmentDetail from './ProjectAssignmentDetail';

// --- NEW IMPORT ---
// Import the modal you want to use
import SubmitWorkModal from '../../../components/modals/SubmitWorkModal'; 

const OngoingProjects = () => {
  const [assignments, setAssignments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- MODAL AND VIEW STATE ---
  const [selectedAssignment, setSelectedAssignment] = useState(null); // For Details PAGE
  const [submittingAssignment, setSubmittingAssignment] = useState(null); // For Submit Work MODAL
  const [isChatOpen, setIsChatOpen] = useState(false); // For Chat MODAL

  // --- Data Fetching ---
  const fetchOngoingProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getOngoingProjects();
      if (response.success) {
        setAssignments(response.projects || []);
        setSummary(response.summary || null);
      } else {
        setToast({ show: true, message: 'Failed to load projects', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: error.message || 'Error fetching data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOngoingProjects();
  }, [fetchOngoingProjects]);

  // --- Handlers ---
  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment); // This now triggers the detail page
  };

  const handleOpenSubmitModal = (assignment) => {
    setSubmittingAssignment(assignment);
  };
  
  const handleOpenChatModal = () => {
    setIsChatOpen(true);
  };

  const handleSubmitWorkSuccess = () => {
    setToast({ show: true, message: 'Work submitted successfully!', type: 'success' });
    setSubmittingAssignment(null);
    fetchOngoingProjects(); // Refresh the list
    setSelectedAssignment(null); // Go back to the list
  };
  
  const handleBackToList = () => {
    setSelectedAssignment(null);
  };

  // --- Render List Content ---
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
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {/* --- CONDITIONAL VIEW RENDER --- */}
      {selectedAssignment ? (
        // --- 1. DETAIL VIEW ---
        <ProjectAssignmentDetail 
          assignment={selectedAssignment}
          onBack={handleBackToList}
          onOpenChatModal={handleOpenChatModal}
          onOpenSubmitModal={() => handleOpenSubmitModal(selectedAssignment)}
        />
      ) : (
        // --- 2. LIST VIEW ---
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


      {/* --- MODALS (Controlled by this page) --- */}
      {selectedAssignment && isChatOpen && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          assignmentId={selectedAssignment.id} 
        />
      )}

      {/* --- ADDED THIS RENDER BLOCK --- */}
      {submittingAssignment && (
        <SubmitWorkModal
          isOpen={!!submittingAssignment}
          // Pass the full assignment object
          assignment={submittingAssignment} 
          onClose={() => setSubmittingAssignment(null)}
          onSuccess={handleSubmitWorkSuccess}
          // Pass setToast for error handling inside the modal
          setToast={setToast} 
        />
      )}
    </div>
  );
};

export default OngoingProjects;