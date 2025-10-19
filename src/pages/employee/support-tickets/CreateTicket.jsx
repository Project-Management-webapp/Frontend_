import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RiUploadCloudLine, RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { createTicket } from "../../../api/employee/supportTicket";

const CreateTicket = ({ setActiveView }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "medium",
    category: "technical",
  });
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: "technical_issue", label: "Technical Issue" },
    { value: "account_access", label: "Account Issue" },
    { value: "payment_issue", label: "Payment Issue" },
    { value: "project_concern", label: "Project Related" },
    { value: "suggestion", label: "Suggestion" },
    { value: "leave_request", label: "Leave request" },
    { value: "workplace_issue", label: "Workplace Issue" },
    { value: "complaint", label: "Complaint" },
    { value: "other", label: "Other" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (attachments.length + files.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await createTicket({
        ...formData,
        attachments,
      });
      toast.success("Support ticket created successfully!");
      setActiveView("supportTickets");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Create Support Ticket</h2>
        <button
          onClick={() => setActiveView("supportTickets")}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <IoMdClose size={28} />
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief description of your issue"
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.subject ? "border-red-400" : "border-gray-600"
              } rounded-lg text-white focus:outline-none focus:border-purple-400`}
            />
            {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Provide detailed information about your issue..."
              className={`w-full px-4 py-2 bg-gray-700 border ${
                errors.description ? "border-red-400" : "border-gray-600"
              } rounded-lg text-white focus:outline-none focus:border-purple-400`}
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Attachments (Optional - Max 5 files)
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <RiUploadCloudLine className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-300 mb-1">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">PNG, JPG, PDF, DOC (max 5 files)</p>
              </label>
            </div>

            {/* File List */}
            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg"
                  >
                    <span className="text-gray-300 text-sm truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      <RiDeleteBin6Line size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setActiveView("supportTickets")}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
