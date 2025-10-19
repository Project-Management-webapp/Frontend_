import React, { useState, useEffect } from 'react';
import ApprovalCard from '../../components/manager/ApprovalCard';
import Toaster from '../../components/Toaster';
import { getPendingApprovals, rejectEmployee, approveEmployee } from '../../api/manager/approval';

const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const response = await getPendingApprovals();
      if (response && response.data && Array.isArray(response.data.pendingApprovals)) {
        setApprovals(response.data.pendingApprovals);
      } else {
        setApprovals([]); 
      }

    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to fetch approval requests',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
     
      setToast({
        show: true,
        message: 'Processing approval request...',
        type: 'info'
      });
      
      setProcessingId(id);
      
      const response = await approveEmployee(id);
      
      setToast({
        show: true,
        message: response?.message || 'Employee approved successfully',
        type: 'success'
      });
      setApprovals(prev => prev.filter(approval => approval.id !== id));
      
    } catch (error) {
      setToast({
        show: true,
        message: error.message || 'Failed to approve employee',
        type: 'error'
      });
    } finally {
      
      setTimeout(() => {
        setProcessingId(null);
      }, 500);
    }
  };

  const handleReject = async (id) => {
    try {
      setToast({
        show: true,
        message: 'Processing rejection request...',
        type: 'info'
      });
      
      setProcessingId(id);
      
      const response = await rejectEmployee(id);
      setToast({
        show: true,
        message: response?.message || 'Employee rejected successfully',
        type: 'success'
      });
      
      setApprovals(prev => prev.filter(approval => approval.id !== id));
      
    } catch (error) {
    
      setToast({
        show: true,
        message: error.message || 'Failed to reject employee',
        type: 'error'
      });
    } finally {
      setTimeout(() => {
        setProcessingId(null);
      }, 500);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-4xl font-bold text-white mb-6">Approval Requests</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 animate-pulse">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-5 bg-gray-600/50 rounded w-2/3" />
                  <div className="h-5 bg-gray-600/50 rounded w-1/2" />
                </div>
                <div className="flex gap-3 pt-2">
                  <div className="flex-1 h-10 bg-gray-600/50 rounded" />
                  <div className="flex-1 h-10 bg-gray-600/50 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : approvals.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No pending approval requests.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvals.map((approval) => (
            <ApprovalCard
              key={approval.id}
              email={approval.email}
              createdAt={approval.createdAt}
              
              onApprove={() => handleApprove(approval.id)}
              onReject={() => handleReject(approval.id)}
              loading={processingId === approval.id}
            />
          ))}
        </div>
      )}

      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => {
            setToast({ ...toast, show: false });
          }}
          autoClose={toast.type === 'info' ? 1000 : 2000} 
        />
      )}
    </div>
  );
};

export default Approvals;