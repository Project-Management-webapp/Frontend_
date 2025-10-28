import React, { useState, useEffect } from "react";
import { getIncomeSummary } from "../../../api/manager/finance";
import {
  FiDollarSign,
  FiFilter,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
} from "react-icons/fi";
import { FaProjectDiagram, FaCheckCircle, FaClock } from "react-icons/fa";

const IncomeSummary = () => {
  const [incomeData, setIncomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    projectType: "",
    status: "",
  });

  useEffect(() => {
    fetchIncomeSummary();
  }, []);

  const fetchIncomeSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getIncomeSummary(filters);
      if (response.success) {
        setIncomeData(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch income summary");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchIncomeSummary();
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      projectType: "",
      status: "",
    });
    setTimeout(fetchIncomeSummary, 0);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-700 rounded w-64"></div>
              <div className="h-4 bg-gray-700 rounded w-80"></div>
            </div>

          </div>

          {/* Filters Skeleton */}
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="h-6 bg-gray-600 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-600 rounded"></div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <div className="h-10 bg-gray-600 rounded w-32"></div>
              <div className="h-10 bg-gray-600 rounded w-24"></div>
            </div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
            ))}
          </div>

          {/* Income by Project Type Skeleton */}
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="h-6 bg-gray-600 rounded w-56 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-600 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Income by Status Skeleton */}
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="h-6 bg-gray-600 rounded w-56 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-600 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* Monthly Breakdown Skeleton */}
          <div className="bg-gray-700 rounded-lg p-6">
            <div className="h-6 bg-gray-600 rounded w-48 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-600 rounded"></div>
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

  if (!incomeData) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Income Summary</h1>
          <p className="text-gray-400 mt-1">Comprehensive income analysis and trends</p>
        </div>
        
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <FiDollarSign className="text-green-400" size={24} />
            <h3 className="text-gray-300 text-sm font-medium">Total Revenue</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            ${incomeData.summary?.totalRevenue?.toLocaleString() || '0'}
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-500 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <FiTrendingDown className="text-red-400" size={24} />
            <h3 className="text-gray-300 text-sm font-medium">Total Costs</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            ${incomeData.summary?.totalCosts?.toLocaleString() || '0'}
          </p>
        </div>

        <div className={`bg-gradient-to-r ${(incomeData.summary?.totalProfit || 0) >= 0 ? 'from-green-900/30 to-emerald-900/30 border-green-500' : 'from-red-900/30 to-rose-900/30 border-red-500'} border rounded-lg p-6`}>
          <div className="flex items-center gap-3 mb-2">
            <FiTrendingUp className={(incomeData.summary?.totalProfit || 0) >= 0 ? "text-green-400" : "text-red-400"} size={24} />
            <h3 className="text-gray-300 text-sm font-medium">Total Profit</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            ${incomeData.summary?.totalProfit?.toLocaleString() || '0'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Margin: {incomeData.summary?.profitMargin || '0'}%
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <FaProjectDiagram className="text-blue-400" size={24} />
            <h3 className="text-gray-300 text-sm font-medium">Total Projects</h3>
          </div>
          <p className="text-2xl font-bold text-white">
            {incomeData.summary?.totalProjects || 0}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Avg Budget: ${incomeData.summary?.averageProjectBudget || '0'}
          </p>
        </div>
      </div>

      {/* Income by Project Type */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FaProjectDiagram className="text-purple-400" size={20} />
          <h2 className="text-xl font-semibold text-white">Income by Project Type</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeData.byProjectType && Object.keys(incomeData.byProjectType).length > 0 ? (
            Object.entries(incomeData.byProjectType).map(([type, data], index) => (
              <ProjectTypeCard
                key={index}
                type={type}
                income={data.totalRevenue}
                projectCount={data.count}
                profit={data.totalProfit}
              />
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center py-4">No project type data available</p>
          )}
        </div>
      </div>

      {/* Income by Status */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp className="text-blue-400" size={20} />
          <h2 className="text-xl font-semibold text-white">Income by Project Status</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {incomeData.byStatus && Object.keys(incomeData.byStatus).length > 0 ? (
            Object.entries(incomeData.byStatus)
              .filter(([_, income]) => income > 0)
              .map(([status, income], index) => (
                <StatusCard
                  key={index}
                  status={status}
                  income={income}
                />
              ))
          ) : (
            <p className="text-gray-400 col-span-full text-center py-4">No status data available</p>
          )}
        </div>
      </div>

      {/* Monthly Breakdown */}
      {incomeData.monthlyBreakdown && incomeData.monthlyBreakdown.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FiCalendar className="text-cyan-400" size={20} />
            <h2 className="text-xl font-semibold text-white">Monthly Income Trend</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Month
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Projects
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total Income
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {incomeData.monthlyBreakdown.map((month, index) => (
                  <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {month.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
                      {month.projectCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-400">
                      ${month.revenue?.toLocaleString() || '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectTypeCard = ({ type, income, projectCount, profit }) => (
  <div className="bg-gray-900 rounded-lg p-4 border border-purple-500/30 hover:border-purple-500/60 transition-colors">
    <div className="flex items-center gap-2 mb-3">
      <FaProjectDiagram className="text-purple-400" />
      <h3 className="text-sm font-medium text-gray-300 truncate">{type || "Unspecified"}</h3>
    </div>
    <p className="text-2xl font-bold text-white mb-1">${income?.toLocaleString() || '0'}</p>
    <p className="text-xs text-gray-400">{projectCount || 0} project{projectCount !== 1 ? "s" : ""}</p>
    {profit !== undefined && (
      <p className={`text-xs mt-1 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        Profit: ${profit?.toLocaleString() || '0'}
      </p>
    )}
  </div>
);

const StatusCard = ({ status, income }) => {
  const statusConfig = {
    pending: { color: "yellow", icon: FaClock },
    "in-progress": { color: "blue", icon: FiTrendingUp },
    completed: { color: "green", icon: FaCheckCircle },
    "on-hold": { color: "orange", icon: FiAlertCircle },
    cancelled: { color: "red", icon: FiAlertCircle },
  };

  const config = statusConfig[status] || { color: "gray", icon: FiAlertCircle };
  const Icon = config.icon;

  return (
    <div
      className={`bg-${config.color}-900/20 border border-${config.color}-500/50 rounded-lg p-4`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`text-${config.color}-400`} />
        <h3 className="text-sm font-medium text-gray-300 capitalize">{status.replace('-', ' ')}</h3>
      </div>
      <p className="text-2xl font-bold text-white mb-1">${income?.toLocaleString() || '0'}</p>
    </div>
  );
};

export default IncomeSummary;
