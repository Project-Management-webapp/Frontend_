import React, { useState, useEffect } from "react";
import { getResourceComparison } from "../../../api/manager/finance";
import { getAllProject } from "../../../api/manager/project";
import {
  FiClock,
  FiPackage,
  FiBox,
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
} from "react-icons/fi";
import { FaUsers } from "react-icons/fa";

const ResourceComparison = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [resourceData, setResourceData] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchResourceComparison();
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    try {
      setInitialLoading(true);
      const response = await getAllProject();
      if (response.success && response.data?.projects?.rows) {
        const projectList = response.data.projects.rows;
        setProjects(projectList);
        if (projectList.length > 0) {
          setSelectedProjectId(projectList[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to fetch projects");
      setInitialLoading(false);
    }
  };

  const fetchResourceComparison = async () => {
    if (!selectedProjectId) return;
    try {
      // Use dataLoading for subsequent loads, initialLoading only for first load
      if (resourceData) {
        setDataLoading(true);
      } else {
        setInitialLoading(true);
      }
      setError(null);
      const response = await getResourceComparison(selectedProjectId);
      if (response.success) {
        setResourceData(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch resource comparison data");
    } finally {
      setInitialLoading(false);
      setDataLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {initialLoading ? (
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-96 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-[600px]"></div>
          </div>

          {/* Project Selector Skeleton */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-10 bg-gray-700 rounded w-full md:w-96"></div>
          </div>

          {/* Project Info Banner Skeleton */}
          <div className="h-28 bg-gray-700 rounded-lg animate-pulse"></div>

          {/* Project-Level Tracking Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>

          {/* Assignment-Level Summary Skeleton */}
          <div className="bg-gray-700 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-600 rounded w-64 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>

          {/* Assignment Details Table Skeleton */}
          <div className="bg-gray-700 rounded-lg overflow-hidden animate-pulse">
            <div className="h-16 bg-gray-600 border-b border-gray-600"></div>
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-600 rounded"></div>
              ))}
            </div>
          </div>

          {/* Detailed Resources Breakdown Skeleton */}
          <div className="bg-gray-700 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-600 rounded w-80 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 bg-gray-600 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Resource Comparison & Tracking</h1>
              <p className="text-gray-400 mt-1">Compare estimated vs actual resources (hours, materials, consumables)</p>
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
              <h1 className="text-3xl font-bold text-white">Resource Comparison & Tracking</h1>
              <p className="text-gray-400 mt-1">Compare estimated vs actual resources (hours, materials, consumables)</p>
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

          {resourceData && (
            <div className={`transition-opacity duration-200 space-y-6 ${dataLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {/* Project Info Banner */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-2">{resourceData.project.name}</h2>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Status: </span>
                    <span className="text-white font-medium capitalize">{resourceData.project.status || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Budget: </span>
                    <span className="text-green-400 font-medium">${resourceData.project.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Project-Level Tracking */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Hours Tracking */}
                <div className="border border-blue-500 bg-blue-900/20 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiClock className="text-blue-400" size={24} />
                    <h3 className="text-gray-400 text-sm font-medium">Hours Tracking</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Estimated:</span>
                      <span className="text-white font-medium">{resourceData.projectLevel.hours.estimated} hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Actual:</span>
                      <span className="text-white font-medium">{resourceData.projectLevel.hours.actual} hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Variance:</span>
                      <span className={`font-medium ${resourceData.projectLevel.hours.variance >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {resourceData.projectLevel.hours.variance > 0 ? '+' : ''}{resourceData.projectLevel.hours.variance} hours
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Rate:</span>
                      <span className="text-blue-400 font-medium">${resourceData.projectLevel.hours.rate}/hr</span>
                    </div>
                    <div className="pt-2 border-t border-gray-700">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Est. Cost:</span>
                        <span className="text-white font-medium">${resourceData.projectLevel.hours.estimatedCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Actual Cost:</span>
                        <span className="text-white font-medium">${resourceData.projectLevel.hours.actualCost.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${resourceData.projectLevel.hours.status === 'over' ? 'bg-red-900/30 text-red-400 border border-red-500/50' :
                          resourceData.projectLevel.hours.status === 'under' ? 'bg-green-900/30 text-green-400 border border-green-500/50' :
                            'bg-blue-900/30 text-blue-400 border border-blue-500/50'
                        }`}>
                        {resourceData.projectLevel.hours.status === 'over' ? 'Over Budget' :
                          resourceData.projectLevel.hours.status === 'under' ? 'Under Budget' : 'On Track'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Consumables Tracking */}
                <div className="border border-yellow-500 bg-yellow-900/20 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiPackage className="text-yellow-400" size={24} />
                    <h3 className="text-gray-400 text-sm font-medium">Consumables</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Est. Cost:</span>
                      <span className="text-white font-medium">${resourceData.projectLevel.consumables.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Actual Cost:</span>
                      <span className="text-white font-medium">${resourceData.projectLevel.consumables.actualCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Variance:</span>
                      <span className={`font-medium ${resourceData.projectLevel.consumables.variance >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {resourceData.projectLevel.consumables.variance > 0 ? '+' : ''}${resourceData.projectLevel.consumables.variance.toLocaleString()}
                      </span>
                    </div>
                    {resourceData.projectLevel.consumables.variancePercentage && (
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Variance %:</span>
                        <span>{resourceData.projectLevel.consumables.variancePercentage}%</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${resourceData.projectLevel.consumables.status === 'over' ? 'bg-red-900/30 text-red-400 border border-red-500/50' :
                          resourceData.projectLevel.consumables.status === 'under' ? 'bg-green-900/30 text-green-400 border border-green-500/50' :
                            'bg-yellow-900/30 text-yellow-400 border border-yellow-500/50'
                        }`}>
                        {resourceData.projectLevel.consumables.status === 'over' ? 'Over Budget' :
                          resourceData.projectLevel.consumables.status === 'under' ? 'Under Budget' : 'On Track'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Materials Tracking */}
                <div className="border border-green-500 bg-green-900/20 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiBox className="text-green-400" size={24} />
                    <h3 className="text-gray-400 text-sm font-medium">Materials</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Est. Cost:</span>
                      <span className="text-white font-medium">${resourceData.projectLevel.materials.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Actual Cost:</span>
                      <span className="text-white font-medium">${resourceData.projectLevel.materials.actualCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Variance:</span>
                      <span className={`font-medium ${resourceData.projectLevel.materials.variance >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {resourceData.projectLevel.materials.variance > 0 ? '+' : ''}${resourceData.projectLevel.materials.variance.toLocaleString()}
                      </span>
                    </div>
                    {resourceData.projectLevel.materials.variancePercentage && (
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Variance %:</span>
                        <span>{resourceData.projectLevel.materials.variancePercentage}%</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${resourceData.projectLevel.materials.status === 'over' ? 'bg-red-900/30 text-red-400 border border-red-500/50' :
                          resourceData.projectLevel.materials.status === 'under' ? 'bg-green-900/30 text-green-400 border border-green-500/50' :
                            'bg-green-900/30 text-green-400 border border-green-500/50'
                        }`}>
                        {resourceData.projectLevel.materials.status === 'over' ? 'Over Budget' :
                          resourceData.projectLevel.materials.status === 'under' ? 'Under Budget' : 'On Track'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment-Level Summary */}
              {resourceData.assignmentLevel && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaUsers className="text-purple-400" size={24} />
                    <h2 className="text-xl font-semibold text-white">Assignment-Level Summary</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryItem
                      label="Total Assignments"
                      value={resourceData.assignmentLevel.summary.totalAssignments}
                    />
                    <SummaryItem
                      label="Total Est. Hours"
                      value={`${resourceData.assignmentLevel.summary.totalEstimatedHours} hrs`}
                    />
                    <SummaryItem
                      label="Total Actual Hours"
                      value={`${resourceData.assignmentLevel.summary.totalActualHours} hrs`}
                    />
                    <SummaryItem
                      label="Hours Variance"
                      value={`${resourceData.assignmentLevel.summary.hoursVariance > 0 ? '+' : ''}${resourceData.assignmentLevel.summary.hoursVariance} hrs`}
                      isVariance={true}
                      variance={resourceData.assignmentLevel.summary.hoursVariance}
                    />
                    <SummaryItem
                      label="Est. Hours Cost"
                      value={`$${resourceData.assignmentLevel.summary.totalEstimatedHoursCost.toLocaleString()}`}
                    />
                    <SummaryItem
                      label="Actual Hours Cost"
                      value={`$${resourceData.assignmentLevel.summary.totalActualHoursCost.toLocaleString()}`}
                    />
                    <SummaryItem
                      label="Est. Consumables"
                      value={`$${resourceData.assignmentLevel.summary.totalEstimatedConsumables.toLocaleString()}`}
                    />
                    <SummaryItem
                      label="Actual Consumables"
                      value={`$${resourceData.assignmentLevel.summary.totalActualConsumables.toLocaleString()}`}
                    />
                    <SummaryItem
                      label="Est. Materials"
                      value={`$${resourceData.assignmentLevel.summary.totalEstimatedMaterials.toLocaleString()}`}
                    />
                    <SummaryItem
                      label="Actual Materials"
                      value={`$${resourceData.assignmentLevel.summary.totalActualMaterials.toLocaleString()}`}
                    />
                    <SummaryItem
                      label="Total Est. Cost"
                      value={`$${resourceData.assignmentLevel.summary.totalEstimatedCost.toLocaleString()}`}
                    />
                    <SummaryItem
                      label="Total Actual Cost"
                      value={`$${resourceData.assignmentLevel.summary.totalActualCost.toLocaleString()}`}
                    />
                  </div>
                </div>
              )}

              {/* Performance Indicators */}
              {resourceData.performanceIndicators && (
                <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FiActivity className="text-purple-400" size={24} />
                    <h2 className="text-xl font-semibold text-white">Performance Indicators</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">Overall Efficiency</p>
                      <p className={`text-2xl font-bold ${parseFloat(resourceData.performanceIndicators.overallEfficiency) >= 100 ? 'text-green-400' :
                          parseFloat(resourceData.performanceIndicators.overallEfficiency) >= 80 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                        {resourceData.performanceIndicators.overallEfficiency}%
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">Consumables Accuracy</p>
                      <p className={`text-2xl font-bold ${parseFloat(resourceData.performanceIndicators.consumablesAccuracy) >= 90 ? 'text-green-400' :
                          parseFloat(resourceData.performanceIndicators.consumablesAccuracy) >= 70 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                        {resourceData.performanceIndicators.consumablesAccuracy}%
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">Materials Accuracy</p>
                      <p className={`text-2xl font-bold ${parseFloat(resourceData.performanceIndicators.materialsAccuracy) >= 90 ? 'text-green-400' :
                          parseFloat(resourceData.performanceIndicators.materialsAccuracy) >= 70 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                        {resourceData.performanceIndicators.materialsAccuracy}%
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">Cost Performance Index</p>
                      <p className={`text-2xl font-bold ${parseFloat(resourceData.performanceIndicators.costPerformanceIndex) >= 1 ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {resourceData.performanceIndicators.costPerformanceIndex}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {parseFloat(resourceData.performanceIndicators.costPerformanceIndex) >= 1 ? 'Under Budget' : 'Over Budget'}
                      </p>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <p className="text-xs text-gray-400 mb-1">Budget Utilization</p>
                      <p className={`text-2xl font-bold ${parseFloat(resourceData.performanceIndicators.budgetUtilization) <= 100 ? 'text-green-400' :
                          parseFloat(resourceData.performanceIndicators.budgetUtilization) <= 110 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                        {resourceData.performanceIndicators.budgetUtilization}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Assignment Details Table */}
              {resourceData.assignmentLevel?.assignments && resourceData.assignmentLevel.assignments.length > 0 && (
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Employee Assignments Detail</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-900">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Employee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Hours (Est/Act)
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Efficiency
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Consumables
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Materials
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Allocation
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {resourceData.assignmentLevel.assignments.map((assignment) => (
                          <tr key={assignment.assignmentId} className="hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-white">{assignment.employee.fullName}</div>
                              <div className="text-xs text-gray-400">{assignment.employee.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-purple-400">{assignment.role}</span>
                              <div className="text-xs text-gray-500 capitalize">{assignment.workStatus}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-300">
                                {assignment.hours.estimated} / {assignment.hours.actual}
                              </div>
                              <div className={`text-xs ${assignment.hours.variance >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {assignment.hours.variance > 0 ? '+' : ''}{assignment.hours.variance} hrs
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span className={`text-sm font-medium ${parseFloat(assignment.hours.efficiency) >= 100 ? 'text-green-400' :
                                  parseFloat(assignment.hours.efficiency) >= 80 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                {assignment.hours.efficiency}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm text-gray-300">
                                ${assignment.consumables.actualCost.toLocaleString()}
                              </div>
                              <div className={`text-xs ${assignment.consumables.variance >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {assignment.consumables.variance > 0 ? '+' : ''}${assignment.consumables.variance.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="text-sm text-gray-300">
                                ${assignment.materials.actualCost.toLocaleString()}
                              </div>
                              <div className={`text-xs ${assignment.materials.variance >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {assignment.materials.variance > 0 ? '+' : ''}${assignment.materials.variance.toLocaleString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
                              ${assignment.totalAllocation.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Detailed Resources Breakdown */}
              {resourceData.assignmentLevel?.assignments && resourceData.assignmentLevel.assignments.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Detailed Resource Breakdown by Employee</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {resourceData.assignmentLevel.assignments.map((assignment) => (
                      <div key={assignment.assignmentId} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-white">{assignment.employee.fullName}</h3>
                          <p className="text-sm text-gray-400">{assignment.role} • {assignment.workStatus}</p>
                        </div>

                        {/* Hours Details */}
                        <div className="mb-4 pb-4 border-b border-gray-700">
                          <h4 className="text-sm font-medium text-blue-400 mb-3 flex items-center gap-2">
                            <FiClock /> Hours
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Estimated:</span>
                              <span className="text-white">{assignment.hours.estimated} hrs @ ${assignment.hours.rate}/hr</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Actual:</span>
                              <span className="text-white">{assignment.hours.actual} hrs</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Variance:</span>
                              <span className={assignment.hours.variance >= 0 ? 'text-red-400' : 'text-green-400'}>
                                {assignment.hours.variance > 0 ? '+' : ''}{assignment.hours.variance} hrs ({assignment.hours.variancePercentage}%)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Efficiency:</span>
                              <span className={`font-medium ${parseFloat(assignment.hours.efficiency) >= 100 ? 'text-green-400' :
                                  parseFloat(assignment.hours.efficiency) >= 80 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                {assignment.hours.efficiency}%
                              </span>
                            </div>
                            <div className="pt-2 border-t border-gray-700/50">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Est. Cost:</span>
                                <span className="text-white font-medium">${assignment.hours.estimatedCost.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between mt-1">
                                <span className="text-gray-400">Actual Cost:</span>
                                <span className="text-white font-medium">${assignment.hours.actualCost.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Consumables Details */}
                        <div className="mb-4 pb-4 border-b border-gray-700">
                          <h4 className="text-sm font-medium text-yellow-400 mb-3 flex items-center gap-2">
                            <FiPackage /> Consumables
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Est. Cost:</span>
                              <span className="text-white">${assignment.consumables.estimatedCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Actual Cost:</span>
                              <span className="text-white">${assignment.consumables.actualCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Variance:</span>
                              <span className={assignment.consumables.variance >= 0 ? 'text-red-400' : 'text-green-400'}>
                                {assignment.consumables.variance > 0 ? '+' : ''}${assignment.consumables.variance.toLocaleString()}
                                {assignment.consumables.variancePercentage && ` (${assignment.consumables.variancePercentage}%)`}
                              </span>
                            </div>
                            <div className="pt-2">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${assignment.consumables.status === 'over' ? 'bg-red-900/30 text-red-400 border border-red-500/50' :
                                  assignment.consumables.status === 'under' ? 'bg-green-900/30 text-green-400 border border-green-500/50' :
                                    'bg-yellow-900/30 text-yellow-400 border border-yellow-500/50'
                                }`}>
                                {assignment.consumables.status === 'over' ? 'Over Budget' :
                                  assignment.consumables.status === 'under' ? 'Under Budget' : 'On Track'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Materials Details */}
                        <div>
                          <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
                            <FiBox /> Materials
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Est. Cost:</span>
                              <span className="text-white">${assignment.materials.estimatedCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Actual Cost:</span>
                              <span className="text-white">${assignment.materials.actualCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Variance:</span>
                              <span className={assignment.materials.variance >= 0 ? 'text-red-400' : 'text-green-400'}>
                                {assignment.materials.variance > 0 ? '+' : ''}${assignment.materials.variance.toLocaleString()}
                                {assignment.materials.variancePercentage && ` (${assignment.materials.variancePercentage}%)`}
                              </span>
                            </div>
                            <div className="pt-2">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${assignment.materials.status === 'over' ? 'bg-red-900/30 text-red-400 border border-red-500/50' :
                                  assignment.materials.status === 'under' ? 'bg-green-900/30 text-green-400 border border-green-500/50' :
                                    'bg-green-900/30 text-green-400 border border-green-500/50'
                                }`}>
                                {assignment.materials.status === 'over' ? 'Over Budget' :
                                  assignment.materials.status === 'under' ? 'Under Budget' : 'On Track'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Total Allocation */}
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400 font-medium">Total Allocation:</span>
                            <span className="text-lg text-purple-400 font-bold">${assignment.totalAllocation.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const SummaryItem = ({ label, value, isVariance = false, variance = 0 }) => (
  <div className="bg-gray-900/50 rounded-lg p-4">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className={`text-lg font-bold ${isVariance
        ? (variance >= 0 ? 'text-red-400' : 'text-green-400')
        : 'text-white'
      }`}>
      {value}
    </p>
  </div>
);

export default ResourceComparison;
