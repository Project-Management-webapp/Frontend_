import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiUsers, FiEye, FiCheckCircle } from 'react-icons/fi';
import EditProjectModal from '../modals/EditProjectModal';
import AssignTeamModal from '../../modals/AssignTeamModal';
import ProjectDetailsModal from '../modals/ProjectDetailModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import { markProjectAsCompleted } from '../../../api/manager/project';

const ProjectCard = ({ project, onDataChange, setToast }) => {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isAssignOpen, setAssignOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  
  const handleEditSuccess = () => {
    setEditOpen(false);
    onDataChange?.();
    setToast({ show: true, message: 'Project updated successfully!', type: 'success' });
  };

  const handleAssignSuccess = () => {
    setAssignOpen(false);
    onDataChange?.();
    setToast({ show: true, message: 'Employee assigned successfully!', type: 'success' });
  };

  const handleDeleteSuccess = () => {
    setDeleteOpen(false);
    onDataChange?.();
    setToast({ show: true, message: 'Project deleted successfully!', type: 'success' });
  };

  const handleMarkAsCompleted = async () => {
    if (project.status === 'completed') {
      setToast({ show: true, message: 'Project is already completed!', type: 'info' });
      return;
    }

    try {
      setIsMarkingComplete(true);
      const response = await markProjectAsCompleted(project.id);
      if (response.success) {
        setToast({ show: true, message: response.message || 'Project marked as completed!', type: 'success' });
        onDataChange?.();
      } else {
        setToast({ show: true, message: response.message || 'Failed to mark project as completed', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: error.message || 'Failed to mark project as completed', type: 'error' });
    } finally {
      setIsMarkingComplete(false);
    }
  };


  const budget = parseFloat(project.budget) || 0;

  return (
    <>
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-6 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md hover:shadow-purple-500/20 hover:border-purple-500/50 hover:-translate-y-1">
        <div onClick={() => setDetailsOpen(true)} className="cursor-pointer mb-5">
          <div className="flex items-center justify-between mb-4">
            <span className="px-4 py-1.5 text-xs font-semibold text-purple-200 bg-purple-600/30 rounded-full border border-purple-500/30">
              {project.projectType || 'No Domain'}
            </span>
            {project.status && (
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                project.status === 'completed' 
                  ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                  : project.status === 'in-progress' 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {project.status.replace('-', ' ').toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 leading-tight">{project.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-base">Budget:</span>
            <span className="text-xl font-bold text-green-400">${budget.toLocaleString()}</span>
          </div>
        </div>

        <div className="border-t border-gray-700/50 pt-5 flex flex-col gap-3">
          {/* Top Row - Assign and Mark Complete Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setAssignOpen(true)}
              className="flex-1 text-center py-2.5 px-4 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-sm hover:shadow-blue-500/30"
            >
              <FiUsers size={18} />
              <span>Assign</span>
            </button>
            
            <button
              onClick={handleMarkAsCompleted}
              disabled={isMarkingComplete || project.status === 'completed'}
              className={`flex-1 text-center py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                project.status === 'completed'
                  ? 'bg-green-600/30 text-green-300 cursor-not-allowed border border-green-500/30'
                  : isMarkingComplete
                  ? 'bg-green-600/50 text-white cursor-wait'
                  : 'bg-green-600/80 hover:bg-green-600 text-white hover:shadow-sm hover:shadow-green-500/30'
              }`}
            >
              <FiCheckCircle size={18} />
              <span>{project.status === 'completed' ? 'Completed' : isMarkingComplete ? 'Marking...' : 'Complete'}</span>
            </button>
          </div>

          {/* Bottom Row - Action Icons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setDetailsOpen(true)}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all hover:scale-110"
              title="View Details"
            >
              <FiEye size={20} />
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all hover:scale-110"
              title="Edit Project"
            >
              <FiEdit size={20} />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all hover:scale-110"
              title="Delete Project"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
      </div>


      
      {isDetailsOpen && <ProjectDetailsModal project={project} onClose={() => setDetailsOpen(false)} />}
      
      {isEditOpen && (
        <EditProjectModal 
          project={project} 
          onClose={() => setEditOpen(false)} 
          onSuccess={handleEditSuccess} 
          setToast={setToast} 
        />
      )}
      
      {isAssignOpen && (
        <AssignTeamModal 
          project={project} 
          onClose={() => setAssignOpen(false)} 
          onSuccess={handleAssignSuccess} 
          setToast={setToast}
        />
      )}
      
      {isDeleteOpen && (
        <DeleteConfirmationModal
          project={project}
          onClose={() => setDeleteOpen(false)}
          onSuccess={handleDeleteSuccess}
          setToast={setToast} 
        />
      )}
    </>
  );
};

export const ProjectCardSkeleton = () => {
    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-xl p-6 flex flex-col justify-between h-full animate-pulse">
            <div className="mb-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 bg-gray-700 rounded-full w-1/3"></div>
                    <div className="h-6 bg-gray-700 rounded-full w-20"></div>
                </div>
                <div className="h-7 bg-gray-700 rounded mt-4 w-3/4"></div>
                <div className="h-6 bg-gray-700 rounded mt-3 w-1/2"></div>
            </div>
            <div className="border-t border-gray-700/50 pt-5 flex flex-col gap-3">
                <div className="flex gap-3">
                    <div className="h-10 bg-gray-700 rounded-lg flex-1"></div>
                    <div className="h-10 bg-gray-700 rounded-lg flex-1"></div>
                </div>
                <div className="flex items-center justify-end gap-3">
                    <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
                    <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
                    <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;