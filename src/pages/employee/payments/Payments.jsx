import React, { useState, useEffect } from "react";
import { RiAddLine, RiSearchLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import Toaster from "../../../components/Toaster";
import { getMyPayments } from "../../../api/employee/payment";
import PaymentStatusBadge from "../../../components/payments/PaymentStatusBadge";

// --- Skeleton Loaders ---
const SkeletonStat = () => (
  <div className="h-8 w-16 bg-gray-700/50 rounded-md animate-pulse"></div>
);

const PaymentItemSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
      <div className="space-y-2 mb-3 md:mb-0">
        <div className="h-8 w-32 bg-gray-700/50 rounded-md"></div>
        <div className="h-4 w-48 bg-gray-700/50 rounded-md"></div>
      </div>
      <div className="h-6 w-24 bg-gray-700/50 rounded-full"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-1">
        <div className="h-3 w-16 bg-gray-600/50 rounded"></div>
        <div className="h-4 w-24 bg-gray-700/50 rounded"></div>
      </div>
       <div className="space-y-1">
        <div className="h-3 w-16 bg-gray-600/50 rounded"></div>
        <div className="h-4 w-24 bg-gray-700/50 rounded"></div>
      </div>
       <div className="space-y-1">
        <div className="h-3 w-16 bg-gray-600/50 rounded"></div>
        <div className="h-4 w-24 bg-gray-700/50 rounded"></div>
      </div>
    </div>
  </div>
);
// --- End Skeleton Loaders ---


const Payments = ({ setActiveView }) => {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // State for stats from API
  const [stats, setStats] = useState({ totalEarnings: 0, totalPayments: 0 });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getMyPayments();

      // Extract data from API response
      if (response?.data?.payments && Array.isArray(response.data.payments)) {
        setPayments(response.data.payments);
        
        // Use stats directly from API response
        setStats({
          totalEarnings: response.data.totalEarnings || 0,
          totalPayments: response.data.totalPayments || 0,
        });
      } else {
        setToast({ show: true, message: "Failed to load payments", type: "error" });
      }

    } catch (error) {
      console.error("Error fetching payments:", error);
      setToast({ show: true, message: error.message || "Failed to load payments", type: "error" });
      setPayments([]);
      setStats({ totalEarnings: 0, totalPayments: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredPayments = payments.filter((payment) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (payment.project?.name?.toLowerCase() || "").includes(searchTermLower) ||
      (payment.requestNotes?.toLowerCase() || "").includes(searchTermLower) ||
      (payment.amount?.toString() || "").includes(searchTerm);
      
    const matchesFilter = filterStatus === "all" || payment.requestStatus?.toLowerCase() === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric'
      });
  }

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">My Payments</h2>
        <button
          onClick={() => setActiveView('requestPayment')}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
        >
          <RiAddLine size={20} />
          Request Payment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
          {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-white">${stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <p className="text-gray-400 text-sm mb-1">Total Payments</p>
          {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-green-400">{stats.totalPayments}</p>}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by project, notes, or amount..."
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
            <option value="requested" className="bg-gray-800">Requested</option>
            <option value="rejected" className="bg-gray-800">Rejected</option>
            <option value="paid" className="bg-gray-800">Completed</option>
          </select>
        </div>
      </div>

      {/* Payments List */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
            <PaymentItemSkeleton />
            <PaymentItemSkeleton />
            <PaymentItemSkeleton />
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-12 border border-white/20 text-center">
          <RiMoneyDollarCircleLine className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-white mb-2">No Payments Found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter"
              : "Request your first payment to get started"}
          </p>
          <button
            onClick={() => setActiveView('requestPayment')}
            className="inline-flex items-center gap-2 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <RiAddLine size={20} />
            Request Payment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                {/* Left Side: Amount, Status, Project, Notes */}
                <div className="mb-4 md:mb-0 md:mr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">
                       ${parseFloat(payment.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h3>
                    <PaymentStatusBadge status={payment.requestStatus} />
                  </div>
                   <p className="text-gray-300 text-sm mb-1">
                      Project: <span className="text-purple-300">{payment.project?.name || 'N/A'}</span>
                   </p>
                  <p className="text-gray-400 text-sm italic line-clamp-2">
                      Notes: {payment.requestNotes || 'No notes provided'}
                   </p>
                </div>
              </div>

              {/* Bottom Section: Dates and Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 text-sm text-gray-400 border-t border-white/10 pt-4">
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Requested At</p>
                  <p>{formatDate(payment.requestedAt || payment.createdAt)}</p>
                </div>
                {payment.approvedAt && (
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Approved At</p>
                    <p>{formatDate(payment.approvedAt)}</p>
                  </div>
                )}
                 {payment.confirmedAt && (
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">Confirmed At</p>
                    <p>{formatDate(payment.confirmedAt)}</p>
                  </div>
                )}
                <div>
                    <p className="text-gray-500 text-xs mb-0.5">Payment Method</p>
                    <p className="capitalize">{payment.paymentMethod?.replace(/_/g, ' ') || 'N/A'}</p>
                 </div>
                 {payment.transactionId && (
                    <div>
                        <p className="text-gray-500 text-xs mb-0.5">Transaction ID</p>
                        <p className="truncate">{payment.transactionId}</p>
                    </div>
                 )}
                {payment.transactionProofLink && (
                  <div className="sm:col-span-1 md:col-span-1"> {/* Allow link to take more space if needed */}
                    <p className="text-gray-500 text-xs mb-0.5">Transaction Proof</p>
                    <a
                      href={payment.transactionProofLink.startsWith('http') ? payment.transactionProofLink : `https://${payment.transactionProofLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 hover:underline break-all"
                    >
                      View Proof
                    </a>
                  </div>
                )}
              </div>

              {/* Rejection Reason (if applicable) */}
              {payment.rejectedReason && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">
                    <span className="font-semibold">Rejection Reason:</span> {payment.rejectedReason}
                  </p>
                </div>
              )}

             {/* Approval Notes (if applicable) */}
              {payment.approvalNotes && payment.status !== 'rejected' && (
                 <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm">
                        <span className="font-semibold">Approval Notes:</span> {payment.approvalNotes}
                    </p>
                 </div>
              )}
              
            </div>
          ))}
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default Payments;