import React, { useState, useEffect } from "react";
// 1. Remove Link import
import { RiSearchLine, RiTicket2Line } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { getAllTickets } from "../../../api/manager/supportTicket";
import TicketDetailsModalformanager from "../../../components/manager/modals/TicketDetailsModalformanager";
import {
  TICKET_STATUS_CONFIG,
  PRIORITY_CONFIG,
} from "../../../lib/badgeConfigs";
import Badge from "../../../components/atoms/Badge";
const SkeletonStat = () => (
  <div className="h-8 w-12 bg-gray-700/50 rounded-md animate-pulse"></div>
);

const TicketListSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div className="space-y-2 w-full md:w-3/5">
            <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
          </div>
          <div className="flex items-center gap-2 mt-3 md:mt-0 flex-shrink-0">
            <div className="h-5 bg-gray-700/50 rounded-full w-20"></div>
            <div className="h-5 bg-gray-700/50 rounded-full w-20"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700/50 rounded w-5/6 mb-4"></div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-4 bg-gray-700/50 rounded w-24"></div>
          <div className="h-4 bg-gray-700/50 rounded w-28"></div>
        </div>
      </div>
    ))}
  </div>
);


const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // 3. Add state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getAllTickets();
      
      let ticketsArray = [];
      if (data?.tickets?.rows && Array.isArray(data.tickets.rows)) {
        ticketsArray = data.tickets.rows;
      } else if (Array.isArray(data?.tickets)) {
        ticketsArray = data.tickets;
      } else if (Array.isArray(data)) {
        ticketsArray = data;
      }
      
      setTickets(ticketsArray);

      if (data?.stats) {
        setStats(data.stats);
      }
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
      (ticket.category?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (ticket.employee?.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status?.toLowerCase() === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority?.toLowerCase() === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // 4. Handler to open modal
  const handleTicketClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsModalOpen(true);
  };

  return (
    // 5. Wrap in a Fragment
    <>
      <div className="min-h-screen">
        <h2 className="text-2xl font-bold text-white mb-6">Support Tickets Management</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Total Tickets</p>
            {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-white">{stats.total}</p>}
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Open</p>
            {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-blue-400">{stats.open}</p>}
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">In Progress</p>
            {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>}
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Resolved</p>
            {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>}
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Closed</p>
            {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-red-400">{stats.closed}</p>}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by subject, category, or email..."
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
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              <option value="all" className="bg-gray-800">All Priority</option>
              <option value="low" className="bg-gray-800">Low</option>
              <option value="medium" className="bg-gray-800">Medium</option>
              <option value="high" className="bg-gray-800">High</option>
              <option value="critical" className="bg-gray-800">Critical</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <TicketListSkeleton />
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 border border-white/20 text-center">
            <RiTicket2Line className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white mb-2">No Tickets Found</h3>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== "all" || filterPriority !== "all"
                ? "Try adjusting your filters"
                : "No support tickets have been created yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map((ticket) => (
              // 6. Changed from Link to button
              <button
                key={ticket.id}
                onClick={() => handleTicketClick(ticket.id)}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:border-purple-400 transition-all text-left w-full"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{ticket.subject}</h3>
                    <p className="text-gray-400 text-sm">
                      By: {ticket.employee?.email || "Unknown User"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3 md:mt-0 flex-shrink-0">
                     <Badge
                      value={ticket.priority}
                      configMap={PRIORITY_CONFIG}
                      defaultKey="medium"
                      className="text-xs"
                    /><Badge
                      value={ticket.status}
                      configMap={TICKET_STATUS_CONFIG}
                      defaultKey="open"
                      className="text-sm"
                    />
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

      {/* 7. Render the modal */}
      <TicketDetailsModalformanager
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticketId={selectedTicketId}
        onTicketUpdate={fetchTickets} // Pass the refresh function
      />
    </>
  );
};

export default SupportTickets;