import React, { useState, useEffect } from "react";
import {
  RiTimeLine,
  RiUserLine,
  RiAttachmentLine,
  RiUserFill,
  RiCloseLine,
  RiSendPlaneFill,
} from "react-icons/ri";
import { toast } from "react-hot-toast";
import { getTicketById, addTicketResponse, updateTicketStatus } from "../../../api/manager/supportTicket";


import {
  TICKET_STATUS_CONFIG,
  PRIORITY_CONFIG,
} from "../../../lib/badgeConfigs";
import Badge from "../../atoms/Badge";

// --- Skeleton Loader Component ---
const TicketDetailsSkeleton = () => (
  <div className="animate-pulse">
    {/* Ticket Header */}
    <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div className="h-8 bg-gray-700/50 rounded-md w-3/5 mb-4 md:mb-0"></div>
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-700/50 rounded-full w-20"></div>
          <div className="h-5 bg-gray-700/50 rounded-full w-20"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div className="h-5 bg-gray-700/50 rounded-md w-40"></div>
        <div className="h-5 bg-gray-700/50 rounded-md w-44"></div>
        <div className="h-5 bg-gray-700/50 rounded-md w-48"></div>
        <div className="h-5 bg-gray-700/50 rounded-md w-48"></div>
      </div>
    </div>
    {/* Ticket Description */}
    <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
      <div className="h-6 bg-gray-700/50 rounded-md w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-700/50 rounded-md w-full mb-2"></div>
      <div className="h-4 bg-gray-700/50 rounded-md w-full mb-2"></div>
      <div className="h-4 bg-gray-700/50 rounded-md w-3/4"></div>
    </div>
    {/* Responses */}
    <div className="bg-gray-800/50 rounded-lg p-8 text-center">
      <div className="h-5 bg-gray-700/50 rounded-md w-1/2 mx-auto"></div>
    </div>
  </div>
);


const TicketDetailsModalformanager = ({ isOpen, onClose, ticketId, onTicketUpdate }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for actions
  const [isAddingResponse, setIsAddingResponse] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && ticketId) {
      fetchTicketDetails();
    }
  }, [isOpen, ticketId]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const data = await getTicketById(ticketId);
      if (data && data.success) {
        setTicket(data.ticket);
      } else {
        throw new Error(data.message || "Failed to load ticket details");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to load ticket details");
      onClose(); // Close modal on error
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) {
      return toast.error("Response cannot be empty.");
    }
    setIsSubmitting(true);
    try {
      const responseData = { message: responseText, attachments: [] };
      const data = await addTicketResponse(ticket.id, responseData);

      if (data.success) {
        setTicket(data.ticket);
        onTicketUpdate();
        toast.success(data.message);
        setResponseText("");
        setIsAddingResponse(false);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to add response");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsSubmitting(true);
    try {
      const data = await updateTicketStatus(ticket.id, { status: newStatus });

      if (data.success) {
        setTicket(data.ticket); // Update modal with new ticket data
        onTicketUpdate(); // Refresh the list in the parent component
        toast.success("Status updated successfully");
        setIsUpdatingStatus(false);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      {/* Modal Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-gray-800 border border-gray-700 rounded-lg shadow-xl flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-xl font-semibold text-white">
            Ticket Details: {loading ? "..." : ticket?.ticketId}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <RiCloseLine size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {loading || !ticket ? (
            <TicketDetailsSkeleton />
          ) : (
            <div>
              {/* Ticket Header Info */}
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">
                    {ticket.subject}
                  </h2>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      value={ticket.priority}
                      configMap={PRIORITY_CONFIG}
                      defaultKey="medium"
                      className="text-xs"
                    />
                    <Badge
                      value={ticket.status}
                      configMap={TICKET_STATUS_CONFIG}
                      defaultKey="open"
                      className="text-sm"
                    />


                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <RiUserLine size={18} />
                    <span>Category: {ticket.category || "N/A"}</span>
                  </div>
                  {ticket.employee && (
                    <div className="flex items-center gap-2 text-gray-400 truncate">
                      <RiUserFill size={18} />
                      <span className="truncate">By: {ticket.employee.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-400">
                    <RiTimeLine size={18} />
                    <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                  {ticket.updatedAt && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <RiTimeLine size={18} />
                      <span>Updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Description */}
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{ticket.description}</p>
                {(ticket.attachments && ticket.attachments.length > 0) && (
                  <div className="mt-6">
                    <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                      <RiAttachmentLine size={18} />
                      Attachments ({ticket.attachments.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ticket.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-4 py-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <RiAttachmentLine className="text-purple-400" size={20} />
                          <span className="text-gray-300 text-sm truncate">{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Responses */}
              {(ticket.response && ticket.response.length > 0) ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Responses ({ticket.response.length})
                  </h3>
                  {ticket.response.map((response, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold capitalize">
                            {response.userName ? response.userName[0] : <RiUserFill />}
                          </div>
                          <div>
                            <p className="text-white font-medium capitalize">
                              {response.userName || "Support Staff"}
                            </p>
                            <p className="text-gray-400 text-sm capitalize">
                              {response.userRole} • {new Date(response.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 whitespace-pre-wrap">{response.message}</p>
                      {/* Response Attachments (if any) */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/10 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No responses yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer (Actions) */}
        {!loading && ticket && (
          <div className="p-4 border-t border-gray-700 flex-shrink-0 bg-gray-800 rounded-b-lg">
            {/* --- Add Response --- */}
            {isAddingResponse ? (
              <form onSubmit={handleResponseSubmit}>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
                  rows="3"
                  disabled={isSubmitting}
                />
                <div className="flex justify-end gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingResponse(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-gray-600 text-gray-300 hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Response"}
                  </button>
                </div>
              </form>
            ) : isUpdatingStatus ? (
              /* --- Update Status --- */
              <div>
                <p className="text-sm text-gray-400 mb-2">Select new status:</p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleStatusUpdate('open')} disabled={isSubmitting} className="px-3 py-1.5 text-sm rounded-md bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 disabled:opacity-50">Open</button>
                  <button onClick={() => handleStatusUpdate('in_progress')} disabled={isSubmitting} className="px-3 py-1.5 text-sm rounded-md bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40 disabled:opacity-50">In Progress</button>
                  <button onClick={() => handleStatusUpdate('resolved')} disabled={isSubmitting} className="px-3 py-1.5 text-sm rounded-md bg-green-500/20 text-green-300 hover:bg-green-500/40 disabled:opacity-50">Resolved</button>
                  <button onClick={() => handleStatusUpdate('closed')} disabled={isSubmitting} className="px-3 py-1.5 text-sm rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/40 disabled:opacity-50">Closed</button>
                  <button onClick={() => setIsUpdatingStatus(false)} disabled={isSubmitting} className="px-3 py-1.5 text-sm rounded-md bg-gray-600 text-gray-300 hover:bg-gray-500">Cancel</button>
                </div>
              </div>
            ) : (
              /* --- Default Buttons --- */
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsUpdatingStatus(true)}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setIsAddingResponse(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                >
                  <RiSendPlaneFill size={16} />
                  Add Response
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetailsModalformanager;