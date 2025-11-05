import React, { useState, useEffect } from "react";
import { getFinancialOverview } from "../../../api/manager/finance";
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { FaProjectDiagram, FaUsers, FaClock, FaChevronLeft } from "react-icons/fa";

const FinanceOverview = ({ setActiveView }) => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await getFinancialOverview();
      if (response.success) {
        setFinancialData(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch financial data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-700 rounded w-64"></div>
              <div className="h-4 bg-gray-700 rounded w-96"></div>
            </div>
            
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg"></div>
            ))}
          </div>

          {/* Additional Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-700 rounded-lg"></div>
            ))}
          </div>

          {/* Projects Table Skeleton */}
          <div className="bg-gray-700 rounded-lg">
            <div className="p-4 border-b border-gray-600">
              <div className="h-6 bg-gray-600 rounded w-64"></div>
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-600 rounded"></div>
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

  if (!financialData) return null;

  const { summary, byStatus, projects } = financialData;
  const isProfitable = summary.overallProfitLoss >= 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Overview</h1>
          <p className="text-gray-400 mt-1">Complete financial summary of all projects</p>
        </div>
        
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<FiDollarSign className="text-blue-400" size={24} />}
          title="Total Budget"
          value={`$${(summary.totalBudget || 0).toLocaleString()}`}
          bgColor="bg-blue-900/20"
          borderColor="border-blue-500"
        />
        <SummaryCard
          icon={<FiTrendingUp className="text-green-400" size={24} />}
          title="Estimated Cost"
          value={`$${(summary.totalEstimatedCost || 0).toLocaleString()}`}
          bgColor="bg-green-900/20"
          borderColor="border-green-500"
        />
        <SummaryCard
          icon={<FiTrendingDown className="text-red-400" size={24} />}
          title="Total Expenses"
          value={`$${(summary.overallExpenses || 0).toLocaleString()}`}
          bgColor="bg-red-900/20"
          borderColor="border-red-500"
        />
        <SummaryCard
          icon={
            isProfitable ? (
              <FiCheckCircle className="text-green-400" size={24} />
            ) : (
              <FiAlertCircle className="text-red-400" size={24} />
            )
          }
          title="Net Profit/Loss"
          value={`$${(summary.overallProfitLoss || 0).toLocaleString()}`}
          subtitle={`${summary.overallProfitLossPercentage || 0}% margin`}
          bgColor={isProfitable ? "bg-green-900/20" : "bg-red-900/20"}
          borderColor={isProfitable ? "border-green-500" : "border-red-500"}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<FaProjectDiagram className="text-purple-400" />}
          title="Total Projects"
          value={summary.totalProjects || 0}
          details={[
            { label: "Pending", value: byStatus?.pending || 0 },
            { label: "In Progress", value: byStatus?.inProgress || 0 },
            { label: "Completed", value: byStatus?.completed || 0 },
          ]}
        />
        <StatCard
          icon={<FaUsers className="text-cyan-400" />}
          title="Employee Allocations"
          value={`$${(summary.totalAllocatedToEmployees || 0).toLocaleString()}`}
          details={[
            { label: "Paid", value: `$${(summary.totalPaidToEmployees || 0).toLocaleString()}` },
            { label: "Pending", value: `$${(summary.totalPendingPayments || 0).toLocaleString()}` },
          ]}
        />
        <StatCard
          icon={<FaClock className="text-yellow-400" />}
          title="Budget Status"
          value={`$${(summary.remainingBudget || 0).toLocaleString()}`}
          subtitle="Remaining Budget"
          details={[
            { label: "Estimated Cost", value: `$${(summary.totalEstimatedCost || 0).toLocaleString()}` },
            { label: "Actual Cost", value: `$${(summary.totalActualCost || 0).toLocaleString()}` },
          ]}
        />
      </div>

      {/* Projects Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Projects Financial Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actual Cost
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Profit/Loss
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Margin %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {projects && projects.length > 0 ? projects.map((project) => (
                <tr key={project.projectId} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{project.projectName}</div>
                    <div className="text-xs text-gray-400">{project.customProjectType || project.projectType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        project.status === "completed"
                          ? "bg-green-900/30 text-green-400"
                          : project.status === "in-progress"
                          ? "bg-blue-900/30 text-blue-400"
                          : project.status === "pending" || !project.status
                          ? "bg-yellow-900/30 text-yellow-400"
                          : "bg-gray-900/30 text-gray-400"
                      }`}
                    >
                      {project.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
                    ${(project.budget || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
                    ${(project.actualCost?.total || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span className={(project.profitLoss || 0) >= 0 ? "text-green-400" : "text-red-400"}>
                      ${(project.profitLoss || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <span className={(project.profitLoss || 0) >= 0 ? "text-green-400" : "text-red-400"}>
                      {project.profitLossPercentage || 0}%
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                    No projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, title, value, subtitle, bgColor, borderColor }) => (
  <div className={`${bgColor} border ${borderColor} rounded-lg p-6`}>
    <div className="flex items-center justify-between mb-4">
      <div>{icon}</div>
    </div>
    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
  </div>
);

const StatCard = ({ icon, title, value, subtitle, details }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
    {details && (
      <div className="space-y-2 mt-4 pt-4 border-t border-gray-700">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-400">{detail.label}</span>
            <span className="text-gray-300 font-medium">{detail.value}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default FinanceOverview;
