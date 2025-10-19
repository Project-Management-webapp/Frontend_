import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiUsers, FiEye } from 'react-icons/fi';
import EditProjectModal from '../modals/EditProjectModal';
import AssignTeamModal from '../modals/AssignTeamModal';
import ProjectDetailsModal from '../modals/ProjectDetailModal';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

// This is the component that needs the main updates
const ProjectCard = ({ project, onDataChange, setToast }) => {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isAssignOpen, setAssignOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // --- OPTIMIZATION ---
  // Create generic handlers that contain all success logic:
  // 1. Close the modal
  // 2. Refresh the project list
  // 3. Show a success toast
  
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
  // --- END OPTIMIZATION ---

  const budget = parseFloat(project.budget) || 0;

  return (
    <>
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-5 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-purple-500/20 hover:border-purple-500/50">
        {/* ... (card content remains the same) ... */}
        <div onClick={() => setDetailsOpen(true)} className="cursor-pointer">
          <span className="px-3 py-1 text-xs font-semibold text-purple-200 bg-purple-600/30 rounded-full">
            {project.projectType || 'No Domain'}
          </span>
          <h3 className="text-xl font-bold text-white mt-3 mb-2 truncate">{project.name}</h3>
          <p className="text-gray-400 text-lg">
            Budget: <span className="font-semibold text-green-400">${budget.toLocaleString()}</span>
          </p>
        </div>

        <div className="border-t border-gray-700 mt-4 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
          <button
            onClick={() => setAssignOpen(true)}
            className="w-full sm:flex-1 text-center py-2 px-3 bg-blue-600/80 hover:bg-blue-600 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <FiUsers />
            <span>Assign</span>
          </button>
          
          <div className="flex items-center justify-center sm:justify-end gap-2">
            {/* ... (icon buttons remain the same) ... */}
            <button
              onClick={() => setDetailsOpen(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            >
              <FiEye size={18} />
            </button>
            <button
              onClick={() => setEditOpen(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            >
              <FiEdit size={18} />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-colors"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL PROPS --- */}
      {/* Pass the correct props to each modal */}
      
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
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-5 flex flex-col justify-between h-full animate-pulse">
            <div>
                <div className="h-5 bg-gray-700 rounded-full w-1/3"></div>
                <div className="h-6 bg-gray-700 rounded mt-4 w-3/4"></div>
                <div className="h-5 bg-gray-700 rounded mt-3 w-1/2"></div>
            </div>
            <div className="border-t border-gray-700 mt-4 pt-4 flex items-center justify-between space-x-2">
                <div className="h-9 bg-gray-700 rounded-md w-1/3"></div>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                    <div className="h-8 w-8 bg-gray-700 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;