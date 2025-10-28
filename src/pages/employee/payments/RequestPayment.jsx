import React, { useState, useEffect, useCallback } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-hot-toast";
import { getCompletedProjects } from "../../../api/employee/assignProject"; 
import { requestPayment } from "../../../api/employee/payment";
import { FiInbox, FiClock, FiDollarSign } from "react-icons/fi";
import { formatDate } from "../../../components/atoms/FormatedDate";

// ===================================================================
// 1. Modal Component (Reverted)
// ===================================================================

const RequestPaymentModal = ({ isOpen, onClose, assignment, onSubmit }) => {
  const [requestNotes, setRequestNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Your code already validates this, so we'll make the label "Required"
    if (!requestNotes.trim()) { 
      setError("Please add a note for your request.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // --- FIX 2: Reverted. We only pass assignmentId and requestNotes ---
      await onSubmit(assignment.id, requestNotes);
      toast.success("Payment request submitted successfully!");
      onClose(); // Close modal on success
    } catch (err) {
      toast.error(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[60] p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-md border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Request Payment</h2>
            <p className="text-sm text-gray-400">
              For: {assignment.project.name}
            </p>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute cursor-pointer top-6 right-6 text-gray-400 hover:text-white"
            >
              <IoMdClose size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <label
              htmlFor="requestNotes"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Notes (Required) {/* FIX 3: Changed label to match validation */}
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
              placeholder="e.g., 'Please release payment as we have completed our work'"
              className={`w-full p-2 bg-gray-700/50 border ${
                error ? "border-red-500" : "border-gray-600"
              } rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500`}
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            
            <div className="mt-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
              <p className="text-sm text-gray-300 font-medium">
                Requesting for Assignment ID: {assignment.id}
              </p>
              <p className="text-lg text-white font-bold">
                Amount: ${parseFloat(assignment.allocatedAmount).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-4 p-6 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===================================================================
// 2. Card Component (No changes needed)
// ===================================================================

const ProjectPaymentCard = ({ assignment, onRequestPayment }) => {
  const { project, role, allocatedAmount, workVerifiedAt } = assignment; // Use workVerifiedAt

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
      <div className="p-5">
        <h3 className="text-lg font-bold text-white truncate">
          {project.name}
        </h3>
        <span className="text-sm font-medium text-purple-300 bg-purple-600/20 px-2 py-0.5 rounded-full">
          {role}
        </span>
      </div>
      <div className="p-5 border-t border-b border-gray-700 space-y-3">
        <div className="flex items-center gap-3">
          <FiDollarSign className="text-green-400" size={18} />
          <div>
            <p className="text-xs text-gray-400 uppercase">Amount</p>
            <p className="text-lg font-semibold text-white">
              ${parseFloat(allocatedAmount).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <FiClock className="text-blue-400" size={18} />
          <div>
            <p className="text-xs text-gray-400 uppercase">Work Verified</p>
            <p className="text-sm text-gray-200">
              {formatDate(workVerifiedAt)}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <button
          onClick={() => onRequestPayment(assignment)}
          className="w-full px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
        >
          Request Payment
        </button>
      </div>
    </div>
  );
};

// ===================================================================
// 3. Main Page Component (Refactored)
// ===================================================================

const RequestPayment = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allAssignments, setAllAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // --- Data Fetching ---
  const fetchVerfiedProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getCompletedProjects(); 
      if (response.success) {
        setAllAssignments(response.projects || []);
      } else {
        toast.error("Failed to load projects.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerfiedProjects();
  }, [fetchVerfiedProjects]);

  const verifiedProjects = allAssignments.filter(
    (assign) => assign.workStatus === "verified"
  );

  // --- Handlers ---
  const handleOpenModal = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleCloseModal = () => {
    setSelectedAssignment(null);
  };

  const handleSubmitPaymentRequest = async (assignmentId, requestNotes) => {
    try {
      await requestPayment({
        assignmentId: assignmentId,
        requestNotes: requestNotes,
      });
      fetchVerfiedProjects();
    } catch (error) {
      console.error("handleSubmitPaymentRequest error:", error);
      throw error; 
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg border border-gray-700 p-5 animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-700 rounded w-full mt-4"></div>
            </div>
          ))}
        </div>
      );
    }

    if (verifiedProjects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-800/50 rounded-lg text-gray-400 border border-gray-700">
          <FiInbox size={40} className="mb-4" />
          <h3 className="text-xl font-semibold text-white">
            No Payments to Request
          </h3>
          <p>
            You have no projects for request payments.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {verifiedProjects.map((assignment) => (
          <ProjectPaymentCard
            key={assignment.id}
            assignment={assignment}
            onRequestPayment={handleOpenModal}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Request Payment</h2>
      </div>

      <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-400 text-sm">
          <span className="font-semibold">Note:</span> This page lists projects
          that have been "Verified" by your manager but not yet paid.
        </p>
      </div>

      {renderContent()}

      {/* Render the Modal */}
      <RequestPaymentModal
        isOpen={!!selectedAssignment}
        onClose={handleCloseModal}
        assignment={selectedAssignment}
        onSubmit={handleSubmitPaymentRequest}
      />
    </div>
  );
};

export default RequestPayment;