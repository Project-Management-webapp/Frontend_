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
        // Filter out completed projects - only show active and in-progress projects
        const allProjects = response.data.projects.rows;
        const activeProjects = allProjects.filter(project => project.status !== 'completed');
        setProjects(activeProjects);
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
      <div className="p-4 sm:p-6 lg:p-10 bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="max-w-[1600px] mx-auto mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white flex items-center gap-3">
                <FiFolderMinus className="text-purple-500" />
                Active Projects
              </h1>
              <p className="text-gray-400 mt-3 text-base sm:text-lg">Manage and oversee all your projects efficiently</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn flex gap-2"
            >
              <FiPlus size={20} className='mt-1' /> <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Loading / Empty / Grid */}
        <div className="max-w-[1600px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, idx) => (
                <ProjectCardSkeleton key={idx} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-2xl p-12 sm:p-16 flex flex-col items-center justify-center text-center">
              <div className="bg-purple-600/10 p-8 rounded-full mb-6">
                <FiFolderMinus className="text-purple-500 text-7xl" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">No Active Projects</h3>
              <p className="text-gray-400 mb-8 text-base sm:text-lg max-w-md">Get started by creating your first project and begin managing your team efficiently</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn flex gap-2"
              >
                <FiPlus size={20} />
                <span>Create Project</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
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
