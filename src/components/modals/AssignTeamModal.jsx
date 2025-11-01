import React, { useState, useEffect } from 'react';
import { IoMdClose, IoMdInformationCircleOutline } from 'react-icons/io';
import Toaster from '../Toaster'; 
import { RiDeleteBin6Line } from "react-icons/ri";
import { FormSelect, FormInput, FormTextarea } from '../atoms/FormFields';
import { assignProject } from '../../api/manager/projectAssign';
import { getAllEmployees } from '../../api/manager/employeedetail';
import EmployeeDetailModal from '../manager/modals/EmployeeDetailModal';
const AssignTeamModal = ({ project, onClose, onSuccess }) => {

  const [employeeId, setEmployeeId] = useState('');
  const [role, setRole] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [paymentSchedule, setPaymentSchedule] = useState('milestone_based');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [estimatedMaterials, setEstimatedMaterials] = useState('');
  const [estimatedConsumables, setEstimatedConsumables] = useState('');
  const [notes, setNotes] = useState('');
  const [rate, setRate] = useState(''); // Manager inputs this manually
  // const [responseDeadline, setResponseDeadline] = useState('');
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

  useEffect(() => {
    const rateValue = parseFloat(rate) || 0;
    const hours = parseFloat(estimatedHours) || 0;
    const materials = parseFloat(estimatedMaterials) || 0;
    const consumables = parseFloat(estimatedConsumables) || 0;
    
    const calculatedAmount = (rateValue * hours + materials + consumables).toFixed(2);
    setAllocatedAmount(calculatedAmount);
  }, [rate, estimatedHours, estimatedMaterials, estimatedConsumables]);

  // Pre-fill rate with employee's rate when employee is selected (optional, manager can change it)
  useEffect(() => {
    if (employeeId) {
      const selectedEmp = userList.find(user => user.id === Number(employeeId));
      if (selectedEmp) {
        // Pre-fill rate with employee's rate, but manager can edit it
        setRate(selectedEmp.rate || '');
        // Set currency from project if available
        if (project.currency) {
          setCurrency(project.currency);
        }
      }
    }
  }, [employeeId, userList, project.currency]);

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
      estimatedHours: estimatedHours ? Number(estimatedHours) : 0,
      estimatedMaterials: estimatedMaterials ? Number(estimatedMaterials) : 0,
      estimatedConsumables: estimatedConsumables ? Number(estimatedConsumables) : 0,
      rate: rate ? Number(rate) : 0, // Manager manually inputs the rate
      currency,
      paymentSchedule,
      paymentTerms,
      responsibilities: responsibilitiesArray,
      deliverables: deliverablesArray,
      notes: notes || null,
      // responseDeadline,
    };

    setIsLoading(true);
    try {
      await assignProject(payload);
      onSuccess?.();

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
          {toast.show && (
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
            {/* Employee Selection */}
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <FormSelect
                  id="employee"
                  label="Employee"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
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

            {/* Employee Rate Display */}
            {employeeId && (
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                <p className="text-sm text-blue-300">
                  <span className="font-semibold">Employee's Base Rate:</span> {currency} {userList.find(user => user.id === Number(employeeId))?.rate || 'N/A'}/hour
                  
                </p>
              </div>
            )}

            {/* Role */}
            <FormInput
              id="role"
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
            />

            {/* Rate per Hour - Manager Input */}
            <FormInput
              id="rate"
              label="Rate per Hour for this Assignment"
              type="number"
              step="0.01"
              min="0"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="Enter hourly rate"
              required
              onWheel={(e) => e.target.blur()}
            />

            {/* Estimated Hours */}
            <FormInput
              id="estimatedHours"
              label="Estimated Hours"
              type="number"
              step="0.01"
              min="0"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              placeholder="Enter estimated hours"
              onWheel={(e) => e.target.blur()}
            />

            <FormInput
              id="estimatedMaterials"
              label="Estimated Materials Cost (Optional)"
              type="number"
              step="0.01"
              min="0"
              value={estimatedMaterials}
              onChange={(e) => setEstimatedMaterials(e.target.value)}
              placeholder="0.00"
              onWheel={(e) => e.target.blur()}
            />

            <FormInput
              id="estimatedConsumables"
              label="Estimated Consumables Cost (Optional)"
              type="number"
              step="0.01"
              min="0"
              value={estimatedConsumables}
              onChange={(e) => setEstimatedConsumables(e.target.value)}
              placeholder="0.00"
              onWheel={(e) => e.target.blur()}
            />

            {/* Allocated Amount (Auto-calculated - disabled) */}
            <div>
              <FormInput
                id="allocatedAmount"
                label="Allocated Amount"
                type="number"
                step="0.01"
                min="0"
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(e.target.value)}
                placeholder="Auto-calculated"
                disabled={true}
                onWheel={(e) => e.target.blur()}
              />
            </div>

            {/* Currency */}
            <FormSelect
              id="currency"
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="GBP">GBP</option>
            </FormSelect>

            {/* Payment Schedule */}
            <FormSelect
              id="paymentSchedule"
              label="Payment Schedule"
              value={paymentSchedule}
              onChange={(e) => setPaymentSchedule(e.target.value)}
            >
              <option value="project_completion">Project Completion</option>
              <option value="milestone_based">Milestone Based</option>
              <option value="hourly">Hourly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </FormSelect>

            {/* Payment Terms */}
            <FormInput
              id="paymentTerms"
              label="Payment Terms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              placeholder="e.g. 50% after first milestone"
            />

            {/* Responsibilities */}
            <FormTextarea
              id="responsibilities"
              label="Responsibilities"
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              placeholder="Enter responsibilities (one per line)"
              rows={3}
            />

            {/* Deliverables */}
            <FormTextarea
              id="deliverables"
              label="Deliverables"
              value={deliverables}
              onChange={(e) => setDeliverables(e.target.value)}
              placeholder="Enter deliverables (one per line)"
              rows={3}
            />

            {/* Notes */}
            <FormTextarea
              id="notes"
              label="Additional Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional information"
              rows={2}
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