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
  const [estimatedMaterials, setEstimatedMaterials] = useState([{ material: '' }]);
  const [estimatedConsumables, setEstimatedConsumables] = useState([{ consumable: '' }]);
  const [notes, setNotes] = useState('');
  const [employeeRate, setEmployeeRate] = useState('');
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

  // Auto-calculate allocated amount when employee or estimated hours change
  useEffect(() => {
    if (employeeId && estimatedHours !== '') {
      const selectedEmp = userList.find(user => user.id === Number(employeeId));
      if (selectedEmp && selectedEmp.rate) {
        const rate = parseFloat(selectedEmp.rate) || 0;
        const hours = parseFloat(estimatedHours) || 0;
        const calculatedAmount = (rate * hours).toFixed(2);
        setAllocatedAmount(calculatedAmount);
        setEmployeeRate(selectedEmp.rate);
      }
    } else if (estimatedHours === '' || estimatedHours === '0' || parseFloat(estimatedHours) === 0) {
      // If estimated hours is 0 or empty, set allocated amount to 0
      setAllocatedAmount('0');
    }
  }, [employeeId, estimatedHours, userList]);

  // Update employee rate when employee changes
  useEffect(() => {
    if (employeeId) {
      const selectedEmp = userList.find(user => user.id === Number(employeeId));
      if (selectedEmp) {
        setEmployeeRate(selectedEmp.rate || '');
        // Set currency from project or employee if available
        if (project.currency) {
          setCurrency(project.currency);
        }
      }
    }
  }, [employeeId, userList, project.currency]);

  // Handler for adding material row
  const addMaterialRow = () => {
    setEstimatedMaterials([...estimatedMaterials, { material: '' }]);
  };

  // Handler for adding consumable row
  const addConsumableRow = () => {
    setEstimatedConsumables([...estimatedConsumables, { consumable: '' }]);
  };

  // Handler for changing array items
  const handleArrayChange = (e, fieldName, index) => {
    const newValue = e.target.value;
    if (fieldName === 'estimatedMaterials') {
      const newArray = [...estimatedMaterials];
      newArray[index] = { material: newValue };
      setEstimatedMaterials(newArray);
    } else if (fieldName === 'estimatedConsumables') {
      const newArray = [...estimatedConsumables];
      newArray[index] = { consumable: newValue };
      setEstimatedConsumables(newArray);
    }
  };

  // Handler for removing array items
  const handleArrayRemove = (fieldName, indexToRemove) => {
    if (fieldName === 'estimatedMaterials') {
      if (estimatedMaterials.length > 1) {
        setEstimatedMaterials(estimatedMaterials.filter((_, index) => index !== indexToRemove));
      }
    } else if (fieldName === 'estimatedConsumables') {
      if (estimatedConsumables.length > 1) {
        setEstimatedConsumables(estimatedConsumables.filter((_, index) => index !== indexToRemove));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!employeeId) {
      setToast({ show: true, message: 'Select an employee', type: 'error' });
      return;
    }

    const responsibilitiesArray = responsibilities.split('\n').filter(line => line.trim() !== '');
    const deliverablesArray = deliverables.split('\n').filter(line => line.trim() !== '');

    // Filter and map materials and consumables
    const materialsArray = estimatedMaterials
      .map(item => item.material)
      .filter(material => material.trim() !== '');
    const consumablesArray = estimatedConsumables
      .map(item => item.consumable)
      .filter(consumable => consumable.trim() !== '');

    const payload = {
      projectId: project.id,
      employeeId: Number(employeeId),
      role,
      estimatedHours: estimatedHours ? Number(estimatedHours) : null,
      allocatedAmount: allocatedAmount ? Number(allocatedAmount) : 0,
      currency,
      paymentSchedule,
      paymentTerms,
      responsibilities: responsibilitiesArray,
      deliverables: deliverablesArray,
      estimatedMaterials: materialsArray.length > 0 ? materialsArray : null,
      estimatedConsumables: consumablesArray.length > 0 ? consumablesArray : null,
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
            {employeeRate && (
              <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-3">
                <p className="text-sm text-purple-300">
                  <span className="font-semibold">Employee Hourly Rate:</span> {currency} {employeeRate}/hour
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

            {/* Estimated Materials */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Materials (Optional)
              </label>
              {estimatedMaterials.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item.material}
                    onChange={(e) => handleArrayChange(e, 'estimatedMaterials', index)}
                    placeholder="Enter material"
                    className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  {estimatedMaterials.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('estimatedMaterials', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700  text-lg transition-colors"
                    >
                     <RiDeleteBin6Line />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMaterialRow}
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
              >
                + Add Material
              </button>
            </div>

            {/* Estimated Consumables */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Consumables (Optional)
              </label>
              {estimatedConsumables.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item.consumable}
                    onChange={(e) => handleArrayChange(e, 'estimatedConsumables', index)}
                    placeholder="Enter consumable"
                    className="flex-1 px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  {estimatedConsumables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('estimatedConsumables', index)}
                      className="px-3 py-2 text-red-600 hover:text-red-700 text-lg transition-colors"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addConsumableRow}
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
              >
                + Add Consumable
              </button>
            </div>

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