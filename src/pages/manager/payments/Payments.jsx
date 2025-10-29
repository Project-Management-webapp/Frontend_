import React, { useState, useEffect } from "react";
import { 
    RiSearchLine, 
    RiMoneyDollarCircleLine, 
    RiCheckLine, 
    RiCloseLine, 
    RiHourglassFill 
} from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import Toaster from "../../../components/Toaster";
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
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); 
  const [stats, setStats] = useState({ 
    totalPayments: 0, 
    totalPaidAmount: 0, 
    totalPendingAmount: 0 
  });

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
      
      if (response?.data?.payments?.rows && Array.isArray(response.data.payments.rows)) {
        const paymentsArray = response.data.payments.rows;
        setPayments(paymentsArray);

        const totalPayments = paymentsArray.filter(p => p.requestStatus === "paid").length;
          
        
        const totalPaidAmount = paymentsArray
          .filter(p => p.requestStatus === "paid")
          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
        
        const totalPendingAmount = paymentsArray
          .filter(p => p.requestStatus !== "paid" && p.requestStatus !== "rejected")
          .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
        
        setStats({ totalPayments, totalPaidAmount, totalPendingAmount });
      } else {
        setToast({ show: true, message: "Failed to load payments", type: "error" });
      }

    } catch (error) {
      console.error("Error fetching payments:", error);
      setToast({ show: true, message: error.message || "Failed to load payments", type: "error" });
      setPayments([]);
      setStats({ totalPayments: 0, totalPaidAmount: 0, totalPendingAmount: 0 });
    } finally {
      setLoading(false);
    }
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
    console.log("🟢 Approve payment initiated", { 
      selectedPayment: selectedPayment?.id, 
      transactionProofLink: transactionProofLink 
    });
    
    if (!transactionProofLink.trim()) {
      setToast({ show: true, message: "Transaction proof link is required", type: "error" });
      return;
    }
    if (!selectedPayment) {
      console.error("No payment selected");
      return;
    }

    setSubmitting(true);
    try {
      console.log("📤 Sending approve request:", { 
        paymentId: selectedPayment.id, 
        transactionProofLink: transactionProofLink.trim() 
      });
      
      const response = await approvePayment(selectedPayment.id, { transactionProofLink: transactionProofLink.trim() });
      
      console.log("✅ Approve response:", response);
      setToast({ show: true, message: "Payment approved successfully!", type: "success" });
      closeModal();
      fetchPayments(); // Refresh list & stats
    } catch (error) {
      console.error("❌ Error approving payment:", error);
      const errorMessage = error?.message || error?.error || "Failed to approve payment";
      setToast({ show: true, message: errorMessage, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    console.log("🔴 Reject payment initiated", { 
      selectedPayment: selectedPayment?.id, 
      rejectionReason: rejectionReason 
    });
    
    if (!rejectionReason.trim()) {
      setToast({ show: true, message: "Rejection reason is required", type: "error" });
      return;
    }
    if (!selectedPayment) {
      console.error("No payment selected");
      return;
    }

    setSubmitting(true);
    try {
      console.log("📤 Sending reject request:", { 
        paymentId: selectedPayment.id, 
        rejectedReason: rejectionReason.trim() 
      });
      
      const response = await rejectPayment(selectedPayment.id, { rejectedReason: rejectionReason.trim() });
      
      console.log("✅ Reject response:", response);
      setToast({ show: true, message: "Payment rejected successfully!", type: "success" });
      closeModal();
      fetchPayments(); 
    } catch (error) {
      console.error("❌ Error rejecting payment:", error);
      const errorMessage = error?.message || error?.error || "Failed to reject payment";
      setToast({ show: true, message: errorMessage, type: "error" });
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

    const matchesFilter = filterStatus === "all" || payment.requestStatus?.toLowerCase() === filterStatus;

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Total Payments (Done)</p>
            {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-white">{stats.totalPayments}</p>}
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Total Paid Amount</p>
            {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-green-400">${stats.totalPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
            <p className="text-gray-400 text-sm mb-1">Total Pending Amount</p>
             {loading ? <SkeletonStat /> : <p className="text-2xl font-bold text-yellow-400">${stats.totalPendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
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
               <option value="requested" className="bg-gray-800">Requested</option>
               <option value="rejected" className="bg-gray-800">Rejected</option>
               <option value="paid" className="bg-gray-800">Paid</option>
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
                      <PaymentStatusBadge status={payment.requestStatus} /> 
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

      {/* Toast Notification */}
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: "" })}
        />
      )}
    </>
  );
};

export default Payments;