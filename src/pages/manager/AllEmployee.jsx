import React, { useState, useEffect, useCallback } from 'react';
import EmployeeCard from '../../components/manager/cards/EmployeeCard';
import { getAllEmployees, addEmployee, updateEmployeeDetails } from '../../api/manager/employeedetail';
import Toaster from '../../components/Toaster';
import AddEmployeeModal from '../../components/manager/modals/AddEmployeeModal'; 
import { FaPlus } from 'react-icons/fa';
import { FiUserPlus, FiUsers } from 'react-icons/fi';

const AllEmployee = ({ setActiveView }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const fetchEmployees = useCallback(async () => {
    setLoading(prev => (prev || employees.length === 0)); 
    try {
      const response = await getAllEmployees();
      
      if (response && response.data && response.data.employees && Array.isArray(response.data.employees.rows)) {
        setEmployees(response.data.employees.rows);
      } else {
        setEmployees([]);
      }

    } catch (err) {
      setToast({ show: true, message: 'Failed to fetch employees', type: 'error' });
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, [employees.length]); 

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  
  const handleAddEmployee = async (employeeData) => {
    setToast({ show: true, message: 'Adding employee...', type: 'loading', loading: true });
    
    try {
      const response = await addEmployee(employeeData);
      
      if (response.success) {
        setToast({ show: true, message: 'Employee added successfully!', type: 'success', loading: false });
        setIsModalOpen(false); 
        fetchEmployees(); 
      } else {
        throw new Error(response.message || 'Failed to add employee.');
      }
    } catch (err) {
      setToast({ show: true, message: err.message || 'An error occurred.', type: 'error', loading: false });
      throw err; 
    }
  };

  const handleUpdateRate = async (employeeId, rateData) => {
    setToast({ show: true, message: 'Updating employee rate...', type: 'loading', loading: true });
    
    try {
      const response = await updateEmployeeDetails(employeeId, rateData);
      
      if (response.success) {
        setToast({ show: true, message: 'Employee rate updated successfully!', type: 'success', loading: false });
        
        // Update the employee in the local state
        setEmployees(prevEmployees => 
          prevEmployees.map(emp => 
            emp.id === employeeId ? { ...emp, rate: rateData.rate } : emp
          )
        );
      } else {
        throw new Error(response.message || 'Failed to update employee rate.');
      }
    } catch (err) {
      setToast({ show: true, message: err.message || 'Failed to update rate.', type: 'error', loading: false });
      throw err;
    }
  };

  if (loading && employees.length === 0) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold text-white">Employees</h2>
          <div className="w-36 h-10 bg-gray-600/50 rounded-lg animate-pulse" /> 
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-600/50" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-600/50 rounded w-3/4" />
                  <div className="h-3 bg-gray-600/50 rounded w-1/2" />
                  <div className="h-3 bg-gray-600/50 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-4xl font-bold text-white">Employees</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn flex items-center gap-2"
        >
          <FaPlus />
          Add Employee
        </button>
      </div>
      
      {employees.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full mx-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/30 rounded-2xl shadow-2xl p-8 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-600/20 rounded-full blur-xl"></div>
                  <div className="relative bg-purple-600/10 p-6 rounded-full border-2 border-purple-500/50">
                    <FiUsers className="text-purple-400 text-6xl" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-white mb-3">No Employees Yet</h3>
              
              {/* Description */}
              <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                Start building your team by adding your first employee. 
                Click the button below to get started!
              </p>

              {/* Action Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn flex w-full justify-center items-center gap-2"
              >
                <FiUserPlus className="text-md" />
                Add Your First Employee
              </button>

             
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onRateUpdate={handleUpdateRate}
            />
          ))}
        </div>
      )}

    <div className="relative z-[9999]">
        {toast.show && (
          <Toaster
            message={toast.message}
            type={toast.type}
            loading={toast.loading} 
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>

      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEmployee={handleAddEmployee}
      />
    </div>
  );
};

export default AllEmployee;