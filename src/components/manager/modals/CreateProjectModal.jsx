import React, { useState } from 'react';
import { createProject } from '../../../api/manager/project';
import Toaster from '../../Toaster';
import { IoMdClose } from 'react-icons/io';
import { FormInput, FormSelect, FormTextarea } from '../../atoms/FormFields';
import { FiTrash2 } from 'react-icons/fi';
const CreateProjectModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectType: 'web_development',
    category: '',
    startDate: '',
    deadline: '',
    estimatedHours: '',
    priority: 'medium',
    budget: '',
    currency: 'USD',
    billingType: 'fixed_price',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    technologies: '',
    frameworks: '',
    programmingLanguages: '',
    database: '',
    cloudProvider: '',
    architecture: '',
    repositoryUrl: '',
    repositoryType: '',
    productionUrl: '',
    stagingUrl: '',
    developmentUrl: '',
    documentationUrl: '',
    apiDocumentationUrl: '',
    figmaUrl: '',
    jiraUrl: '',
    slackChannel: '',
    referenceLinks: '',
    risks: '',
    issues: '',
    notes: '',
    teamSize: '',
    teamLead: '',
    visibility: 'internal',
    deploymentStatus: '',
    lastDeploymentDate: '',
    deploymentFrequency: '',
    cicdPipeline: '',
    milestones: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[index][field] = value;
    setFormData((prev) => ({ ...prev, milestones: updatedMilestones }));
  };
  const handleAddMilestone = () => {
    setFormData((prev) => ({
      ...prev,
      milestones: [
        ...prev.milestones,
        { name: '', description: '', deadline: '', status: '', completedDate: '' },
      ],
    }));
  };
  const handleRemoveMilestone = (index) => {
    const updated = [...formData.milestones];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, milestones: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = { ...formData };
    Object.keys(payload).forEach((key) => {
      if (payload[key] === '') payload[key] = null;
    });

    try {
      const response = await createProject(payload);
      if (response.success) {
        setToast({
          show: true,
          message: 'Project created successfully!',
          type: 'success',
        });
        onSuccess();
        setTimeout(() => onClose(), 1500);
      } else {
        setToast({
          show: true,
          message: response.message || 'Failed to create project.',
          type: 'error',
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: error.message || 'An unexpected error occurred.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-3xl border border-white/20 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-9 pb-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Create New Project</h2>
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-6 right-6 text-gray-400 hover:text-white"
          >
            <IoMdClose size={24} />
          </button>
        </div>

       
        {toast.show && (
          <div className="absolute top-20 right-6 z-20">
            <Toaster
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ ...toast, show: false })}
            />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-9 space-y-6">
          {/* === BASIC INFO === */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="name" label="Project Name" value={formData.name} onChange={handleChange} required />
              <FormSelect id="projectType" label="Project Type" value={formData.projectType} onChange={handleChange} required>
                <option value="web_development">Web Development</option>
                <option value="mobile_app">Mobile App</option>
                <option value="data_science">Data Science</option>
                <option value="other">Other</option>
              </FormSelect>
            </div>
            <FormInput id="category" label="Category" value={formData.category} onChange={handleChange} />
            <FormTextarea id="description" label="Description" value={formData.description} onChange={handleChange} />
          </Section>

          {/* === TIMELINE === */}
          <Section title="Timeline">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="startDate" label="Start Date" type="date" value={formData.startDate} onChange={handleChange} required />
              <FormInput id="deadline" label="Deadline" type="date" value={formData.deadline} onChange={handleChange} required />
              <FormInput id="estimatedHours" label="Estimated Hours" type="number" value={formData.estimatedHours} onChange={handleChange} />
              <FormSelect id="priority" label="Priority" value={formData.priority} onChange={handleChange} required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </FormSelect>
            </div>
          </Section>

          {/* === FINANCIAL === */}
          <Section title="Financial">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput id="budget" label="Budget" type="number" value={formData.budget} onChange={handleChange} />
              <FormSelect id="currency" label="Currency" value={formData.currency} onChange={handleChange}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
              </FormSelect>
              <FormSelect id="billingType" label="Billing Type" value={formData.billingType} onChange={handleChange}>
                <option value="fixed_price">Fixed Price</option>
                <option value="hourly_rate">Hourly Rate</option>
                <option value="retainer">Retainer</option>
              </FormSelect>
            </div>
          </Section>

          {/* === CLIENT === */}
          <Section title="Client Information (Optional)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="clientName" label="Client Name" value={formData.clientName} onChange={handleChange} />
              <FormInput id="clientEmail" label="Client Email" type="email" value={formData.clientEmail} onChange={handleChange} />
              <FormInput id="clientPhone" label="Client Phone" value={formData.clientPhone} onChange={handleChange} />
              <FormInput id="clientCompany" label="Client Company" value={formData.clientCompany} onChange={handleChange} />
            </div>
          </Section>

          {/* === TECHNICAL === */}
          <Section title="Technical Details (Optional)">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="technologies" label="Technologies" placeholder="e.g. React, Node.js" value={formData.technologies} onChange={handleChange} />
              <FormInput id="frameworks" label="Frameworks" placeholder="e.g. Next.js, Bootstrap" value={formData.frameworks} onChange={handleChange} />
              <FormInput id="programmingLanguages" label="Programming Languages" placeholder="e.g. Java, Python" value={formData.programmingLanguages} onChange={handleChange} />
              <FormInput id="database" label="Database" value={formData.database} onChange={handleChange} />
              <FormInput id="cloudProvider" label="Cloud Provider" value={formData.cloudProvider} onChange={handleChange} />
              <FormInput id="architecture" label="Architecture" value={formData.architecture} onChange={handleChange} />
            </div>
          </Section>

          {/* === MILESTONES === */}
          <Section title="Project Milestones">
            {formData.milestones.length > 0 ? (
              formData.milestones.map((milestone, index) => (
                <div key={index} className="border border-gray-700 bg-gray-800 p-4 rounded-lg mb-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      id={`milestone-name-${index}`}
                      label="Milestone Name"
                      value={milestone.name}
                      onChange={(e) => handleMilestoneChange(index, 'name', e.target.value)}
                    />
                    <FormInput
                      id={`milestone-deadline-${index}`}
                      type="date"
                      label="Deadline"
                      value={milestone.deadline}
                      onChange={(e) => handleMilestoneChange(index, 'deadline', e.target.value)}
                    />
                  </div>

                  <FormTextarea
                    id={`milestone-description-${index}`}
                    label="Description"
                    rows={2}
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormSelect
                      id={`milestone-status-${index}`}
                      label="Status"
                      value={milestone.status}
                      onChange={(e) => handleMilestoneChange(index, 'status', e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </FormSelect>

                    {milestone.status === 'completed' && (
                      <FormInput
                        id={`milestone-completedDate-${index}`}
                        type="date"
                        label="Completed Date"
                        value={milestone.completedDate || ''}
                        onChange={(e) => handleMilestoneChange(index, 'completedDate', e.target.value)}
                      />
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(index)}
                      className="text-red-400 cursor-pointer hover:text-red-500 font-bold"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mb-2">No milestones added yet.</p>
            )}

            <button
              type="button"
              onClick={handleAddMilestone}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors"
            >
              + Add Milestone
            </button>
          </Section>

          {/* === TEAM === */}
          <Section title="Team & Deployment">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput id="teamSize" label="Team Size" type="number" value={formData.teamSize} onChange={handleChange} />
              <FormInput id="teamLead" label="Team Lead" value={formData.teamLead} onChange={handleChange} />
              <FormSelect id="visibility" label="Visibility" value={formData.visibility} onChange={handleChange}>
                <option value="internal">Internal</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </FormSelect>
            </div>
          </Section>

          {/* === RISKS === */}
          <Section title="Risks & Notes">
            <FormTextarea id="risks" label="Risks" value={formData.risks} onChange={handleChange} rows={2} />
            <FormTextarea id="issues" label="Issues" value={formData.issues} onChange={handleChange} rows={2} />
            <FormTextarea id="notes" label="Additional Notes" value={formData.notes} onChange={handleChange} rows={2} />
          </Section>
        </form>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-4 p-6 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="btn"
          >
            {isLoading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-purple-300 border-b border-gray-700 pb-2 mb-2">{title}</h3>
    {children}
  </div>
);

export default CreateProjectModal;
