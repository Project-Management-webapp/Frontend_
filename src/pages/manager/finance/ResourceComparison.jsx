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
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
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
      setLoading(false);
    }
  };

  const fetchResourceComparison = async () => {
    if (!selectedProjectId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getResourceComparison(selectedProjectId);
      if (response.success) {
        setResourceData(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch resource comparison data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {loading ? (
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
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full md:w-96 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.customProjectType || project.projectType})
                </option>
              ))}
            </select>
          </div>

          {resourceData && (
            <>
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
            <TrackingCard
              icon={<FiClock className="text-blue-400" size={24} />}
              title="Hours Tracking"
              estimated={resourceData.projectLevel.hours.estimated}
              actual={resourceData.projectLevel.hours.actual}
              unit="hours"
            />

            {/* Consumables Tracking */}
            <div className="border border-yellow-500 bg-yellow-900/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiPackage className="text-yellow-400" size={24} />
                <h3 className="text-gray-400 text-sm font-medium">Consumables</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-yellow-400 font-medium mb-2">Estimated Consumables:</p>
                  {resourceData.projectLevel.consumables.estimated.length > 0 ? (
                    <div className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                      {resourceData.projectLevel.consumables.estimated.map((item, idx) => (
                        <div key={idx} className="flex items-center p-2 bg-gray-800/50 rounded border border-gray-700 hover:border-yellow-500/50 transition-colors">
                          <span className="text-sm text-gray-200 font-medium">
                            {typeof item === 'string' ? item : (item.item || item.name || item.consumable || 'Unnamed Item')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic bg-gray-900/30 rounded p-2">No estimated consumables</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-yellow-400 font-medium mb-2">Actual Consumables:</p>
                  {resourceData.projectLevel.consumables.actual.length > 0 ? (
                    <div className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                      {resourceData.projectLevel.consumables.actual.map((item, idx) => (
                        <div key={idx} className="flex items-center p-2 bg-gray-800/50 rounded border border-gray-700 hover:border-yellow-500/50 transition-colors">
                          <span className="text-sm text-gray-200 font-medium">
                            {typeof item === 'string' ? item : (item.item || item.name || item.consumable || 'Unnamed Item')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic bg-gray-900/30 rounded p-2">No actual consumables</p>
                  )}
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
                <div>
                  <p className="text-xs text-green-400 font-medium mb-2">Estimated Materials:</p>
                  {resourceData.projectLevel.materials.estimated.length > 0 ? (
                    <div className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                      {resourceData.projectLevel.materials.estimated.map((item, idx) => (
                        <div key={idx} className="flex items-center p-2 bg-gray-800/50 rounded border border-gray-700 hover:border-green-500/50 transition-colors">
                          <span className="text-sm text-gray-200 font-medium">
                            {typeof item === 'string' ? item : (item.material || item.name || item.item || 'Unnamed Material')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic bg-gray-900/30 rounded p-2">No estimated materials</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-green-400 font-medium mb-2">Actual Materials:</p>
                  {resourceData.projectLevel.materials.actual.length > 0 ? (
                    <div className="bg-gray-900/50 rounded-lg p-3 space-y-2">
                      {resourceData.projectLevel.materials.actual.map((item, idx) => (
                        <div key={idx} className="flex items-center p-2 bg-gray-800/50 rounded border border-gray-700 hover:border-green-500/50 transition-colors">
                          <span className="text-sm text-gray-200 font-medium">
                            {typeof item === 'string' ? item : (item.material || item.name || item.item || 'Unnamed Material')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic bg-gray-900/30 rounded p-2">No actual materials</p>
                  )}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        Est. Hours
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actual Hours
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                          {assignment.hours.estimated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-300">
                          {assignment.hours.actual}
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {resourceData.assignmentLevel.assignments.map((assignment) => (
                <ResourceDetailCard key={assignment.assignmentId} assignment={assignment} />
              ))}
            </div>
          )}
            </>
          )}
        </>
      )}
    </div>
  );
};

const TrackingCard = ({ icon, title, estimated, actual, unit, itemsEstimated, itemsActual }) => {
  return (
    <div className="border border-blue-500 bg-blue-900/20 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>{icon}</div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-3">{title}</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Estimated:</span>
          <span className="text-white font-medium">
            {unit === 'cost' ? `$${estimated.toLocaleString()}` : `${estimated} ${unit}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Actual:</span>
          <span className="text-white font-medium">
            {unit === 'cost' ? `$${actual.toLocaleString()}` : `${actual} ${unit}`}
          </span>
        </div>
        {itemsEstimated !== undefined && (
          <div className="text-xs text-gray-500 pt-2">
            Items: {itemsActual || 0} / {itemsEstimated} estimated
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryItem = ({ label, value }) => (
  <div className="bg-gray-900/50 rounded-lg p-4">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className="text-lg font-bold text-white">
      {value}
    </p>
  </div>
);

const ResourceDetailCard = ({ assignment }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-white">{assignment.employee.fullName}</h3>
      <p className="text-sm text-gray-400">{assignment.role} • {assignment.workStatus}</p>
    </div>

    {/* Consumables Details */}
    {(assignment.consumables.estimated.length > 0 || assignment.consumables.actual.length > 0) && (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-yellow-400 mb-3 flex items-center gap-2">
          <FiPackage /> Consumables
        </h4>

        {/* Estimated Consumables */}
        <div className="mb-3">
          <p className="text-xs text-yellow-400 font-medium mb-2">Estimated:</p>
          {assignment.consumables.estimated.length > 0 ? (
            <div className="space-y-1">
              {assignment.consumables.estimated.map((item, idx) => (
                <div key={idx} className="flex items-center p-2 bg-gray-900/50 rounded border border-gray-700 hover:border-yellow-500/50 transition-colors">
                  <span className="text-sm text-gray-200">
                    {typeof item === 'string' ? item : (item.item || item.name || item.consumable || 'Unnamed Item')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic bg-gray-900/30 rounded p-2">No estimated consumables</p>
          )}
        </div>

        {/* Actual Consumables */}
        <div>
          <p className="text-xs text-yellow-400 font-medium mb-2">Actual:</p>
          {assignment.consumables.actual.length > 0 ? (
            <div className="space-y-1">
              {assignment.consumables.actual.map((item, idx) => (
                <div key={idx} className="flex items-center p-2 bg-gray-900/50 rounded border border-gray-700 hover:border-yellow-500/50 transition-colors">
                  <span className="text-sm text-gray-200">
                    {typeof item === 'string' ? item : (item.item || item.name || item.consumable || 'Unnamed Item')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic bg-gray-900/30 rounded p-2">No actual consumables</p>
          )}
        </div>
      </div>
    )}

    {/* Materials Details */}
    {(assignment.materials.estimated.length > 0 || assignment.materials.actual.length > 0) && (
      <div>
        <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
          <FiBox /> Materials
        </h4>

        {/* Estimated Materials */}
        <div className="mb-3">
          <p className="text-xs text-green-400 font-medium mb-2">Estimated:</p>
          {assignment.materials.estimated.length > 0 ? (
            <div className="space-y-1">
              {assignment.materials.estimated.map((item, idx) => (
                <div key={idx} className="flex items-center p-2 bg-gray-900/50 rounded border border-gray-700 hover:border-green-500/50 transition-colors">
                  <span className="text-sm text-gray-200">
                    {typeof item === 'string' ? item : (item.material || item.name || item.item || 'Unnamed Material')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic bg-gray-900/30 rounded p-2">No estimated materials</p>
          )}
        </div>

        {/* Actual Materials */}
        <div>
          <p className="text-xs text-green-400 font-medium mb-2">Actual:</p>
          {assignment.materials.actual.length > 0 ? (
            <div className="space-y-1">
              {assignment.materials.actual.map((item, idx) => (
                <div key={idx} className="flex items-center p-2 bg-gray-900/50 rounded border border-gray-700 hover:border-green-500/50 transition-colors">
                  <span className="text-sm text-gray-200">
                    {typeof item === 'string' ? item : (item.material || item.name || item.item || 'Unnamed Material')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic bg-gray-900/30 rounded p-2">No actual materials</p>
          )}
        </div>
      </div>
    )}
  </div>
);

export default ResourceComparison;
