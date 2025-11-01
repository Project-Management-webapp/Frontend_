import React, { useState, useEffect } from 'react'
import { getAllProject } from '../../../api/manager/project'
import CompletedProjectCard, { CompletedProjectCardSkeleton } from '../../../components/manager/cards/CompletedProjectCard'
import CompletedProjectDetailModal from '../../../components/manager/modals/CompletedProjectDetailModal'
import { FiCheckCircle } from 'react-icons/fi'
import { FaChevronLeft } from 'react-icons/fa'
import Toaster from '../../../components/Toaster'

const CompletedProjects = ({ setActiveView }) => {
  // State for loading, error, and the filtered list of projects
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        
        // 1. Fetch all projects
        const response = await getAllProject()

        if (response.success) {
          // 2. Filter for "completed" projects
          const allProjects = response.data.projects.rows || []
          const completed = allProjects.filter(p => p.status === 'completed')
          setProjects(completed)
        } else {
          setToast({ show: true, message: response.message || 'Failed to fetch projects', type: 'error' })
        }
      } catch (err) {
        console.error("Error fetching projects:", err)
        setToast({ show: true, message: err.message || 'An unexpected error occurred', type: 'error' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, []) // Empty dependency array ensures this runs once on mount

  // --- Modal Handlers ---
  const handleOpenModal = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  // --- Render Logic ---

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
          <div className="mb-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white flex items-center gap-3">
              <FiCheckCircle className="text-green-500" />
              Completed Projects
            </h1>
            <p className="text-gray-400 mt-3 text-base sm:text-lg">
              View all successfully completed projects and their details
            </p>
          </div>
        </div>

        {/* Loading / Empty / Grid */}
        <div className="max-w-[1600px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(6)].map((_, idx) => (
                <CompletedProjectCardSkeleton key={idx} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-2xl p-12 sm:p-16 flex flex-col items-center justify-center text-center">
              <div className="bg-green-600/10 p-8 rounded-full mb-6">
                <FiCheckCircle className="text-green-500 text-7xl" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">No Completed Projects Yet</h3>
              <p className="text-gray-400 text-base sm:text-lg max-w-md">
                Completed projects will appear here once you mark them as complete
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {projects.map((project) => (
                <CompletedProjectCard 
                  key={project.id} 
                  project={project}
                  onViewDetails={() => handleOpenModal(project)} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedProject && (
        <CompletedProjectDetailModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}

export default CompletedProjects