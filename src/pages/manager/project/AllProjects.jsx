import React, { useState, useEffect, useCallback } from 'react';
import { getAllProject } from '../../../api/manager/project';
import Toaster from '../../../components/Toaster';
import ProjectCard, { ProjectCardSkeleton } from '../../../components/manager/cards/ProjectCard';
import CreateProjectModal from '../../../components/manager/modals/CreateProjectModal';
import { FiPlus, FiFolderMinus } from 'react-icons/fi';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await getAllProject();
      if (response.success && response.data.projects) {
        setProjects(response.data.projects.rows);
      } else {
        setToast({ show: true, message: response.message || 'Failed to fetch projects', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: error.message || 'An error occurred while fetching projects.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateSuccess = () => fetchProjects();

  return (
    <>
      {/* Toast Notifications */}
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}

      {/* Main Container */}
      <div className="p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center sm:text-left">
            All Projects
          </h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-semibold transition-colors text-sm sm:text-base"
          >
            <FiPlus size={18} /> <span>New Project</span>
          </button>
        </div>

        {/* Loading / Empty / Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, idx) => (
              <ProjectCardSkeleton key={idx} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-10 sm:p-12 flex flex-col items-center justify-center text-center shadow-inner">
            <div className="p-4 bg-purple-600/20 rounded-full mb-5 ring-4 ring-purple-600/10">
              <FiFolderMinus className="text-purple-400" size={40} />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white">No Projects Found</h3>
            <p className="mt-2 text-gray-400 text-sm sm:text-base">Get started by creating a new project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onDataChange={fetchProjects}
                setToast={setToast} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </>
  );
};

export default AllProjects;
