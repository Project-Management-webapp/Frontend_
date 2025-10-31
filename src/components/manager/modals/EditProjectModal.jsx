import React, { useState } from 'react';
import { updateProject } from '../../../api/manager/project';
import Toaster from '../../Toaster';
import { IoMdClose, IoMdAdd } from 'react-icons/io';
import { FiTrash2 } from 'react-icons/fi';
import { FormInput, FormTextarea, FormSelect } from '../../atoms/FormFields';

const formatDataForForm = (data) => {
  const formatted = { ...data };
  Object.keys(formatted).forEach(key => {
    if (formatted[key] === null) formatted[key] = '';
  });
  ['startDate', 'deadline', 'actualStartDate', 'actualEndDate', 'lastDeploymentDate'].forEach(dateKey => {
    if (formatted[dateKey]) {
      formatted[dateKey] = new Date(formatted[dateKey]).toISOString().split('T')[0];
    }
  });
  if (!Array.isArray(formatted.milestones)) formatted.milestones = [];

  // Parse risks if they are JSON strings
  if (typeof formatted.risks === 'string') {
    try {
      formatted.risks = JSON.parse(formatted.risks);
    } catch (e) {
      formatted.risks = [];
    }
  }
  if (!Array.isArray(formatted.risks)) formatted.risks = [];

  // Parse issues if they are JSON strings
  if (typeof formatted.issues === 'string') {
    try {
      formatted.issues = JSON.parse(formatted.issues);
    } catch (e) {
      formatted.issues = [];
    }
  }
  if (!Array.isArray(formatted.issues)) formatted.issues = [];

  // Parse referenceLinks if they are JSON strings
  if (typeof formatted.referenceLinks === 'string') {
    try {
      formatted.referenceLinks = JSON.parse(formatted.referenceLinks);
    } catch (e) {
      formatted.referenceLinks = [];
    }
  }
  if (!Array.isArray(formatted.referenceLinks)) formatted.referenceLinks = [];

  // Parse estimatedMaterials if they are JSON strings
  if (typeof formatted.estimatedMaterials === 'string') {
    try {
      formatted.estimatedMaterials = JSON.parse(formatted.estimatedMaterials);
    } catch (e) {
      formatted.estimatedMaterials = [];
    }
  }
  if (!Array.isArray(formatted.estimatedMaterials)) formatted.estimatedMaterials = [];

  // Parse estimatedConsumables if they are JSON strings
  if (typeof formatted.estimatedConsumables === 'string') {
    try {
      formatted.estimatedConsumables = JSON.parse(formatted.estimatedConsumables);
    } catch (e) {
      formatted.estimatedConsumables = [];
    }
  }
  if (!Array.isArray(formatted.estimatedConsumables)) formatted.estimatedConsumables = [];

  return formatted;
};

const EditProjectModal = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(() => formatDataForForm(project));
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...formData.milestones];
    updated[index] = { ...updated[index], [field]: value };
    setFormData(prev => ({ ...prev, milestones: updated }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { name: '', description: '', deadline: '', status: '', completedDate: '' }]
    }));
  };

  const removeMilestone = (index) => {
    const updated = formData.milestones.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, milestones: updated }));
  };

  // Handle reference links
  const handleAddReferenceLink = () => {
    setFormData(prev => ({
      ...prev,
      referenceLinks: [...prev.referenceLinks, { title: '', url: '' }]
    }));
  };

  const handleRemoveReferenceLink = (index) => {
    const updatedLinks = formData.referenceLinks.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, referenceLinks: updatedLinks }));
  };

  const handleReferenceLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.referenceLinks];
    updatedLinks[index][field] = value;
    setFormData(prev => ({ ...prev, referenceLinks: updatedLinks }));
  };

  // Handle estimated materials
  const addMaterialRow = () => {
    setFormData(prev => ({
      ...prev,
      estimatedMaterials: [...prev.estimatedMaterials, '']
    }));
  };

  const handleArrayChange = (e, fieldName, index) => {
    const { value } = e.target;
    setFormData(prev => {
      const newArray = [...prev[fieldName]];
      newArray[index] = value;
      return { ...prev, [fieldName]: newArray };
    });
  };

  const handleArrayRemove = (fieldName, indexToRemove) => {
    setFormData(prev => {
      const currentArray = prev[fieldName];
      const newArray = currentArray.filter((_, index) => index !== indexToRemove);
      return { ...prev, [fieldName]: newArray };
    });
  };

  // Handle estimated consumables
  const addConsumableRow = () => {
    setFormData(prev => ({
      ...prev,
      estimatedConsumables: [...prev.estimatedConsumables, '']
    }));
  };

  // Handle risks
  const handleAddRisk = () => {
    setFormData(prev => ({
      ...prev,
      risks: [...prev.risks, { description: '', severity: 'medium', mitigation: '', status: 'open' }]
    }));
  };

  const handleRemoveRisk = (index) => {
    const updatedRisks = formData.risks.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, risks: updatedRisks }));
  };

  const handleRiskChange = (index, field, value) => {
    const updatedRisks = [...formData.risks];
    updatedRisks[index][field] = value;
    setFormData(prev => ({ ...prev, risks: updatedRisks }));
  };

  // Handle issues
  const handleAddIssue = () => {
    setFormData(prev => ({
      ...prev,
      issues: [...prev.issues, { description: '', priority: 'medium', status: 'open' }]
    }));
  };

  const handleRemoveIssue = (index) => {
    const updatedIssues = formData.issues.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, issues: updatedIssues }));
  };

  const handleIssueChange = (index, field, value) => {
    const updatedIssues = [...formData.issues];
    updatedIssues[index][field] = value;
    setFormData(prev => ({ ...prev, issues: updatedIssues }));
  };

  const showToast = (message, type = 'success', duration = 2000) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { ...formData };
    Object.keys(payload).forEach((key) => {
      if (payload[key] === '') payload[key] = null;
    });

    try {
      const response = await updateProject(project.id, payload);
      if (response.success) {
        showToast('Project updated successfully!', 'success');
        onSuccess();
        setTimeout(onClose, 1500);
      } else {
        showToast(response.message || 'Failed to update project.', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Unexpected error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-3xl border border-white/20 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-purple-300">Edit Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <IoMdClose size={24} />
          </button>
        </div>

        {/* Toast */}
        {toast.show && (
          <Toaster
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(prev => ({ ...prev, show: false }))}
          />
        )}

        {/* Form */}
        <form
          id="edit-project-form"
          onSubmit={handleSubmit}
          className="flex-grow overflow-y-auto p-8 space-y-6"
        >
          {/* === BASIC INFO === */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="name" label="Project Name" value={formData.name} onChange={handleChange} required />
              <FormSelect id="projectType" label="Project Type" value={formData.projectType} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="quoted">Quoted</option>
                <option value="time and materials">Time and Materials</option>
                <option value="other">Other</option>
              </FormSelect>
            </div>
            {formData.projectType === 'other' && (
              <FormInput id="customProjectType" label="Custom Project Type" value={formData.customProjectType} onChange={handleChange} placeholder="Specify project type" />
            )}
            <FormTextarea id="description" label="Description" value={formData.description} onChange={handleChange} />
          </Section>

          {/* === TIMELINE === */}
          <Section title="Timeline">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="startDate" label="Start Date" type="date" value={formData.startDate} onChange={handleChange} required />
              <FormInput id="deadline" label="Deadline" type="date" value={formData.deadline} onChange={handleChange} required />
              <FormInput id="estimatedHours" label="Estimated Hours" type="number" value={formData.estimatedHours} onChange={handleChange} />
              <FormSelect id="priority" label="Priority" value={formData.priority} onChange={handleChange} required>
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </FormSelect>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormInput id="actualStartDate" label="Actual Start Date" type="date" value={formData.actualStartDate} onChange={handleChange} />
              <FormInput id="actualEndDate" label="Actual End Date" type="date" value={formData.actualEndDate} onChange={handleChange} />
            </div>
          </Section>

          {/* === CONSUMABLES AND MATERIALS === */}
          <Section title="Consumables and Materials">
            {/* Materials Section */}
            <h3 className="font-semibold mb-2">Materials</h3>

            {/* Loop through materials */}
            {formData.estimatedMaterials && formData.estimatedMaterials.map((value, i) => (
              <div key={i} className="flex items-center gap-4 mb-2">
                {/* Input field (takes up remaining space) */}
                <div className="flex-grow">
                  <FormInput
                    id={`estimatedMaterials-${i}`}
                    label={`Estimated Material ${i + 1}`}
                    value={value}
                    onChange={(e) => handleArrayChange(e, "estimatedMaterials", i)}
                  />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleArrayRemove("estimatedMaterials", i)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm self-center pt-5"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add Material Button */}
            <button type="button" onClick={addMaterialRow} className="text-blue-500 text-sm mb-4">
              + Add Material
            </button>

            {/* Consumables Section */}
            <h3 className="font-semibold mb-2">Consumables</h3>

            {/* Loop through consumables */}
            {formData.estimatedConsumables && formData.estimatedConsumables.map((value, i) => (
              <div key={i} className="flex items-center gap-4 mb-2">
                {/* Input field (takes up remaining space) */}
                <div className="flex-grow">
                  <FormInput
                    id={`estimatedConsumables-${i}`}
                    label={`Estimated Consumable ${i + 1}`}
                    value={value}
                    onChange={(e) => handleArrayChange(e, "estimatedConsumables", i)}
                  />
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleArrayRemove("estimatedConsumables", i)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm self-center pt-5"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add Consumable Button */}
            <button type="button" onClick={addConsumableRow} className="text-blue-500 text-sm">
              + Add Consumable
            </button>
          </Section>

          {/* === FINANCIAL === */}
          <Section title="Financial">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput id="budget" label="Budget" type="number" value={formData.budget} onChange={handleChange} />
              <FormSelect id="currency" label="Currency" value={formData.currency} onChange={handleChange}>
                <option value="">Select Currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="INR">INR</option>
              </FormSelect>
              <FormSelect id="billingType" label="Billing Type" value={formData.billingType} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="fixed_price">Fixed Price</option>
                <option value="hourly">Hourly</option>
                <option value="monthly_retainer">Monthly Retainer</option>
                <option value="milestone_based">Milestone Based</option>
                <option value="other">Other</option>
              </FormSelect>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormInput id="allocatedAmount" label="Allocated Amount" type="number" value={formData.allocatedAmount} onChange={handleChange} />
              <FormInput id="spentAmount" label="Spent Amount" type="number" value={formData.spentAmount} onChange={handleChange} />
            </div>
          </Section>

          {/* === COMPANY INFO === */}
          <Section title="Company Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="companyName" label="Company Name" value={formData.companyName} onChange={handleChange} />
              <FormInput id="companyEmail" label="Company Email" type="email" value={formData.companyEmail} onChange={handleChange} />
              <FormInput id="companyPhone" label="Company Phone" value={formData.companyPhone} onChange={handleChange} />
            </div>
          </Section>

          {/* === REFERENCE LINKS === */}
          <Section title="Reference Links">
            {formData.referenceLinks && formData.referenceLinks.length > 0 ? (
              formData.referenceLinks.map((link, index) => (
                <div key={index} className="border border-gray-700 bg-gray-900 p-4 rounded-lg mb-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      id={`link-title-${index}`}
                      label="Title"
                      value={link.title}
                      onChange={(e) => handleReferenceLinkChange(index, 'title', e.target.value)}
                    />
                    <FormInput
                      id={`link-url-${index}`}
                      label="URL"
                      type="url"
                      value={link.url}
                      onChange={(e) => handleReferenceLinkChange(index, 'url', e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveReferenceLink(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mb-2">No reference links added yet.</p>
            )}
            <button
              type="button"
              onClick={handleAddReferenceLink}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors"
            >
              + Add Reference Link
            </button>
          </Section>

          {/* === MILESTONES === */}
          <Section title="Project Milestones">
            {formData.milestones.length > 0 ? (
              formData.milestones.map((milestone, index) => (
                <div key={index} className="border border-gray-700 bg-gray-900 p-4 rounded-lg mb-4 space-y-3">
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
                      onClick={() => removeMilestone(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mb-2">No milestones added yet.</p>
            )}

            <button
              type="button"
              onClick={addMilestone}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors"
            >
              + Add Milestone
            </button>
          </Section>

          {/* === TEAM & SETTINGS === */}
          <Section title="Team & Settings">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput id="teamSize" label="Team Size" type="number" value={formData.teamSize} onChange={handleChange} />
              <FormSelect id="visibility" label="Visibility" value={formData.visibility} onChange={handleChange}>
                <option value="">Select Visibility</option>
                <option value="internal">Internal</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </FormSelect>
              <FormSelect id="testingStatus" label="Testing Status" value={formData.testingStatus} onChange={handleChange}>
                <option value="">Select Status</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </FormSelect>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormSelect id="status" label="Project Status" value={formData.status} onChange={handleChange}>
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </FormSelect>
            </div>
          </Section>

          {/* === RISKS === */}
          <Section title="Project Risks">
            {formData.risks.length > 0 ? (
              formData.risks.map((risk, index) => (
                <div key={index} className="border border-gray-700 bg-gray-900 p-4 rounded-lg mb-4 space-y-3">
                  <FormTextarea
                    id={`risk-description-${index}`}
                    label="Description"
                    rows={2}
                    value={risk.description}
                    onChange={(e) => handleRiskChange(index, 'description', e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormSelect
                      id={`risk-severity-${index}`}
                      label="Severity"
                      value={risk.severity}
                      onChange={(e) => handleRiskChange(index, 'severity', e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </FormSelect>
                    <FormSelect
                      id={`risk-status-${index}`}
                      label="Status"
                      value={risk.status}
                      onChange={(e) => handleRiskChange(index, 'status', e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="mitigated">Mitigated</option>
                      <option value="closed">Closed</option>
                    </FormSelect>
                  </div>
                  <FormInput
                    id={`risk-mitigation-${index}`}
                    label="Mitigation Strategy"
                    value={risk.mitigation}
                    onChange={(e) => handleRiskChange(index, 'mitigation', e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveRisk(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mb-2">No risks added yet.</p>
            )}
            <button
              type="button"
              onClick={handleAddRisk}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors"
            >
              + Add Risk
            </button>
          </Section>

          {/* === ISSUES === */}
          <Section title="Project Issues">
            {formData.issues.length > 0 ? (
              formData.issues.map((issue, index) => (
                <div key={index} className="border border-gray-700 bg-gray-900 p-4 rounded-lg mb-4 space-y-3">
                  <FormTextarea
                    id={`issue-description-${index}`}
                    label="Description"
                    rows={2}
                    value={issue.description}
                    onChange={(e) => handleIssueChange(index, 'description', e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormSelect
                      id={`issue-priority-${index}`}
                      label="Priority"
                      value={issue.priority}
                      onChange={(e) => handleIssueChange(index, 'priority', e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </FormSelect>
                    <FormSelect
                      id={`issue-status-${index}`}
                      label="Status"
                      value={issue.status}
                      onChange={(e) => handleIssueChange(index, 'status', e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </FormSelect>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveIssue(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm mb-2">No issues added yet.</p>
            )}
            <button
              type="button"
              onClick={handleAddIssue}
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-md transition-colors"
            >
              + Add Issue
            </button>
          </Section>

          {/* === NOTES === */}
          <Section title="Additional Notes">
            <FormTextarea id="notes" label="Notes" value={formData.notes} onChange={handleChange} rows={3} />
          </Section>
        </form>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-700 bg-gray-900">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-project-form"
            disabled={isLoading}
            className="btn"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-purple-300 border-b border-gray-700 pb-2 mb-2">{title}</h3>
    {children}
  </div>
);

export default EditProjectModal;
