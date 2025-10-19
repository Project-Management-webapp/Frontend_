import React, { useState, useEffect } from "react";
import { 
    RiSearchLine, 
    RiMoneyDollarCircleLine, 
    RiCheckLine, 
    RiCloseLine, 
    RiHourglassFill 
} from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-hot-toast";
import { getAllPayments, approvePayment, rejectPayment } from "../../../api/manager/payment"; 
import PaymentStatusBadge from "../../../components/payments/PaymentStatusBadge";

// --- Skeleton Loaders ---
const SkeletonStat = () => (
  <div className="h-8 w-24 bg-gray-700/50 rounded-md animate-pulse"></div>
);

const PaymentItemSkeleton = () => (
  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 animate-pulse">
    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
      {/* Left side */}
      <div className="space-y-2 mb-3 md:mb-0 md:mr-4">
        <div className="flex items-center gap-3 flex-wrap">
           <div className="h-8 w-32 bg-gray-700/50 rounded-md"></div>
           <div className="h-6 w-24 bg-gray-700/50 rounded-full"></div>
           <div className="h-5 w-28 bg-gray-600/50 rounded-full"></div>
        </div>
        <div className="h-4 w-48 bg-gray-700/50 rounded-md"></div>
        <div className="h-4 w-56 bg-gray-700/50 rounded-md"></div>
      </div>
      {/* Right side buttons placeholder */}
       <div className="flex gap-2 self-start md:self-center flex-shrink-0">
          <div className="h-9 w-24 bg-gray-600/50 rounded-md"></div>
          <div className="h-9 w-24 bg-gray-600/50 rounded-md"></div>
       </div>
    </div>
    <div className="border-t border-white/10 pt-4 mt-4">
       <div className="h-4 w-3/4 bg-gray-700/50 rounded-md"></div>
    </div>
  </div>
);
const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); 
  const [stats, setStats] = useState({ totalAmountApprovedOrConfirmed: 0, pendingAmountRequested: 0 });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [transactionProofLink, setTransactionProofLink] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getAllPayments(); 
      let paymentsArray = [];

      if (response?.data?.payments?.rows && Array.isArray(response.data.payments.rows)) {
        paymentsArray = response.data.payments.rows;
      }
      else if (Array.isArray(response?.payments)) paymentsArray = response.payments; 
      else if (Array.isArray(response)) paymentsArray = response; 

      setPayments(paymentsArray);
      calculateStats(paymentsArray);

    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error(error.message || "Failed to load payments");
      setPayments([]);
      calculateStats([]); 
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (paymentsArray) => {
    const totalAmountApprovedOrConfirmed = paymentsArray
      .filter(p => p.requestStatus === "approved" || p.requestStatus === "confirmed")
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    const pendingAmountRequested = paymentsArray
      .filter(p => p.requestStatus === "requested") 
      .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

    setStats({ totalAmountApprovedOrConfirmed, pendingAmountRequested });
  };

  const openApproveModal = (payment) => {
    setSelectedPayment(payment);
    setTransactionProofLink(payment.transactionProofLink || ""); 
    setShowApproveModal(true);
  };

  const openRejectModal = (payment) => {
    setSelectedPayment(payment);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const closeModal = () => {
    setShowApproveModal(false);
    setShowRejectModal(false);
    setSelectedPayment(null);
    setTransactionProofLink("");
    setRejectionReason("");
  }

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    if (!transactionProofLink.trim()) {
      toast.error("Transaction proof link is required");
      return;
    }
    if (!selectedPayment) return;

    setSubmitting(true);
    try {
      // API expects { transactionProofLink: "..." }
      await approvePayment(selectedPayment.id, { transactionProofLink: transactionProofLink.trim() });
      toast.success("Payment approved successfully!");
      closeModal();
      fetchPayments(); // Refresh list & stats
    } catch (error) {
      console.error("Error approving payment:", error);
      toast.error(error.message || "Failed to approve payment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectSubmit = async (e) => {
     e.preventDefault();
    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
     if (!selectedPayment) return;

    setSubmitting(true);
    try {
      // API expects { reason: "..." }
      await rejectPayment(selectedPayment.id, { reason: rejectionReason.trim() });
      toast.success("Payment rejected successfully!");
      closeModal();
      fetchPayments(); // Refresh list & stats
    } catch (error) {
      console.error("Error rejecting payment:", error);
      toast.error(error.message || "Failed to reject payment");
    } finally {
      setSubmitting(false);
    }
  };
  
  const filteredPayments = payments.filter((payment) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (payment.project?.name?.toLowerCase() || "").includes(searchTermLower) ||
      (payment.employee?.email?.toLowerCase() || "").includes(searchTermLower) || // Search employee email
      (payment.requestNotes?.toLowerCase() || "").includes(searchTermLower) ||
      (payment.amount?.toString() || "").includes(searchTerm);

    const matchesFilter = filterStatus === "all" || payment.status?.toLowerCase() === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      // Use toLocaleString for combined date and time
      return new Date(dateString).toLocaleString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
          hour: 'numeric', minute: '2-digit', hour12: true
      });
  }

  return (
    <> {/* Wrap in Fragment */}
      <div className="min-h-screen">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white mb-4 md:mb-0">Manage Payment Requests</h2>
        </div>

        {/* **UPDATED Stats Display** */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Total Amount (Approved/Confirmed)</p>
            {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-white">${stats.totalAmountApprovedOrConfirmed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Pending Amount (Requested)</p>
             {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-yellow-400">${stats.pendingAmountRequested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search project, employee, notes, amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <select // Filter by main status
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
               <option value="all" className="bg-gray-800">All Status</option>
               <option value="pending" className="bg-gray-800">Pending</option>
               <option value="approved" className="bg-gray-800">Approved</option>
               <option value="rejected" className="bg-gray-800">Rejected</option>
               <option value="completed" className="bg-gray-800">Completed</option>
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
            <p className="text-gray-400">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter"
                : "No payment requests match the current view."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                  {/* Left Side: Details */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-2xl font-bold text-white">
                         ${parseFloat(payment.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </h3>
                      <PaymentStatusBadge status={payment.status} /> {/* Main status */}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-600 text-gray-300 capitalize">
                         Request: {payment.requestStatus} {/* Request status */}
                      </span>
                    </div>
                     <p className="text-gray-300 text-sm mb-1">
                        Project: <span className="text-purple-300">{payment.project?.name || 'N/A'}</span>
                     </p>
                     <p className="text-gray-300 text-sm mb-2">
                         Employee: <span className="text-blue-300">{payment.employee?.email || 'N/A'}</span>
                     </p>
                    <p className="text-gray-400 text-sm italic">
                        Notes: {payment.requestNotes || 'No notes provided'}
                     </p>
                  </div>

                  {/* **UPDATED Condition for buttons** */}
                  {payment.requestStatus === "requested" && (
                    <div className="flex gap-2 self-start md:self-center flex-shrink-0">
                      <button
                        onClick={() => openApproveModal(payment)}
                        disabled={submitting}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 text-sm w-24"
                      >
                        <RiCheckLine size={16} /> Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(payment)}
                        disabled={submitting}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50 text-sm w-24"
                      >
                        <RiCloseLine size={16} /> Reject
                      </button>
                    </div>
                  )}
                </div>
                 {/* Details Section */}
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
                                <p className="text-gray-500 text-xs mb-0.5">Confirmed By Employee</p>
                                <p>{formatDate(payment.confirmedAt)}</p>
                            </div>
                        )}
                         {payment.rejectedAt && ( // Show rejection date
                            <div>
                                <p className="text-gray-500 text-xs mb-0.5">Rejected At</p>
                                <p>{formatDate(payment.rejectedAt)}</p>
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
                        <div className="sm:col-span-1 md:col-span-1">
                            <p className="text-gray-500 text-xs mb-0.5">Transaction Proof</p>
                            <a
                            href={payment.transactionProofLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 hover:underline break-all"
                            >
                            View Proof
                            </a>
                        </div>
                        )}
                  </div>
                    {/* Notes/Reasons */}
                    {payment.rejectedReason && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">
                            <span className="font-semibold">Rejection Reason:</span> {payment.rejectedReason}
                        </p>
                        </div>
                    )}
                    {payment.approvalNotes && payment.status !== 'rejected' && (
                        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-blue-300 text-sm">
                                <span className="font-semibold">Approval Notes:</span> {payment.approvalNotes}
                            </p>
                        </div>
                    )}
                    {payment.confirmationNotes && (
                         <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-green-300 text-sm">
                                <span className="font-semibold">Confirmation Notes:</span> {payment.confirmationNotes}
                            </p>
                        </div>
                    )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedPayment && (
        <div onClick={closeModal} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-700 shadow-xl">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Approve Payment</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"> <IoMdClose size={24} /> </button>
            </div>
            <form onSubmit={handleApproveSubmit} className="p-6">
              <p className="text-gray-300 mb-4 text-sm">
                 Approving <span className="font-bold text-white">${parseFloat(selectedPayment.amount).toLocaleString()}</span> for <span className="font-bold text-purple-300">{selectedPayment.project?.name}</span> requested by <span className="font-bold text-blue-300">{selectedPayment.employee?.email}</span>.
              </p>
              <div className="mb-4">
                <label htmlFor="transactionProofLink" className="block text-sm font-medium text-gray-300 mb-1.5"> Transaction Proof Link <span className="text-red-400">*</span> </label>
                <input id="transactionProofLink" type="text" value={transactionProofLink} onChange={(e) => setTransactionProofLink(e.target.value)} placeholder="Enter transaction link or reference ID..." required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm" />
              </div>
               {/* Optional Approval Notes */}
               <div className="mb-4">
                 <label htmlFor="approvalNotes" className="block text-sm font-medium text-gray-300 mb-1.5"> Approval Notes (Optional) </label>
                 <textarea id="approvalNotes" name="approvalNotes" rows={2} placeholder="Add any notes for the approval..." className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm" />
               </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} disabled={submitting} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm disabled:opacity-50"> Cancel </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-wait text-sm min-w-[100px] flex items-center justify-center"> {submitting ? <RiHourglassFill className="animate-spin" size={18} /> : "Approve"} </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedPayment && (
        <div onClick={closeModal} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg w-full max-w-md border border-gray-700 shadow-xl">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Reject Payment</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors"> <IoMdClose size={24} /> </button>
            </div>
            <form onSubmit={handleRejectSubmit} className="p-6">
               <p className="text-gray-300 mb-4 text-sm">
                 Rejecting <span className="font-bold text-white">${parseFloat(selectedPayment.amount).toLocaleString()}</span> for <span className="font-bold text-purple-300">{selectedPayment.project?.name}</span> requested by <span className="font-bold text-blue-300">{selectedPayment.employee?.email}</span>.
              </p>
              <div className="mb-4">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-300 mb-1.5"> Rejection Reason <span className="text-red-400">*</span> </label>
                <textarea id="rejectionReason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={3} placeholder="Explain why this payment is being rejected..." required className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400 text-sm" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} disabled={submitting} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm disabled:opacity-50"> Cancel </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-wait text-sm min-w-[100px] flex items-center justify-center"> {submitting ? <RiHourglassFill className="animate-spin" size={18} /> : "Reject"} </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Payments;