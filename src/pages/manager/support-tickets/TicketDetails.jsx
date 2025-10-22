import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RiArrowLeftLine,
  RiTimeLine,
  RiUserLine,
  RiAttachmentLine,
  RiSendPlane2Line,
  RiUploadCloudLine,
  RiDeleteBin6Line,
} from "react-icons/ri";
import { toast } from "react-hot-toast";
import { getTicketById, addTicketResponse, updateTicketStatus } from "../../../api/manager/supportTicket";
import TicketStatusBadge from "../../../components/atoms/TicketStatusBadge";
import PriorityBadge from "../../../components/atoms/PriorityBadge";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responseText, setResponseText] = useState("");
  const [responseAttachments, setResponseAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const data = await getTicketById(id);
      setTicket(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to load ticket details");
      // navigate("/manager/support-tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (responseAttachments.length + files.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }
    setResponseAttachments((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setResponseAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      setSubmitting(true);
      await addTicketResponse(id, {
        response: responseText,
        attachments: responseAttachments,
      });
      toast.success("Response added successfully!");
      setResponseText("");
      setResponseAttachments([]);
      fetchTicketDetails();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to add response");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await updateTicketStatus(id, { status: newStatus });
      toast.success(`Ticket status updated to ${newStatus}`);
      fetchTicketDetails();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <button
        onClick={() => navigate("/manager/support-tickets")}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <RiArrowLeftLine size={20} />
        Back to Tickets
      </button>

      {/* Ticket Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold text-white mb-2">{ticket.subject}</h2>
            <p className="text-gray-400">
              Submitted by: {ticket.Employee?.firstName} {ticket.Employee?.lastName} ({ticket.Employee?.email})
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={ticket.priority} />
            <TicketStatusBadge status={ticket.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2 text-gray-400">
            <RiUserLine size={18} />
            <span>Category: {ticket.category}</span>
          </div>
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

        {/* Status Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
          <button
            onClick={() => handleStatusChange("in-progress")}
            disabled={updatingStatus || ticket.status === "in-progress"}
            className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Mark In Progress
          </button>
          <button
            onClick={() => handleStatusChange("resolved")}
            disabled={updatingStatus || ticket.status === "resolved"}
            className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Mark Resolved
          </button>
          <button
            onClick={() => handleStatusChange("closed")}
            disabled={updatingStatus || ticket.status === "closed"}
            className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Close Ticket
          </button>
        </div>
      </div>

      {/* Ticket Description */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
        <p className="text-gray-300 whitespace-pre-wrap">{ticket.description}</p>

        {/* Attachments */}
  {(ticket.attachments && Array.isArray(ticket.attachments) && ticket.attachments.length > 0) && (
          <div className="mt-6">
            <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
              <RiAttachmentLine size={18} />
              Attachments ({ticket.attachments.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(ticket.attachments || []).map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RiAttachmentLine className="text-purple-400" size={20} />
                  <span className="text-gray-300 text-sm truncate">{attachment.filename}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Responses */}
  {(ticket.responses && Array.isArray(ticket.responses) && ticket.responses.length > 0) && (
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-white">Responses ({ticket.responses.length})</h3>
          {(ticket.responses || []).map((response, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {response.responder?.firstName?.[0]}
                    {response.responder?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {response.responder?.firstName} {response.responder?.lastName}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {response.responder?.role} • {new Date(response.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap">{response.message}</p>

              {(response.attachments && Array.isArray(response.attachments) && response.attachments.length > 0) && (
                <div className="mt-4">
                  <h5 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                    <RiAttachmentLine size={16} />
                    Attachments
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(response.attachments || []).map((attachment, idx) => (
                      <a
                        key={idx}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded hover:bg-gray-700 transition-colors text-sm"
                      >
                        <RiAttachmentLine className="text-purple-400" size={16} />
                        <span className="text-gray-300 truncate">{attachment.filename}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Response Form */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Add Response</h3>
        <form onSubmit={handleSubmitResponse} className="space-y-4">
          <div>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              rows={5}
              placeholder="Type your response here..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* File Upload */}
          <div>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
              <input
                type="file"
                id="response-file-upload"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <label htmlFor="response-file-upload" className="cursor-pointer flex items-center gap-2 text-gray-400 hover:text-gray-300">
                <RiUploadCloudLine size={24} />
                <span className="text-sm">Attach files (optional, max 5)</span>
              </label>
            </div>

            {responseAttachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {responseAttachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded-lg">
                    <span className="text-gray-300 text-sm truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      <RiDeleteBin6Line size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RiSendPlane2Line size={18} />
              {submitting ? "Sending..." : "Send Response"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketDetails;
