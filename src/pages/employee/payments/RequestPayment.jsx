import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import Toaster from "../../../components/Toaster";
import { getCompletedProjects } from "../../../api/employee/assignProject"; 
import { requestPayment } from "../../../api/employee/payment";
import { FiInbox, FiClock, FiDollarSign, FiUser } from "react-icons/fi";
import { formatDate } from "../../../components/atoms/FormatedDate";
import {getMyPayments} from "../../../api/employee/payment"
// Payment Request Modal Component
const RequestPaymentModal = ({ isOpen, onClose, assignment, onSubmit, setToast }) => {
  const [requestNotes, setRequestNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!requestNotes.trim()) { 
      setError("Please add a note for your request.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmit(assignment.id, requestNotes);
      setToast({ show: true, message: "Payment request submitted successfully!", type: "success" });
      setRequestNotes("");
      onClose();
    } catch (err) {
      setToast({ show: true, message: err.message || "Failed to submit request.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !assignment) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4" onClick={onClose}>
      <div className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-md border border-white/20" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="relative p-6 pb-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Request Payment</h2>
            <p className="text-sm text-gray-400">For: {assignment.project.name}</p>
            <button type="button" onClick={onClose} disabled={isSubmitting} className="absolute cursor-pointer top-6 right-6 text-gray-400 hover:text-white">
              <IoMdClose size={24} />
            </button>
          </div>
          <div className="p-6">
            <label htmlFor="requestNotes" className="block text-sm font-medium text-gray-300 mb-2">
              Notes <span className="text-red-400">*</span>
            </label>
            <textarea 
              id="requestNotes" 
              name="requestNotes" 
              rows={4} 
              value={requestNotes} 
              onChange={(e) => { 
                setRequestNotes(e.target.value); 
                if (error) setError(""); 
              }} 
              placeholder="e.g., Work has been submitted and completed as per requirements. Please process payment." 
              className={`w-full p-2 bg-gray-700/50 border rounded-md focus:ring-2 focus:ring-purple-500 ${error ? "border-red-500" : "border-gray-600"}`} 
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-300 font-medium mb-2">Assignment ID: {assignment.id}</p>
              <p className="text-sm text-gray-300 mb-1">Role: <span className="text-purple-400">{assignment.role}</span></p>
              <p className="text-lg text-white font-bold">Amount: ${parseFloat(assignment.allocatedAmount).toLocaleString()} {assignment.currency}</p>
            </div>
          </div>
          <div className="flex justify-end space-x-4 p-6 pt-4 border-t border-gray-700">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn">
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Project Payment Card Component
const ProjectPaymentCard = ({ assignment, onRequestPayment, paymentStatus }) => {
  const { project, role, allocatedAmount, currency, workSubmittedAt, assigner } = assignment;
  
  const isRequested = paymentStatus === "requested";
  const isApproved = paymentStatus === "approved";

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-gray-700">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-white line-clamp-1 flex-1">{project.name}</h3>
          {isRequested && (
            <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-orange-600/20 text-orange-400">
              Requested
            </span>
          )}
          {isApproved && (
            <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-400">
              Approved
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-purple-300 bg-purple-600/30 px-3 py-1 rounded-full">{role}</span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <FiDollarSign className="text-green-400 mt-1" size={20} />
          <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase mb-1">Allocated Amount</p>
            <p className="text-2xl font-bold text-green-400">
              ${parseFloat(allocatedAmount).toLocaleString()} <span className="text-sm text-gray-400">{currency}</span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FiClock className="text-blue-400 mt-1" size={18} />
          <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase mb-1">Work Submitted</p>
            <p className="text-sm text-gray-200">{formatDate(workSubmittedAt)}</p>
          </div>
        </div>

        {assigner && (
          <div className="flex items-start gap-3">
            <FiUser className="text-yellow-400 mt-1" size={18} />
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase mb-1">Assigned By</p>
              <p className="text-sm text-gray-200">{assigner.fullName}</p>
              <p className="text-xs text-gray-500">{assigner.email}</p>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-400 uppercase mb-1">Project Status</p>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
              project.status === 'in_progress' ? 'bg-blue-600/20 text-blue-400' :
              'bg-gray-600/20 text-gray-400'
            }`}>
              {project.status || 'N/A'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.priority === 'high' ? 'bg-red-600/20 text-red-400' :
              project.priority === 'medium' ? 'bg-orange-600/20 text-orange-400' :
              'bg-green-600/20 text-green-400'
            }`}>
              {project.priority || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer with Request Payment Button */}
      <div className="p-4 bg-gray-900/50 border-t border-gray-700">
        {isRequested ? (
          <button 
            disabled
            className="w-full px-6 py-3 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed font-semibold"
          >
            Payment Requested
          </button>
        ) : isApproved ? (
          <button 
            disabled
            className="w-full px-6 py-3 bg-green-600/50 text-green-300 rounded-lg cursor-not-allowed font-semibold"
          >
            Payment Approved
          </button>
        ) : (
          <button 
            onClick={() => onRequestPayment(assignment)} 
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            Request Payment
          </button>
        )}
      </div>
    </div>
  );
};

// Main Request Payment Component
const RequestPayment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allAssignments, setAllAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [myPayments, setMyPayments] = useState([]);

  // Fetch my payments
  const fetchMyPayments = async () => {
    try {
      const response = await getMyPayments();
      console.log("My payments response:", response);
      
      if (response.success) {
        setMyPayments(response.data.payments || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  // Fetch completed projects from API
  const fetchCompletedProjects = async () => {
    setIsLoading(true);
    try {
      const response = await getCompletedProjects(); 
      console.log("Completed projects response:", response);
      
      if (response.success) {
        setAllAssignments(response.projects || []);
      } else {
        setToast({ show: true, message: response.message || "Failed to load projects.", type: "error" });
      }
    } catch (error) {
      console.error("Error fetching completed projects:", error);
      setToast({ show: true, message: error.message || "Failed to fetch projects.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPayments();
    fetchCompletedProjects();
  }, []);

  // Filter projects with workStatus "submitted" and exclude paid/rejected/cancelled projects
  const submittedProjects = allAssignments.filter((assign) => {
    // Check if workStatus is submitted
    if (assign.workStatus !== "submitted") return false;
    
    // Find payment for this assignment
    const payment = myPayments.find(p => p.assignmentId === assign.id);
    
    // Exclude if payment status is "paid", "rejected", or status is "cancelled"
    if (payment && (
      payment.requestStatus === "paid" || 
      payment.requestStatus === "rejected" || 
      payment.status === "cancelled"
    )) {
      return false;
    }
    
    return true;
  });

  // Helper function to check if assignment has requested payment
  const getPaymentStatus = (assignmentId) => {
    const payment = myPayments.find(p => p.assignmentId === assignmentId);
    if (!payment) return null;
    return payment.requestStatus; // 'requested', 'paid', etc.
  };

  const handleOpenModal = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleCloseModal = () => {
    setSelectedAssignment(null);
  };

  // Handle payment request submission
  const handleSubmitPaymentRequest = async (assignmentId, requestNotes) => {
    try {
      const response = await requestPayment({
        assignmentId: assignmentId,
        requestNotes: requestNotes,
      });
      
      if (response.success) {
        setToast({ show: true, message: "Payment request submitted successfully!", type: "success" });  
        await fetchMyPayments(); // Refresh payments
        await fetchCompletedProjects(); // Refresh projects
      }
    } catch (error) {
      console.error("Payment request error:", error);
      throw error; 
    }
  };

  // Render content based on loading state and data
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg border border-gray-700 p-5 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
              <div className="h-10 bg-gray-700 rounded w-full mt-4"></div>
            </div>
          ))}
        </div>
      );
    }

    if (submittedProjects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-gray-800/50 rounded-lg text-gray-400 border border-gray-700">
          <FiInbox size={48} className="mb-4 text-gray-500" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Submitted Projects
          </h3>
          <p className="text-center text-gray-400">
            You have no submitted projects waiting for payment request.
          </p>
          <p className="text-center text-gray-500 text-sm mt-2">
            Projects will appear here once you submit your work and they are pending approval.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submittedProjects.map((assignment) => {
          const paymentStatus = getPaymentStatus(assignment.id);
          return (
            <ProjectPaymentCard
              key={assignment.id}
              assignment={assignment}
              onRequestPayment={handleOpenModal}
              paymentStatus={paymentStatus}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Request Payment</h2>
        <p className="text-gray-400">Submit payment requests for your completed work</p>
      </div>

      {/* Summary Statistics */}
      {!isLoading && submittedProjects.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-lg p-4 border border-purple-500/30">
            <p className="text-sm text-gray-400 mb-1">Total Projects</p>
            <p className="text-2xl font-bold text-white">{submittedProjects.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-lg p-4 border border-green-500/30">
            <p className="text-sm text-gray-400 mb-1">Total Amount</p>
            <p className="text-2xl font-bold text-white">
              ${submittedProjects.reduce((sum, a) => sum + parseFloat(a.allocatedAmount), 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-lg p-4 border border-blue-500/30">
            <p className="text-sm text-gray-400 mb-1">Average per Project</p>
            <p className="text-2xl font-bold text-white">
              ${(submittedProjects.reduce((sum, a) => sum + parseFloat(a.allocatedAmount), 0) / submittedProjects.length).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Content - Project Cards */}
      {renderContent()}

      {/* Payment Request Modal */}
      <RequestPaymentModal
        isOpen={!!selectedAssignment}
        onClose={handleCloseModal}
        assignment={selectedAssignment}
        onSubmit={handleSubmitPaymentRequest}
        setToast={setToast}
      />
  
      {toast.show && (
        <div className="fixed top-6 right-6 z-[100]">
          <Toaster
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        </div>
      )}
    </div>
  );
};

export default RequestPayment;
