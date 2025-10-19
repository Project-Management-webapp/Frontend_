import React, { useState, useEffect } from 'react';
import EmployeeCard from '../../components/manager/EmployeeCard';
import { getAllEmployees } from '../../api/manager/employeedetail';
import Toaster from '../../components/Toaster';

const AllEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
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
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-4xl font-bold text-white mb-6">Employees</h2>
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
      <h2 className="text-4xl font-bold text-white mb-6">Employees</h2>
      
      {employees.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No employees found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {employees.map((employee) => (
            // ✅ **FIX 2**: Use the correct key and pass the whole employee object
            <EmployeeCard
              key={employee.id}
              employee={employee}
            />
          ))}
        </div>
      )}

      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default AllEmployee;