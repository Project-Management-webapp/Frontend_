import React, { useState, useEffect } from 'react'
import { getAllProject } from '../../../api/manager/project'
import CompletedProjectCard, { CompletedProjectCardSkeleton } from '../../../components/manager/cards/CompletedProjectCard'
import CompletedProjectDetailModal from '../../../components/manager/modals/CompletedProjectDetailModal'

const CompletedProjects = () => {
  // State for loading, error, and the filtered list of projects
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // 1. Fetch all projects
        const response = await getAllProject()

        if (response.success) {
          // 2. Filter for "completed" projects
          const allProjects = response.data.projects.rows || []
          const completed = allProjects.filter(p => p.status === 'completed')
          setProjects(completed)
        } else {
          setError(response.message || 'Failed to fetch projects')
        }
      } catch (err) {
        console.error("Error fetching projects:", err)
        setError(err.message || 'An unexpected error occurred')
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

  // 1. Show skeletons while loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(4)].map((_, idx) => (
          <CompletedProjectCardSkeleton key={idx} />
        ))}
      </div>
    )
  }

  // 2. Show error message if API call fails
  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-100 rounded-md">
        <strong>Error:</strong> {error}
      </div>
    )
  }

  // 3. Show completed projects or a "no projects" message
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <CompletedProjectCard 
              key={project.id} 
              project={project}
              onViewDetails={() => handleOpenModal(project)} 
            />
          ))
        ) : (
          // Show this if there are no completed projects
          <div className="col-span-full text-center text-gray-500 py-10">
            <p>No completed projects found.</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedProject && (
        <CompletedProjectDetailModal
          project={selectedProject}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default CompletedProjects