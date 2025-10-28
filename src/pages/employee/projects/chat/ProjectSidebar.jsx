import React from "react";
import { FaProjectDiagram, FaTimes } from "react-icons/fa";
import logo from "/login_logo.png";

const ProjectSkeleton = () => (
  <div className="p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-5 h-5 bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-700 rounded flex-1"></div>
    </div>
    <div className="h-3 bg-gray-700 rounded w-3/4 ml-8"></div>
  </div>
);

const ProjectSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  projects,
  selectedProjectId,
  handleSelectProject,
  loading,
  error,
  fetchAssignedProjects,
}) => {
  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`
        fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 flex flex-col z-50
        w-4/5 max-w-xs transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:w-1/3 md:z-auto
        lg:w-1/4
      `}
      >
        <div className="p-4 border-b border-gray-700 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center ms-16">
            <img src={logo} alt="Logo" className="w-28 object-contain" />
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {error && (
            <div className="p-4 m-2 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              <p className="font-semibold">Error loading projects:</p>
              <p>{error}</p>
              <button
                onClick={fetchAssignedProjects}
                className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
              >
                Retry
              </button>
            </div>
          )}
          {loading && projects.length === 0 ? (
            <>
              <ProjectSkeleton />
              <ProjectSkeleton />
              <ProjectSkeleton />
            </>
          ) : projects.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <FaProjectDiagram className="mx-auto mb-2 text-4xl" />
              <p>No projects assigned</p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className={`block p-4 cursor-pointer border-l-4 ${
                  selectedProjectId === project.id
                    ? "border-purple-500 bg-gray-700/50"
                    : "border-transparent hover:bg-gray-700/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <FaProjectDiagram className="text-purple-400 shrink-0" />
                  <h3 className="font-semibold truncate flex-1">
                    {project.name}
                  </h3>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-400 truncate pl-7">
                    {project.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectSidebar;
