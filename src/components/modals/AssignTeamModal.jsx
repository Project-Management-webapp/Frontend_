import React, { useState, useEffect } from 'react';
import { IoMdClose, IoMdInformationCircleOutline } from 'react-icons/io';
import Toaster from '../Toaster'; // This can be removed
import { FormSelect, FormInput, FormTextarea } from '../atoms/FormFields';
import { assignProject } from '../../api/manager/projectAssign';
import { getAllEmployees } from '../../api/manager/employeedetail';
import EmployeeDetailModal from './EmployeeDetailModal';
const AssignTeamModal = ({ project, onClose, onSuccess }) => {

  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [paymentSchedule, setPaymentSchedule] = useState('milestone_based');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [responseDeadline, setResponseDeadline] = useState('');
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await getAllEmployees();
        if (responseData && responseData.data && Array.isArray(responseData.data.employees.rows)) {
          setUserList(responseData.data.employees.rows);
        } else {
          console.error('Unexpected API response structure:', responseData);
          setToast({ show: true, message: 'Failed to parse employee list', type: 'error' });
          setUserList([]);
        }
      } catch (error) {
        setToast({ show: true, message: 'Failed to load employees', type: 'error' });
        setUserList([]);
      }
    };
    fetchUsers();
  }, [setToast]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId) {
      setToast({ show: true, message: 'Select an employee', type: 'error' });
      return;
    }

    const responsibilitiesArray = responsibilities.split('\n').filter(line => line.trim() !== '');
    const deliverablesArray = deliverables.split('\n').filter(line => line.trim() !== '');

    const payload = {

      projectId: project.id,
      employeeId: Number(employeeId), 
      role,
      allocatedAmount: Number(allocatedAmount),
      paymentSchedule,
      paymentTerms,
      responsibilities: responsibilitiesArray,
      deliverables: deliverablesArray,       
      responseDeadline,
    };
  
    setIsLoading(true);
    try {
      await assignProject(payload);

      // --- OPTIMIZATION ---
      // 1. Call onSuccess (this now shows toast + refetches + closes)
      onSuccess?.();
      
      // 2. Remove internal toast and setTimeout
      // setToast({ show: true, message: 'Employee assigned successfully!', type: 'success' });
      // setTimeout(onClose, 1500);
      // --- END OPTIMIZATION ---

    } catch (error) {
      // Use parent's toast for errors, the modal will stay open
      setToast({ show: true, message: error.message || 'Failed to assign employee', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const selectedEmployee = userList.find(user => user.id === Number(employeeId));

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-lg border border-white/20 max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 pb-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold">Assign Employee</h2>
            <p className="text-gray-400">
              To Project: <span className="font-semibold">{project.name}</span>
            </p>
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-6 right-6 text-gray-400 hover:text-white"
              aria-label="Close modal"
            >
              <IoMdClose size={24} />
            </button>
          </div>
{          toast.show && (
          <div className="absolute top-20 right-6 z-20">
            <Toaster
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, show: false })}
            />
          </div>
        )}

          {/* Form */}
          <form onSubmit={handleSubmit} id="assign-form" className="flex-grow overflow-y-auto p-6 space-y-5">
            {/* ... (all form fields remain the same) ... */}
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <FormSelect
                  id="employee"
                  label="Employee"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {userList.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName || user.email}
                    </option>
                  ))}
                </FormSelect>
              </div>
              <button
                type="button"
                onClick={() => setShowDetailModal(true)}
                disabled={!employeeId}
                className="p-2 mb-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Show employee details"
              >
                <IoMdInformationCircleOutline size={24} />
              </button>
            </div>
            <FormInput
              id="role"
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
            />
            <FormInput
              id="allocatedAmount"
              label="Allocated Amount"
              type="number"
              value={allocatedAmount}
              onChange={(e) => setAllocatedAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <FormSelect
              id="paymentSchedule"
              label="Payment Schedule"
              value={paymentSchedule}
              onChange={(e) => setPaymentSchedule(e.target.value)}
            >
              <option value="milestone_based">Milestone Based</option>
              <option value="monthly">Monthly</option>
              <option value="on_completion">On Completion</option>
            </FormSelect>
            <FormInput
              id="paymentTerms"
              label="Payment Terms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="e.g. 50% after first milestone"
            />
            <FormTextarea
              id="responsibilities"
              label="Responsibilities"
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="Enter responsibilities (one per line)"
            />
            <FormTextarea
              id="deliverables"
              label="Deliverables"
              value={deliverables}
              onChange={(e) => setDeliverables(e.g.target.value)}
              placeholder="Enter deliverables (one per line)"
            />
            <FormInput
              id="responseDeadline"
              label="Response Deadline"
              type="datetime-local"
              value={responseDeadline}
              onChange={(e) => setResponseDeadline(e.target.value)}
            />
          </form>

          {/* Footer */}
          <div className="flex justify-end space-x-4 p-6 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="assign-form"
              disabled={isLoading}
              className="btn"
            >
              {isLoading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </div>
      </div>

      {/* This logic is correct. */}
      {showDetailModal && selectedEmployee && (
        <EmployeeDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          employeeData={selectedEmployee}
        />
      )}
    </>
  );
};

export default AssignTeamModal;