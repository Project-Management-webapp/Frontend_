import React, { useState, useEffect, useCallback } from 'react';
import { getPendingAssignments, acceptAssignment, rejectAssignment } from "../../../api/employee/assignProject";
import PendingProjectCard, { PendingProjectCardSkeleton } from '../../../components/employee/PendingProjectCard';
import ProjectDetailsModal from '../../../components/modals/ProjectDetailModal'; 
import RejectReasonModal from '../../../components/modals/RejectReasonModal'; 
import Toaster from '../../../components/Toaster';
import { FiInbox } from 'react-icons/fi';

const ProjectRequests = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const [selectedAssignment, setSelectedAssignment] = useState(null); 
  const [rejectingAssignment, setRejectingAssignment] = useState(null); 

  
  const fetchAssignments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getPendingAssignments();
      if (response.success && Array.isArray(response.assignments)) {
        setAssignments(response.assignments);
      } else {
        setToast({ show: true, message: 'Failed to load assignments', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: error.message || 'Error fetching data', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);


  const handleAccept = async (assignmentId) => {
    try {
      await acceptAssignment(assignmentId);
      setToast({ show: true, message: 'Project accepted!', type: 'success' });
      fetchAssignments(); 
    } catch (error) {
      setToast({ show: true, message: error.message || 'Failed to accept', type: 'error' });
    }
  };

  const handleReject = async (reason) => {
    if (!rejectingAssignment || !reason) {
      setToast({ show: true, message: 'Rejection reason is required', type: 'error' });
      return;
    }
    
    try {
      await rejectAssignment(rejectingAssignment.id, reason);
      setToast({ show: true, message: 'Project rejected', type: 'success' });
      setRejectingAssignment(null); 
      fetchAssignments(); 
    } catch (error) {
      setToast({ show: true, message: error.message || 'Failed to reject', type: 'error' });
    }
  };

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleOpenRejectModal = (assignment) => {
    setRejectingAssignment(assignment);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <PendingProjectCardSkeleton key={i} />
          ))}
        </div>
      );
    
    }
    
    if (assignments.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-800 rounded-lg text-gray-400">
          <FiInbox size={40} className="mb-4" />
          <h3 className="text-xl font-semibold text-white">No Pending Requests</h3>
          <p>You're all caught up!</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(assignment => (
          <PendingProjectCard
            key={assignment.id}
            assignment={assignment}
            onAccept={handleAccept}
            onReject={handleOpenRejectModal}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <h1 className="text-3xl font-bold text-white mb-6">Project Requests</h1>
      {renderContent()}

      {selectedAssignment && (
        <ProjectDetailsModal
          project={selectedAssignment.project} 
          onClose={() => setSelectedAssignment(null)}
        />
      )}

      {rejectingAssignment && (
        <RejectReasonModal
          isOpen={!!rejectingAssignment}
          onClose={() => setRejectingAssignment(null)}
          onSubmit={handleReject}
        />
      )}
    </div>
  );
};

export default ProjectRequests;