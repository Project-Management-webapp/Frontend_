import React, { useState, useEffect } from "react";
import { getEmployeeAllocations } from "../../../api/manager/finance";
import { FiDollarSign, FiAlertCircle, FiUser, FiCheckCircle, FiClock, FiSearch, FiX } from "react-icons/fi";
import { FaProjectDiagram, FaUsers, FaMoneyBillWave } from "react-icons/fa";

const EmployeeAllocations = () => {
  const [allocationsData, setAllocationsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    fetchAllocations();
  }, []);

  useEffect(() => {
    if (allocationsData) {
      filterEmployees();
    }
  }, [searchQuery, allocationsData]);

  const fetchAllocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmployeeAllocations();
      if (response.success) {
        setAllocationsData(response.data);
        setFilteredEmployees(response.data.employees);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch employee allocations");
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    if (!searchQuery.trim()) {
      setFilteredEmployees(allocationsData.employees);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = allocationsData.employees.filter((employeeData) => {
      // Check if any of the employee's projects match the search query
      return employeeData.projects.some((project) =>
        project.projectName.toLowerCase().includes(query)
      );
    });

    setFilteredEmployees(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const toggleEmployee = (employeeId) => {
    setExpandedEmployee(expandedEmployee === employeeId ? null : employeeId);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-700 rounded w-72"></div>
              <div className="h-4 bg-gray-700 rounded w-80"></div>
            </div>
          </div>

          {/* Search Bar Skeleton */}
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="h-10 bg-gray-600 rounded w-full max-w-2xl"></div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
            ))}
          </div>

          {/* Employees List Skeleton */}
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-600">
              <div className="h-6 bg-gray-600 rounded w-56"></div>
            </div>
            <div className="divide-y divide-gray-600">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-600 rounded w-48"></div>
                      <div className="h-4 bg-gray-600 rounded w-32"></div>
                    </div>
                    <div className="flex gap-6">
                      <div className="space-y-1">
                        <div className="h-3 bg-gray-600 rounded w-20"></div>
                        <div className="h-5 bg-gray-600 rounded w-24"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 bg-gray-600 rounded w-20"></div>
                        <div className="h-5 bg-gray-600 rounded w-24"></div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-3 bg-gray-600 rounded w-20"></div>
                        <div className="h-5 bg-gray-600 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-200">
          <FiAlertCircle className="inline mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!allocationsData) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Employee Payment Allocations</h1>
          <p className="text-gray-400 mt-1">Track employee payments across all projects</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-2xl">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search employees by project name..."
              className="w-full pl-10 pr-10 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="text-sm text-gray-400">
              Found {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard
          icon={<FaUsers className="text-purple-400" size={24} />}
          title="Total Employees"
          value={allocationsData.summary.totalEmployees}
          bgColor="bg-purple-900/20"
          borderColor="border-purple-500"
        />
        <SummaryCard
          icon={<FaMoneyBillWave className="text-blue-400" size={24} />}
          title="Total Allocated"
          value={`$${allocationsData.summary.totalAllocated.toLocaleString()}`}
          bgColor="bg-blue-900/20"
          borderColor="border-blue-500"
        />
        <SummaryCard
          icon={<FiCheckCircle className="text-green-400" size={24} />}
          title="Total Paid"
          value={`$${allocationsData.summary.totalPaid.toLocaleString()}`}
          bgColor="bg-green-900/20"
          borderColor="border-green-500"
        />
        <SummaryCard
          icon={<FiClock className="text-yellow-400" size={24} />}
          title="Total Pending"
          value={`$${allocationsData.summary.totalPending.toLocaleString()}`}
          bgColor="bg-yellow-900/20"
          borderColor="border-yellow-500"
        />
        <SummaryCard
          icon={<FiDollarSign className="text-cyan-400" size={24} />}
          title="Remaining to Allocate"
          value={`$${allocationsData.summary.remainingToAllocate.toLocaleString()}`}
          bgColor="bg-cyan-900/20"
          borderColor="border-cyan-500"
        />
      </div>

      {/* Employees List */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaUsers className="text-purple-400" size={20} />
              <h2 className="text-xl font-semibold text-white">
                Employee Allocations ({filteredEmployees.length})
              </h2>
            </div>
            {searchQuery && filteredEmployees.length > 0 && (
              <span className="text-sm text-gray-400">
                Filtered by project: "{searchQuery}"
              </span>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employeeData) => (
              <EmployeeCard
                key={employeeData.employee.id}
                employeeData={employeeData}
                isExpanded={expandedEmployee === employeeData.employee.id}
                onToggle={() => toggleEmployee(employeeData.employee.id)}
                searchQuery={searchQuery}
              />
            ))
          ) : (
            <div className="p-8 text-center">
              <FiSearch className="mx-auto text-gray-600 mb-3" size={48} />
              <p className="text-gray-400 text-lg">No employees found</p>
              <p className="text-gray-500 text-sm mt-1">
                No employees are assigned to projects matching "{searchQuery}"
              </p>
              <button
                onClick={clearSearch}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, title, value, bgColor, borderColor }) => (
  <div className={`${bgColor} border ${borderColor} rounded-lg p-6`}>
    <div className="flex items-center justify-between mb-4">
      <div>{icon}</div>
    </div>
    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const EmployeeCard = ({ employeeData, isExpanded, onToggle, searchQuery }) => {
  const { employee, totalAllocated, totalPaid, totalPending, projects } = employeeData;
  const completionPercentage = totalAllocated > 0
    ? Math.round((totalPaid / totalAllocated) * 100)
    : 0;

  return (
    <div className="bg-gray-800 hover:bg-gray-750 transition-colors">
      {/* Employee Summary */}
      <div
        onClick={onToggle}
        className="p-6 cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <FiUser className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">
              {employee.fullName || employee.email}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
              <span>{projects.length} project{projects.length !== 1 ? "s" : ""}</span>
              {employee.position && (
                <>
                  <span>•</span>
                  <span>{employee.position}</span>
                </>
              )}
              {!employee.fullName && (
                <>
                  <span>•</span>
                  <span className="text-xs">{employee.email}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mr-6">
          <div className="text-right">
            <p className="text-xs text-gray-400">Total Allocated</p>
            <p className="text-lg font-semibold text-white">
              ${totalAllocated.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Paid</p>
            <p className="text-lg font-semibold text-green-400">
              ${totalPaid.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Pending</p>
            <p className="text-lg font-semibold text-yellow-400">
              ${totalPending.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-32">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Expanded Project Details */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-700">
          <div className="mt-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Project Allocations
            </h4>
            {projects.map((project, index) => (
              <ProjectAllocationCard 
                key={index} 
                project={project} 
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectAllocationCard = ({ project, searchQuery }) => {
  const getWorkStatusColor = (status) => {
    const statusColors = {
      'not_started': 'gray',
      'in_progress': 'blue',
      'submitted': 'purple',
      'completed': 'green',
      'on_hold': 'yellow'
    };
    return statusColors[status] || 'gray';
  };

  const getProjectStatusColor = (status) => {
    const statusColors = {
      'pending': 'yellow',
      'in-progress': 'blue',
      'completed': 'green',
      'on-hold': 'orange',
      'cancelled': 'red'
    };
    return statusColors[status] || 'gray';
  };

  const workStatusColor = getWorkStatusColor(project.workStatus);
  const projectStatusColor = getProjectStatusColor(project.projectStatus);
  
  // Check if this project matches the search query
  const isMatchingProject = searchQuery && 
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase().trim());

  return (
    <div className={`bg-gray-900 rounded-lg p-4 border transition-colors ${
      isMatchingProject 
        ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
        : 'border-gray-700 hover:border-gray-600'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <FaProjectDiagram className={isMatchingProject ? "text-purple-400" : "text-purple-400"} mt-1 size={18} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h5 className="text-sm font-medium text-white">
                {project.projectName}
                {isMatchingProject && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/50">
                    <FiSearch className="inline mr-1" size={10} />
                    Match
                  </span>
                )}
              </h5>
              <span className={`px-2 py-0.5 text-xs rounded-full bg-${projectStatusColor}-900/30 text-${projectStatusColor}-400 border border-${projectStatusColor}-500/50`}>
                {project.projectStatus}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="font-medium">Project ID:</span>
                {project.projectId}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="font-medium">Work Status:</span>
                <span className={`px-2 py-0.5 rounded-full bg-${workStatusColor}-900/30 text-${workStatusColor}-400`}>
                  {project.workStatus.replace('_', ' ')}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-xs text-gray-400">Allocated</p>
            <p className="text-sm font-semibold text-white">
              ${project.allocated.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Paid</p>
            <p className="text-sm font-semibold text-green-400">
              ${project.paid.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Pending</p>
            <p className="text-sm font-semibold text-yellow-400">
              ${project.pending.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Status Indicators */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
        <div className="flex gap-2">
          {project.paid > 0 && (
            <span className="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-400 flex items-center gap-1 border border-green-500/30">
              <FiCheckCircle size={12} />
              Paid: ${project.paid.toLocaleString()}
            </span>
          )}
          {project.pending > 0 && (
            <span className="px-2 py-1 text-xs rounded-full bg-yellow-900/30 text-yellow-400 flex items-center gap-1 border border-yellow-500/30">
              <FiClock size={12} />
              Pending: ${project.pending.toLocaleString()}
            </span>
          )}
          {project.paid === 0 && project.pending === 0 && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-400">
              No payments processed
            </span>
          )}
        </div>
        {project.allocated > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Payment Progress:</span>
            <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${Math.round((project.paid / project.allocated) * 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">
              {Math.round((project.paid / project.allocated) * 100)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAllocations;
