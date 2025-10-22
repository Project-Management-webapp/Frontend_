import React, { useState, useEffect } from "react";
import { RiAddLine, RiSearchLine, RiTicket2Line } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { getMyTickets } from "../../../api/employee/supportTicket";
import TicketStatusBadge from "../../../components/atoms/TicketStatusBadge";
import PriorityBadge from "../../../components/atoms/PriorityBadge";
import SupportTicketDetailModal from "../../../components/modals/SupportTicketDetailModal"; 

// --- Skeleton Component for Loading ---
const TicketSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
      {/* Subject Skeleton */}
      <div className="h-6 bg-gray-700/50 rounded-md w-3/5 mb-2 md:mb-0"></div>
      {/* Badges Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-5 bg-gray-700/50 rounded-full w-20"></div>
        <div className="h-5 bg-gray-700/50 rounded-full w-20"></div>
      </div>
    </div>
    {/* Description Skeleton */}
    <div className="h-4 bg-gray-700/50 rounded-md w-full mb-1.5"></div>
    <div className="h-4 bg-gray-700/50 rounded-md w-3/4 mb-4"></div>
    {/* Meta Skeleton */}
    <div className="flex flex-wrap items-center gap-4">
      <div className="h-4 bg-gray-700/50 rounded-md w-28"></div>
      <div className="h-4 bg-gray-700/50 rounded-md w-28"></div>
    </div>
  </div>
);


const SupportTickets = ({ setActiveView }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // 2. Add state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getMyTickets();
      
      let ticketsArray = [];
      
      if (data?.tickets?.rows && Array.isArray(data.tickets.rows)) {
        ticketsArray = data.tickets.rows;
      } 
      else if (Array.isArray(data)) {
        ticketsArray = data;
      } else if (Array.isArray(data?.data)) {
        ticketsArray = data.data;
      } else if (Array.isArray(data?.tickets)) {
        ticketsArray = data.tickets;
      } else if (Array.isArray(data?.data?.tickets)) {
        ticketsArray = data.data.tickets;
      } else if (data?.data?.tickets?.rows && Array.isArray(data.data.tickets.rows)) {
        ticketsArray = data.data.tickets.rows;
      }
      
      setTickets(ticketsArray);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      (ticket.subject?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (ticket.category?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || ticket.status?.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // 3. Create handler to open modal
  const handleTicketClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsModalOpen(true);
  };

  return (
    // 4. Wrap in a Fragment
    <> 
      <div className="min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Support Tickets</h2>
          <button
            onClick={() => setActiveView("createTicket")}
            className="flex items-center gap-2 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <RiAddLine size={20} />
            Create Ticket
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by subject or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all" className="bg-gray-800">All Status</option>
              <option value="open" className="bg-gray-800">Open</option>
              <option value="in_progress" className="bg-gray-800">In Progress</option>
              <option value="resolved" className="bg-gray-800">Resolved</option>
              <option value="closed" className="bg-gray-800">Closed</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            <TicketSkeleton />
            <TicketSkeleton />
            <TicketSkeleton />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 border border-white/20 text-center">
            <RiTicket2Line className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">No Tickets Found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter"
                : "Create your first support ticket to get help"}
            </p>
            <button
              onClick={() => setActiveView("createTicket")}
              className="inline-flex items-center gap-2 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              <RiAddLine size={20} />
              Create Ticket
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => handleTicketClick(ticket.id)}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:border-purple-400 transition-all text-left w-full"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2 md:mb-0 line-clamp-1">{ticket.subject}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <PriorityBadge priority={ticket.priority} />
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{ticket.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span>Category: {ticket.category || "N/A"}</span>
                  <span>•</span>
                  <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                  {ticket.response && Array.isArray(ticket.response) && ticket.response.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-purple-400">{ticket.response.length} response(s)</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 6. Render the modal */}
      <SupportTicketDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticketId={selectedTicketId}
      />
    </>
  );
};

export default SupportTickets;