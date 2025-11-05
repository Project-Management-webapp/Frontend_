import React, { useState, useEffect } from "react";
import { getProjectProfitLoss } from "../../../api/manager/finance";
import { getAllProject } from "../../../api/manager/project";
import {
  FiDollarSign,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
} from "react-icons/fi";
import { FaClock, FaBoxOpen, FaUsers, FaChevronLeft } from "react-icons/fa";

const ProfitLoss = ({ setActiveView }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [profitLossData, setProfitLossData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProfitLoss();
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    try {
      setInitialLoading(true);
      const response = await getAllProject();

      // --- FIX ---
      // The project list is at response.data.projects.rows
      if (response.success && response.data && response.data.projects && response.data.projects.rows) {
        const projectList = response.data.projects.rows;
        setProjects(projectList);
        if (projectList.length > 0) {
          // The .id field is correct from the sample
          setSelectedProjectId(projectList[0].id);
        }
      }
      // --- END FIX ---

    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to fetch projects");
      setInitialLoading(false);
    }
  };

  const fetchProfitLoss = async () => {
    if (!selectedProjectId) return; // Don't fetch if no ID is selected
    try {
      // Use dataLoading for subsequent loads, initialLoading only for first load
      if (profitLossData) {
        setDataLoading(true);
      } else {
        setInitialLoading(true);
      }
      setError(null);
      const response = await getProjectProfitLoss(selectedProjectId);
      if (response.success) {
        setProfitLossData(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch profit/loss data");
    } finally {
      setInitialLoading(false);
      setDataLoading(false);
    }
  };

  const isProfitable = profitLossData && profitLossData.actual.profitLoss >= 0;

  return (
    <div className="p-6 space-y-6">
      {initialLoading ? (
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-96 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-64"></div>
          </div>

          {/* Project Selector Skeleton */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-10 bg-gray-700 rounded w-full md:w-96"></div>
          </div>

          {/* Project Info Banner Skeleton */}
          <div className="h-24 bg-gray-700 rounded-lg animate-pulse"></div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>

          {/* Cost Breakdown Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-700 rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-600 rounded w-48 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-600 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-600 rounded w-48 mb-4"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-600 rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown Stats Skeleton */}
          <div className="bg-gray-700 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-600 rounded w-40 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Project Profit & Loss Analysis</h1>
              <p className="text-gray-400 mt-1">Detailed financial breakdown by project</p>
            </div>
          </div>

          {/* Error Message */}
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-red-200">
            <FiAlertCircle className="inline mr-2" />
            {error}
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Project Profit & Loss Analysis</h1>
              <p className="text-gray-400 mt-1">Detailed financial breakdown by project</p>
            </div>
          </div>

          {/* Project Selector */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Project</label>
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                disabled={dataLoading}
                className="w-full md:w-96 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name} ({project.customProjectType || project.projectType})
                  </option>
                ))}
              </select>
              {dataLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {profitLossData && (
            <div className={`transition-opacity duration-200 space-y-6 ${dataLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {/* Project Info Banner */}
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{profitLossData.project.name}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-300">
                        Type: <span className="text-white font-medium">
                          {profitLossData.project.customProjectType || profitLossData.project.projectType}
                        </span>
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-300">
                        Status: <span className={`font-medium ${profitLossData.project.status === 'completed' ? 'text-green-400' :
                            profitLossData.project.status === 'in-progress' ? 'text-blue-400' :
                              'text-yellow-400'
                          }`}>
                          {profitLossData.project.status}
                        </span>
                      </span>
                      
                      
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                  icon={<FiDollarSign className="text-blue-400" size={24} />}
                  title="Project Budget"
                  value={`$${Number(profitLossData.project.budget).toLocaleString()}`}
                  bgColor="bg-blue-900/20"
                  borderColor="border-blue-500"
                />
                <SummaryCard
                  icon={<FiActivity className="text-yellow-400" size={24} />}
                  title="Estimated Cost"
                  value={`$${Number(profitLossData.estimated.totalCost).toLocaleString()}`}
                  subtitle={`Margin: ${profitLossData.estimated.profitMargin}%`}
                  bgColor="bg-yellow-900/20"
                  borderColor="border-yellow-500"
                />
                <SummaryCard
                  icon={<FiTrendingDown className="text-orange-400" size={24} />}
                  title="Actual Cost"
                  value={`$${Number(profitLossData.actual.totalCost).toLocaleString()}`}
                  subtitle={`Margin: ${profitLossData.actual.profitMargin}%`}
                  bgColor="bg-orange-900/20"
                  borderColor="border-orange-500"
                />
                <SummaryCard
                  icon={
                    isProfitable ? (
                      <FiTrendingUp className="text-green-400" size={24} />
                    ) : (
                      <FiTrendingDown className="text-red-400" size={24} />
                    )
                  }
                  title="Actual Profit/Loss"
                  value={`$${Number(profitLossData.actual.profitLoss).toLocaleString()}`}
                  subtitle={`${profitLossData.actual.profitMargin}% margin`}
                  bgColor={isProfitable ? "bg-green-900/20" : "bg-red-900/20"}
                  borderColor={isProfitable ? "border-green-500" : "border-red-500"}
                />
              </div>

              {/* Cost Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Estimated Cost Breakdown */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Estimated Cost Breakdown</h2>
                  <div className="space-y-4">
                    <CostItem
                      icon={<FaClock className="text-blue-400" />}
                      label="Hours"
                      value={profitLossData.estimated.hours.cost}
                      details={`${profitLossData.estimated.hours.quantity} hours @ $${profitLossData.estimated.hours.rate}/hr`}
                    />
                    <CostItem
                      icon={<FaBoxOpen className="text-yellow-400" />}
                      label="Consumables"
                      value={profitLossData.estimated.consumables.totalCost}
                    />
                    <CostItem
                      icon={<FaBoxOpen className="text-purple-400" />}
                      label="Materials"
                      value={profitLossData.estimated.materials.totalCost}
                    />
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Total Estimated</span>
                        <span className="text-lg font-bold text-white">
                          ${Number(profitLossData.estimated.totalCost).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actual Cost Breakdown */}
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Actual Cost Breakdown</h2>
                  <div className="space-y-4">
                    <CostItem
                      icon={<FaClock className="text-blue-400" />}
                      label="Hours"
                      value={profitLossData.actual.hours.cost}
                      details={`${profitLossData.actual.hours.quantity} hours @ $${profitLossData.actual.hours.rate}/hr`}
                    />
                    <CostItem
                      icon={<FaBoxOpen className="text-yellow-400" />}
                      label="Consumables"
                      value={profitLossData.actual.consumables.totalCost}
                    />
                    <CostItem
                      icon={<FaBoxOpen className="text-purple-400" />}
                      label="Materials"
                      value={profitLossData.actual.materials.totalCost}
                    />
                    
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-white">Total Actual</span>
                        <span className="text-lg font-bold text-white">
                          ${Number(profitLossData.actual.totalCost).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breakdown Stats */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Project Breakdown</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-400">{profitLossData.breakdown.totalAssignments}</p>
                    <p className="text-sm text-gray-400 mt-1">Total Assignments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">{profitLossData.breakdown.paidPayments}</p>
                    <p className="text-sm text-gray-400 mt-1">Paid Payments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">{profitLossData.breakdown.pendingPayments}</p>
                    <p className="text-sm text-gray-400 mt-1">Pending Payments</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
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

const CostItem = ({ icon, label, value, details }) => (
  <div className="flex items-start gap-3">
    <div className="text-xl mt-1">{icon}</div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-medium text-gray-300">{label}</div>
          {details && <div className="text-xs text-gray-500 mt-1">{details}</div>}
        </div>
        <div className="text-lg font-semibold text-white">${Number(value).toLocaleString() || '0'}</div>
      </div>
    </div>
  </div>
);

export default ProfitLoss;