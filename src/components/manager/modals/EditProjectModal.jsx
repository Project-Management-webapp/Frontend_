import React, { useState } from 'react';
import { updateProject } from '../../../api/manager/project';
import Toaster from '../../Toaster';
import { IoMdClose, IoMdAdd, IoMdRemove } from 'react-icons/io';
import {FiTrash2 } from 'react-icons/fi';
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
    setFormData(prev => ({ ...prev, milestones: [...prev.milestones, { title: '', description: '', dueDate: '' }] }));
  };

  const removeMilestone = (index) => {
    const updated = formData.milestones.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, milestones: updated }));
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
          className="flex-grow overflow-y-auto p-8 space-y-8"
        >
          {/* --- Basic Info --- */}
          <section>
            <h3 className="text-lg font-semibold text-purple-300 mb-3 border-b border-gray-700 pb-1">Basic Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="name" label="Project Name" value={formData.name} onChange={handleChange} required />
              <FormSelect id="projectType" label="Project Type" value={formData.projectType} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="web_development">Web Development</option>
                <option value="mobile_app">Mobile App</option>
                <option value="data_science">Data Science</option>
              </FormSelect>
            </div>
            <FormTextarea id="description" label="Description" value={formData.description} onChange={handleChange} rows={3} />
          </section>

          {/* --- Timeline & Status --- */}
          <section>
            <h3 className="text-lg font-semibold text-purple-300 mb-3 border-b border-gray-700 pb-1">Timeline & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <FormInput id="startDate" label="Start Date" type="date" value={formData.startDate} onChange={handleChange} />
              <FormInput id="deadline" label="Deadline" type="date" value={formData.deadline} onChange={handleChange} />
              <FormInput id="actualStartDate" label="Actual Start" type="date" value={formData.actualStartDate} onChange={handleChange} />
              <FormInput id="actualEndDate" label="Actual End" type="date" value={formData.actualEndDate} onChange={handleChange} />
              <FormSelect id="status" label="Status" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </FormSelect>
              <FormSelect id="priority" label="Priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </FormSelect>
            </div>
          </section>

          {/* --- Client Info --- */}
          <section>
            <h3 className="text-lg font-semibold text-purple-300 mb-3 border-b border-gray-700 pb-1">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="clientName" label="Client Name" value={formData.clientName} onChange={handleChange} />
              <FormInput id="clientEmail" label="Client Email" type="email" value={formData.clientEmail} onChange={handleChange} />
              <FormInput id="clientPhone" label="Client Phone" value={formData.clientPhone} onChange={handleChange} />
              <FormInput id="clientCompany" label="Client Company" value={formData.clientCompany} onChange={handleChange} />
            </div>
          </section>

          {/* --- Technical Details --- */}
          <section>
            <h3 className="text-lg font-semibold text-purple-300 mb-3 border-b border-gray-700 pb-1">Technical Stack</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="technologies" label="Technologies" value={formData.technologies} onChange={handleChange} />
              <FormInput id="frameworks" label="Frameworks" value={formData.frameworks} onChange={handleChange} />
              <FormInput id="programmingLanguages" label="Languages" value={formData.programmingLanguages} onChange={handleChange} />
              <FormInput id="database" label="Database" value={formData.database} onChange={handleChange} />
              <FormInput id="cloudProvider" label="Cloud Provider" value={formData.cloudProvider} onChange={handleChange} />
              <FormInput id="architecture" label="Architecture" value={formData.architecture} onChange={handleChange} />
            </div>
          </section>

          {/* --- Financial Details --- */}
          <section>
            <h3 className="text-lg font-semibold text-purple-300 mb-3 border-b border-gray-700 pb-1">Financial Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput id="budget" label="Budget" type="number" value={formData.budget} onChange={handleChange} />
              <FormInput id="allocatedAmount" label="Allocated Amount" type="number" value={formData.allocatedAmount} onChange={handleChange} />
              <FormInput id="spentAmount" label="Spent Amount" type="number" value={formData.spentAmount} onChange={handleChange} />
              <FormSelect id="billingType" label="Billing Type" value={formData.billingType} onChange={handleChange}>
                <option value="fixed_price">Fixed Price</option>
                <option value="hourly">Hourly</option>
              </FormSelect>
            </div>
          </section>

          {/* --- Milestones --- */}
          <section>
            <h3 className="text-lg font-semibold text-purple-300 mb-3 border-b border-gray-700 pb-1 flex items-center justify-between">
              Milestones
              <button type="button" onClick={addMilestone} className="flex items-center gap-1 text-purple-400 hover:text-purple-300">
                <IoMdAdd /> Add
              </button>
            </h3>

            {formData.milestones.length === 0 && <p className="text-gray-400">No milestones added yet.</p>}

            {formData.milestones.map((ms, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 items-end">
                <FormInput
                  id={`milestoneTitle${idx}`}
                  label="Title"
                  value={ms.title}
                  onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                />
                <FormTextarea
                  id={`milestoneDesc${idx}`}
                  label="Description"
                  value={ms.description}
                  onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
                  rows={1}
                />
                <div className="flex gap-2">
                  <FormInput
                    id={`milestoneDue${idx}`}
                    label="Due Date"
                    type="date"
                    value={ms.dueDate}
                    onChange={(e) => handleMilestoneChange(idx, 'dueDate', e.target.value)}
                  />
                  <button type="button" onClick={() => removeMilestone(idx)} className="text-red-400 hover:text-red-300 mt-5">
                    <FiTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* --- Risks, Issues, Notes --- */}
          <section>
            <h3 className="text-lg font-semibold text-purple-300 mb-3 border-b border-gray-700 pb-1">Risks & Notes</h3>
            <FormTextarea id="risks" label="Risks" value={formData.risks} onChange={handleChange} rows={2} />
            <FormTextarea id="issues" label="Issues" value={formData.issues} onChange={handleChange} rows={2} />
            <FormTextarea id="notes" label="Additional Notes" value={formData.notes} onChange={handleChange} rows={2} />
          </section>
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

export default EditProjectModal;
