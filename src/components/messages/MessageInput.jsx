import React, { useState } from "react";
import { RiSendPlaneFill, RiAttachmentLine, RiCloseLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

const MessageInput = ({ onSend, replyTo, onCancelReply, disabled = false }) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 5) {
      alert("Maximum 5 files allowed");
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0) return;

    onSend({ message: message.trim(), files });
    setMessage("");
    setFiles([]);
  };

  return (
    <div className="border-t border-white/20 p-4">
      {replyTo && (
        <div className="mb-2 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs text-purple-400 mb-1">
              Replying to {replyTo.User?.firstName} {replyTo.User?.lastName}
            </p>
            <p className="text-sm text-gray-300">{replyTo.message?.substring(0, 100)}...</p>
          </div>
          <button
            onClick={onCancelReply}
            className="text-gray-400 hover:text-white transition-colors ml-2"
          >
            <IoMdClose size={18} />
          </button>
        </div>
      )}

      {files.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg"
            >
              <span className="text-sm text-gray-300 truncate max-w-[150px]">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <RiCloseLine size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            rows={2}
            disabled={disabled}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 resize-none disabled:opacity-50"
          />
        </div>
        <label className="cursor-pointer p-2 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 transition-colors">
          <RiAttachmentLine size={20} className="text-gray-300" />
          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
        </label>
        <button
          type="submit"
          disabled={disabled || (!message.trim() && files.length === 0)}
          className="p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RiSendPlaneFill size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
